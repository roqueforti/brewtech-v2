<?php

namespace App\Http\Controllers\CafeAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Menampilkan halaman Buku Kas beserta SEMUA datanya.
     * Filtering bulan/tahun dilakukan di frontend (React).
     */
    public function index(Request $request)
    {
        $transactions = Transaction::where('cafe_id', auth()->user()->cafe_id)
            ->orderBy('tanggal', 'asc')
            ->orderBy('created_at', 'asc') // tiebreaker agar urutan konsisten
            ->get();

        return Inertia::render('CafeAdmin/Transactions', [
            'transactions' => $transactions,
        ]);
    }

    /**
 * Menghapus SATU transaksi berdasarkan ID
 */
public function destroy(Transaction $transaction)
{
    if ($transaction->cafe_id !== auth()->user()->cafe_id) {
        abort(403);
    }

    $transaction->delete();
    return back()->with('message', 'Transaksi berhasil dihapus.');
}

/**
 * Menghapus SEMUA transaksi milik kafe ini
 */
public function destroyAll()
{
    Transaction::where('cafe_id', auth()->user()->cafe_id)->delete();
    return back()->with('message', 'Semua transaksi berhasil dihapus.');
}


    /**
     * Menyimpan data transaksi baru ke Database
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal'    => 'required|date',
            'keterangan' => 'required|string|max:255',
            'tipe'       => 'required|in:debit,kredit',
            'nominal'    => 'required|numeric|min:0',
        ]);

        Transaction::create([
            'cafe_id'    => auth()->user()->cafe_id,
            'user_id'    => auth()->id(),
            'tanggal'    => $validated['tanggal'],
            'keterangan' => $validated['keterangan'],
            'tipe'       => $validated['tipe'],
            'nominal'    => $validated['nominal'],
        ]);

        return redirect()->back()->with('message', 'Transaksi berhasil dicatat!');
    }

    /**
     * Export data ke file CSV Buku Kas
     */
    public function export()
    {
        $transactions = Transaction::where('cafe_id', auth()->user()->cafe_id)
            ->orderBy('tanggal', 'asc')
            ->get();

        $filename = 'transaksi-buku-kas-' . date('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($transactions) {
            $handle = fopen('php://output', 'w');
            // UTF-8 BOM for Excel compatibility
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($handle, ['Tanggal', 'Keterangan', 'Tipe', 'Nominal', 'HPP (COGS)']);
            foreach ($transactions as $t) {
                fputcsv($handle, [
                    $t->tanggal,
                    $t->keterangan,
                    $t->tipe,
                    $t->nominal,
                    $t->cogs ?? 0,
                ]);
            }
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Memproses file CSV yang diunggah
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:5120',
        ], [
            'file.required' => 'Silakan pilih file terlebih dahulu.',
            'file.mimes'    => 'Untuk saat ini, silakan gunakan format file CSV.',
        ]);

        $file   = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');

        $header = fgetcsv($handle);
        $header = array_map('trim', $header);
        $header = array_map('strtolower', $header);

        $colTanggal    = array_search('tanggal', $header);
        $colKeterangan = array_search('keterangan', $header);
        $colTipe       = array_search('tipe', $header);
        $colNominal    = array_search('nominal', $header);

        if ($colTanggal === false || $colKeterangan === false || $colTipe === false || $colNominal === false) {
            fclose($handle);
            return back()->withErrors(['file' => 'Format kolom CSV salah. Pastikan header sesuai panduan.']);
        }

        $cafeId = auth()->user()->cafe_id;
        $userId = auth()->id();

        while (($row = fgetcsv($handle)) !== false) {
            if (empty(array_filter($row))) {
                continue;
            }

            $nominal       = preg_replace('/[^0-9]/', '', $row[$colNominal]);
            $rawDate       = trim($row[$colTanggal]);
            
            // Explicitly parse MM/DD/YYYY pattern
            $dateObj = \DateTime::createFromFormat('m/d/Y', $rawDate);
            if ($dateObj) {
                $formattedDate = $dateObj->format('Y-m-d');
            } else {
                // Fallback attempt
                $timestamp = strtotime($rawDate);
                $formattedDate = $timestamp ? date('Y-m-d', $timestamp) : date('Y-m-d');
            }

            $cleanTipe     = preg_replace('/[^a-z]/', '', strtolower(trim($row[$colTipe])));
            $finalTipe     = in_array($cleanTipe, ['kredit', 'keluar', 'pengeluaran']) ? 'kredit' : 'debit';

            Transaction::create([
                'cafe_id'    => $cafeId,
                'user_id'    => $userId,
                'tanggal'    => $formattedDate ?: $rawDate,
                'keterangan' => trim($row[$colKeterangan]),
                'tipe'       => $finalTipe,
                'nominal'    => (int) $nominal,
            ]);
        }

        fclose($handle);

        return redirect()->back()->with('message', 'Data transaksi berhasil diimpor dan disimpan ke Buku Kas!');
    }
}