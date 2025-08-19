<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LogisticProvider extends Model
{
    protected $fillable = [
        'company_name',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Get the drivers for the logistic provider.
     */
    public function drivers(): HasMany
    {
        return $this->hasMany(Driver::class, 'provider_id');
    }
}
