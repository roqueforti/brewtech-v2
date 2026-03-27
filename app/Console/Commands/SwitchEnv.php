<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SwitchEnv extends Command
{
    protected $signature = 'env:switch {target : The target environment (local or production)}';
    protected $description = 'Switch between local and production .env files';

    public function handle()
    {
        $target = $this->argument('target');
        $sourceFile = ".env.{$target}";

        if (!File::exists(base_path($sourceFile))) {
            $this->error("Error: File {$sourceFile} tidak ditemukan!");
            return 1;
        }

        File::copy(base_path($sourceFile), base_path('.env'));
        $this->info("[OK] Berhasil copy {$sourceFile} ke .env");

        $this->call('config:clear');
        $this->call('cache:clear');
        $this->call('view:clear');
        $this->call('route:clear');

        $this->newLine();
        $this->info("=========================================");
        $this->info("[SUCCESS] Environment diatur ke: " . strtoupper($target));
        $this->info("=========================================");

        return 0;
    }
}
