<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QrScanLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'driver_id',
        'scan_type',
    ];

    /**
     * Get the driver that owns the scan log.
     */
    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }
}