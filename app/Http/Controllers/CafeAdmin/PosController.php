<?php

namespace App\Http\Controllers\CafeAdmin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PosController extends Controller
{
    public function index()
    {
        $cafeId = Auth::user()->cafe_id ?? 1;
        $products = Product::where('cafe_id', $cafeId)->where('status', true)->get();
        $baristas = \App\Models\User::where('role', 'student')
            ->where('ready_for_pkl', true)
            ->with('school:id,name')
            ->get(['id', 'name', 'school_id', 'disability_type']);

        return Inertia::render('CafeAdmin/Pos', [
            'products' => $products,
            'baristas' => $baristas,
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'total_amount' => 'required|numeric|min:0',
            'barista_name' => 'nullable|string|max:255',
        ]);

        $cafeId = Auth::user()->cafe_id ?? 1;

        DB::transaction(function () use ($request, $cafeId) {
            // Fetch product names to include in the transaction description
            $productIds = collect($request->items)->pluck('product_id')->toArray();
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');
            
            $itemNames = [];
            $totalCogs = 0;
            foreach ($request->items as $item) {
                if (isset($products[$item['product_id']])) {
                    $itemNames[] = $item['quantity'] . 'x ' . $products[$item['product_id']]->name;
                    $totalCogs += $products[$item['product_id']]->cost_price * $item['quantity'];
                }
            }
            $namesString = implode(', ', $itemNames);
            $baristaNote = $request->barista_name ? ' | Barista: ' . $request->barista_name : '';

            $transaction = Transaction::create([
                'cafe_id' => $cafeId,
                'user_id' => Auth::id(),
                'tanggal' => date('Y-m-d'),
                'keterangan' => 'Penjualan Kasir (' . count($request->items) . ' item): ' . $namesString . $baristaNote,
                'tipe' => 'debit',
                'nominal' => $request->total_amount,
                'cogs' => $totalCogs,
            ]);

            // Assuming relation to order_items exists, just simple simulation
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                if ($product && $product->stock >= $item['quantity']) {
                    $product->decrement('stock', $item['quantity']);
                }
            }
        });

        return redirect()->route('cafe.pos.index')->with('message', 'Transaksi berhasil diselesaikan!');
    }
}
