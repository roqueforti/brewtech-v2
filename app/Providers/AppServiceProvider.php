<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (isset($_ENV['VERCEL']) || isset($_SERVER['VERCEL']) || getenv('VERCEL')) {
            $this->app->useStoragePath('/tmp/storage');
            foreach ([
                '/tmp/storage/app',
                '/tmp/storage/framework/cache/data',
                '/tmp/storage/framework/views',
                '/tmp/storage/framework/sessions',
                '/tmp/storage/logs',
                '/tmp/storage/bootstrap/cache',
            ] as $path) {
                if (!is_dir($path)) {
                    mkdir($path, 0755, true);
                }
            }
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (
            (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ||
            str_starts_with((string) config('app.url'), 'https://') ||
            isset($_ENV['VERCEL']) || isset($_SERVER['VERCEL'])
        ) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
    }
}
