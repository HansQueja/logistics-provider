<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'plate_number',
        'type',
        'status',
        'logistic_provider_id'
    ];

    public function provider()
    {
        return $this->belongsTo(LogisticProvider::class, 'logistic_provider_id');
    }

    public function drivers()
    {
        return $this->hasMany(Driver::class, 'assigned_vehicle_id');
    }
}
