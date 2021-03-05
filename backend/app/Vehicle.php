<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'brand_id', 'name', 'slug', 'brand_name', 'description','price', 'delivery', 'special_price'
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];
}
