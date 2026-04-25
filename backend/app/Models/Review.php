<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory, HasUuid;

    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'reviewer_name',
        'email',
        'rating',
        'body',
        'is_approved',
    ];

    protected function casts(): array
    {
        return [
            'rating'      => 'integer',
            'is_approved' => 'boolean',
            'created_at'  => 'datetime',
        ];
    }

    // Auto-set created_at column on creation
    protected static function booted(): void
    {
        static::creating(function (Review $review) {
            $review->created_at = now();
        });
    }

    //  Relationships 
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Scopes for filtering
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }


}