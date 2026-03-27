@echo off
setlocal

if "%1"=="" goto usage
if "%1"=="local" goto local
if "%1"=="production" goto prod

:usage
echo =========================================
echo Brewtech Environment Switcher
echo =========================================
echo Penggunaan: switch [local ^| production]
echo Contoh: switch local
echo =========================================
goto end

:local
if not exist .env.local (
    echo Error: File .env.local tidak ditemukan!
    goto end
)
copy /Y .env.local .env > nul
echo [OK] Berhasil copy .env.local ke .env

php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo.
echo =========================================
echo [SUCCESS] Environment sekarang diatur ke: LOCAL
echo =========================================
goto end

:prod
if not exist .env.production (
    echo Error: File .env.production tidak ditemukan!
    goto end
)
copy /Y .env.production .env > nul
echo [OK] Berhasil copy .env.production ke .env

php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo.
echo =========================================
echo [SUCCESS] Environment sekarang diatur ke: PRODUCTION
echo =========================================
goto end

:end
endlocal
