<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Driver extends Model
{
    protected $fillable = [
        'name',
        'provider_id',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Get the logistic provider that owns the driver.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(LogisticProvider::class, 'provider_id');
    }

    /**
     * Get the QR scan logs for the driver.
     */
    public function qrScanLogs(): HasMany
    {
        return $this->hasMany(QrScanLog::class);
    }
}
