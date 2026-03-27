<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MasterModuleController extends Controller
{
    public function index()
    {
        return Inertia::render('Superadmin/ModulBuilder/Index', [
            'modules' => Module::withCount(['materials', 'questions'])->orderBy('order')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Superadmin/ModulBuilder/Show', [
            'module' => null 
        ]);
    }

    public function store(Request $request)
    {
        return $this->update($request, null);
    }

    /**
     * Digunakan untuk fitur Mode Preview Siswa.
     */
    public function show($id)
    {
        $module = Module::with(['materials', 'questions.options'])->findOrFail($id);
        return Inertia::render('Superadmin/ModulBuilder/Preview', [
            'module' => $module
        ]);
    }

    /**
     * Memuat data untuk dimasukkan kembali ke Form Modul Builder (Edit Mode).
     */
    public function edit($id)
    {
        $module = Module::with(['materials', 'questions.options', 'softSkillCriteria'])->findOrFail($id);
        
        // 1. Parsing array Materials (Alat, Bahan, Langkah)
        $alat = $module->materials->where('type', 'alat')->values()->map(function($item) {
            return ['content' => $item->content_text, 'media' => $item->media_url];
        });
        
        $bahan = $module->materials->where('type', 'bahan')->values()->map(function($item) {
            return ['content' => $item->content_text, 'media' => $item->media_url];
        });
        
        $langkah = $module->materials->where('type', 'langkah')->values()->map(function($item) {
            return ['content' => $item->content_text, 'media' => $item->media_url];
        });

        // 2. Helper untuk Parsing Soal (Pre/Post Test) menjadi format React
        $formatQuestions = function ($type) use ($module) {
            return $module->questions->where('type', $type)->map(function ($q) {
                $optionsText = [];
                $optionsMedia = [];
                $correct = 'a'; // Fallback
                
                $chars = ['a', 'b', 'c', 'd'];
                
                // Urutkan opsi berdasarkan ID atau urutan default pembuatan
                foreach ($q->options->values() as $idx => $opt) {
                    if ($idx < 4) {
                        $key = $chars[$idx];
                        $optionsText[$key] = $opt->option_text;
                        $optionsMedia[$key] = $opt->media_url;
                        if ($opt->is_correct) {
                            $correct = $key;
                        }
                    }
                }

                return [
                    'id' => $q->id,
                    'question_text' => $q->question_text,
                    'media' => $q->media_url,
                    'options' => $optionsText,
                    'options_media' => $optionsMedia,
                    'correct_answer' => $correct,
                ];
            })->values();
        };

        $pre_tests = $formatQuestions('pre_test');
        $post_tests = $formatQuestions('post_test');

        // Kemas ulang (Serialize) data sesuai dengan state useForm di Show.tsx
        $formattedModule = [
            'id'             => $module->id,
            'title'          => $module->title,
            'description'    => $module->description,
            'order'          => $module->order,
            'alat'           => $alat,
            'bahan'          => $bahan,
            'langkah'        => $langkah,
            'pre_tests'      => $pre_tests,
            'post_tests'     => $post_tests,
            // Jika pre_test dan post_test identik, nyalakan toggle sinkronisasi
            'sync_post_test' => ($pre_tests->toJson() === $post_tests->toJson() && $pre_tests->count() > 0),
            'soft_skills'    => $module->softSkillCriteria,
        ];
        
        return Inertia::render('Superadmin/ModulBuilder/Show', [
            'module' => $formattedModule
        ]);
    }

    public function update(Request $request, $id = null)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            'order'          => 'required|integer',
            'alat'           => 'array|nullable',
            'bahan'          => 'array|nullable',
            'langkah'        => 'array|nullable',
            'pre_tests'      => 'array|nullable',
            'post_tests'     => 'array|nullable',
            'sync_post_test' => 'boolean',
            'soft_skills'    => 'array|nullable',
        ]);

        DB::transaction(function () use ($validated, $id) {
            $module = $id ? Module::findOrFail($id) : new Module();
            
            $module->fill([
                'title'       => $validated['title'],
                'description' => $validated['description'],
                'order'       => $validated['order'],
            ])->save();

            // 1. Bersihkan data relasi lama (Replace Strategy)
            $module->materials()->delete();
            $module->questions()->delete();
            if (method_exists($module, 'softSkillCriteria')) {
                $module->softSkillCriteria()->delete();
            }

            // 2. Simpan Materials Baru + Upload File
            $this->saveMaterialSet($module, 'alat', $validated['alat'] ?? []);
            $this->saveMaterialSet($module, 'bahan', $validated['bahan'] ?? []);
            $this->saveMaterialSet($module, 'langkah', $validated['langkah'] ?? []);

            // 3. Simpan Soal Kuis + Upload File
            $this->saveQuestions($module, 'pre_test', $validated['pre_tests'] ?? []);
            
            $postData = ($validated['sync_post_test'] ?? false) 
                ? ($validated['pre_tests'] ?? []) 
                : ($validated['post_tests'] ?? []);
                
            $this->saveQuestions($module, 'post_test', $postData);

            // 4. Simpan Soft Skills
            if (!empty($validated['soft_skills'])) {
                foreach ($validated['soft_skills'] as $skill) {
                    if (!empty($skill['criteria_name'])) {
                        $module->softSkillCriteria()->create([
                            'criteria_name' => $skill['criteria_name']
                        ]);
                    }
                }
            }
        });

        return $id 
            ? redirect()->back()->with('message', 'Modul berhasil diperbarui!') 
            : redirect()->route('superadmin.modules.index')->with('message', 'Modul baru berhasil dibuat!');
    }

    public function destroy($id) 
    {
        $module = Module::findOrFail($id);
        $module->delete(); 
        
        return redirect()->back()->with('message', 'Modul berhasil dihapus!');
    }

    // =========================================================================
    // HELPER METHODS (Private) UNTUK UPLOAD FILE
    // =========================================================================

    private function processMediaUpload($mediaInput, $folder)
    {
        // Deteksi jika yang dikirim dari React adalah File biner baru
        if ($mediaInput instanceof \Illuminate\Http\UploadedFile) {
            $path = $mediaInput->store($folder, 'public');
            return Storage::url($path); 
        }

        // Jika string (bisa berupa URL gambar lama dari Edit mode), biarkan saja.
        return is_string($mediaInput) ? $mediaInput : null;
    }

    private function saveMaterialSet($module, $type, $items) 
    {
        foreach ($items as $index => $item) {
            $text = $item['content'] ?? ($item['content_text'] ?? null);
            
            if (!empty($text)) {
                $mediaUrl = $this->processMediaUpload($item['media'] ?? null, "modules/materials/{$type}");

                $module->materials()->create([
                    'type'         => $type,
                    'content_text' => $text,
                    'media_url'    => $mediaUrl,
                    'order'        => $index + 1,
                ]);
            }
        }
    }

    private function saveQuestions($module, $type, $questions) 
    {
        foreach ($questions as $q) {
            if (!empty($q['question_text'])) {
                
                $questionMediaUrl = $this->processMediaUpload($q['media'] ?? null, "modules/questions/{$type}");

                $question = $module->questions()->create([
                    'type'          => $type,
                    'question_text' => $q['question_text'],
                    'media_url'     => $questionMediaUrl,
                ]);

                foreach (['a', 'b', 'c', 'd'] as $key) {
                    $optText = $q['options'][$key] ?? null;
                    $mediaInput = $q['options_media'][$key] ?? null;
                    
                    $optMediaUrl = $this->processMediaUpload($mediaInput, "modules/options");

                    if (!empty($optText) || !empty($optMediaUrl)) {
                        $question->options()->create([
                            'option_text' => $optText ?? '',
                            'media_url'   => $optMediaUrl,
                            'is_correct'  => (($q['correct_answer'] ?? '') === $key)
                        ]);
                    }
                }
            }
        }
    }
}