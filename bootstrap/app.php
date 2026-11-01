<?php

$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

// Redirect storage path to /tmp/storage for Vercel Serverless environment
if (isset($_ENV['VERCEL']) || isset($_SERVER['VERCEL']) || getenv('VERCEL') || env('APP_STORAGE')) {
    $storagePath = env('APP_STORAGE', '/tmp/storage');
    $app->useStoragePath($storagePath);

    if (!is_dir($storagePath)) {
        mkdir($storagePath, 0755, true);
    }
    foreach (['framework/views', 'framework/cache/data', 'framework/sessions', 'logs'] as $dir) {
        if (!is_dir($storagePath . '/' . $dir)) {
            mkdir($storagePath . '/' . $dir, 0755, true);
        }
    }
}

$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

return $app;