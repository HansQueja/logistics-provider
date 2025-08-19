<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrScanLog extends Model
{
    protected $fillable = [
        'driver_id',
        'scan_type',
        'scanned_at',
    ];

    protected $casts = [
        'scan_type' => 'string',
        'scanned_at' => 'datetime',
    ];

    /**
     * Get the driver that owns the QR scan log.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }
}
