<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'plate_number',
        'logistic_provider_id',
    ];

    public function logisticProvider()
    {
        return $this->belongsTo(LogisticProvider::class);
    }
}