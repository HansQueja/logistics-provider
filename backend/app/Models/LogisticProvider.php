<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LogisticProvider extends Model
{

    use HasFactory;

    protected $fillable = [
        'company_name',
        'status',
    ];

    // Make enum values constants
    public const STATUS_VERIFIED   = 'VERIFIED';
    public const STATUS_PARTNERED  = 'PARTNERED';
    public const STATUS_BLACKLISTED = 'BLACKLISTED';
    public const STATUS_REJECTED   = 'REJECTED';

    public function drivers()
    {
        return $this->hasMany(Driver::class, 'provider_id');
    }
}
