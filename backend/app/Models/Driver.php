<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'provider_id',
        'status',
    ];

    public function logisticProvider()
    {
        return $this->belongsTo(LogisticProvider::class, 'provider_id');
    }
}