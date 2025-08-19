<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_id',
        'driver_id',
        'location_id',
        'address',
        'status'
    ];

    public const STATUS_DELIVERED = 'DELIVERED';
    public const STATUS_IN_PROGRESS = 'IN-PROGRESS';
    public const STATUS_FAILED = 'FAILED';

    public function logisticProvider()
    {
        return $this->belongsTo(LogisticProvider::class, 'provider_id');
    }

    public function driver()
    {
        return $this->belongsTo(LogisticProvider::class, 'driver_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id');
    }
}
