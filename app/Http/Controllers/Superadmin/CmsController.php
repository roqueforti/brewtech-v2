<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\LandingPageAsset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CmsController extends Controller
{
    public function index()
    {
        $assets = LandingPageAsset::orderBy('type')->orderBy('order')->get()->map(function($asset) {
            $asset->full_image_url = asset(ltrim($asset->image_path, '/'));
            return $asset;
        });

        return Inertia::render('Superadmin/CmsManager', [
            'assets' => $assets
        ]);
    }

    public function store(Request $request)
    {
        $isInstaller = in_array($request->type, ['apk_file', 'ipa_file']);

        $request->validate([
            'type' => 'required|in:hero_banner,gallery_documentation,among_rasa,apk_file,ipa_file',
            'image' => [
                'required',
                $isInstaller ? 'file' : 'image',
                $isInstaller ? 'mimes:apk,ipa,zip,octet-stream' : 'mimes:jpeg,png,jpg,gif,webp',
                'max:102400' // Increased to 100MB for installers
            ],
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        $folder = 'landing-assets';
        $path = $request->file('image')->store($folder, 'public');

        LandingPageAsset::create([
            'type' => $request->type,
            'image_path' => '/storage/' . $path,
            'title' => $request->title,
            'description' => $request->description,
            'order' => $request->order ?? 0,
            'is_active' => true,
        ]);

        return redirect()->back()->with('message', 'Asset berhasil diunggah.');
    }

    public function update(Request $request, LandingPageAsset $asset)
    {
        $type = $request->input('type', $asset->type);
        $isInstaller = in_array($type, ['apk_file', 'ipa_file']);

        $request->validate([
            'type'        => 'nullable|in:hero_banner,gallery_documentation,among_rasa,apk_file,ipa_file',
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'order'       => 'nullable|integer',
            'is_active'   => 'nullable',
            'image'       => [
                'nullable',
                $isInstaller ? 'file' : 'image',
                $isInstaller ? 'mimes:apk,ipa,zip,octet-stream' : 'mimes:jpeg,png,jpg,gif,webp',
                'max:102400'
            ],
        ]);

        $data = [
            'type'        => $request->input('type', $asset->type),
            'title'       => $request->input('title'),
            'description' => $request->input('description'),
            'order'       => (int) $request->input('order', $asset->order),
            'is_active'   => filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN),
        ];

        if ($request->hasFile('image')) {
            // Hapus file lama jika bukan file default
            if (!str_contains($asset->image_path, '/images/hero_')) {
                $oldPath = str_replace('/storage/', '', $asset->image_path);
                Storage::disk('public')->delete($oldPath);
            }
            $folder = 'landing-assets';
            $path = $request->file('image')->store($folder, 'public');
            $data['image_path'] = '/storage/' . $path;
        }

        $asset->update($data);

        return redirect()->back()->with('message', 'Asset berhasil diperbarui.');
    }

    public function destroy(LandingPageAsset $asset)
    {
        // Delete file from storage
        $path = str_replace('/storage/', '', $asset->image_path);
        Storage::disk('public')->delete($path);
        
        $asset->delete();

        return redirect()->back()->with('message', 'Asset berhasil dihapus.');
    }
}
