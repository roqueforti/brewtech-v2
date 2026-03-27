import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                display: ['"Fredoka"', ...defaultTheme.fontFamily.sans],
                body: ['"Quicksand"', ...defaultTheme.fontFamily.sans],
                sans: ['"Quicksand"', ...defaultTheme.fontFamily.sans], // Jadikan default
            },
            colors: {
                primary: 'hsl(var(--primary))',
                secondary: 'hsl(var(--secondary))',
                accent: 'hsl(var(--accent))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                border: 'hsl(var(--border))',
                // ... Anda bisa tambahkan warna lain jika diperlukan
            },
        },
    },

    plugins: [forms],
};