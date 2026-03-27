<?php

namespace App\Http\Controllers\CafeAdmin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index()
    {
        $cafeId = Auth::user()->cafe_id ?? 1; // Fallback for simple relationship simulation
        $products = Product::where('cafe_id', $cafeId)->latest()->get();

        return Inertia::render('CafeAdmin/Products', [
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'status' => 'required|boolean'
        ]);

        Product::create([
            'cafe_id' => Auth::user()->cafe_id ?? 1,
            'name' => $request->name,
            'price' => $request->price,
            'cost_price' => $request->cost_price ?? 0,
            'stock' => $request->stock,
            'status' => $request->status,
        ]);

        return redirect()->back()->with('message', 'Produk berhasil ditambahkan!');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->back()->with('message', 'Produk dihapus!');
    }
}
