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

    public function provider()
    {
        return $this->belongsTo(LogisticProvider::class, 'provider_id');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id');
    }
}
