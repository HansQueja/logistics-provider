<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'address',
        'latitude',
        'longitude',
        'type',
        'status'
    ];

    public const STATUS_ACTIVE   = 'ACTIVE';
    public const STATUS_INACTIVE  = 'INACTIVE';
}
