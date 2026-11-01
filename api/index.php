<?php

// Ensure required writable storage subdirectories exist in /tmp for Vercel Serverless environment
$dirs = [
    '/tmp/storage/app',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/logs',
    '/tmp/storage/bootstrap/cache',
];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Forward Vercel serverless requests to Laravel's public entry point
require __DIR__ . '/../public/index.php';
