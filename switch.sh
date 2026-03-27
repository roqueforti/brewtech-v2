#!/bin/bash

# Brewtech Environment Switcher (Bash/Git Bash)

if [ "$1" == "" ]; then
    echo "========================================="
    echo "Brewtech Environment Switcher"
    echo "========================================="
    echo "Usage: ./switch.sh [local | production]"
    echo "Example: ./switch.sh local"
    echo "========================================="
    exit 1
fi

if [ "$1" == "local" ]; then
    if [ ! -f .env.local ]; then
        echo "Error: File .env.local tidak ditemukan!"
        exit 1
    fi
    cp .env.local .env
    echo "[OK] Berhasil copy .env.local ke .env"
elif [ "$1" == "production" ]; then
    if [ ! -f .env.production ]; then
        echo "Error: File .env.production tidak ditemukan!"
        exit 1
    fi
    cp .env.production .env
    echo "[OK] Berhasil copy .env.production ke .env"
else
    echo "Error: Argumen tidak valid. Gunakan 'local' atau 'production'."
    exit 1
fi

# Clear Laravel Caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo ""
echo "========================================="
echo "[SUCCESS] Environment sekarang diatur ke: ${1^^}"
echo "========================================="
