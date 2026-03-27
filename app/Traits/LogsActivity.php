<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;

trait LogsActivity
{
    public static function bootLogsActivity()
    {
        static::created(function (Model $model) {
            $model->logActivity('Created');
        });

        static::updated(function (Model $model) {
            $model->logActivity('Updated');
        });

        static::deleted(function (Model $model) {
            $model->logActivity('Deleted');
        });
    }

    protected function logActivity($action)
    {
        // Don't log if running in console (e.g., seeding)
        if (app()->runningInConsole()) {
            return;
        }

        $user = auth()->user();
        
        // Handle attribute changes for updates
        $details = [];
        if ($action === 'Updated') {
            $details = [
                'old' => $this->getOriginal(),
                'new' => $this->getDirty(),
            ];
        } else {
            $details = $this->toArray();
        }

        ActivityLog::create([
            'user_id'    => $user ? $user->id : null,
            'action'     => $action,
            'model_type' => get_class($this),
            'model_id'   => $this->getKey(),
            'details'    => $details,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
