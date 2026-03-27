<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Models\ActivityLog;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];


    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        Event::listen(Login::class, function (Login $event) {
            ActivityLog::create([
                'user_id'    => $event->user->id,
                'action'     => 'Login',
                'model_type' => get_class($event->user),
                'model_id'   => $event->user->id,
                'details'    => null,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        });

        Event::listen(Logout::class, function (Logout $event) {
            if ($event->user) {
                ActivityLog::create([
                    'user_id'    => $event->user->id,
                    'action'     => 'Logout',
                    'model_type' => get_class($event->user),
                    'model_id'   => $event->user->id,
                    'details'    => null,
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);
            }
        });
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
