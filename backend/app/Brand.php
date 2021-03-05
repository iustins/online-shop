<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $fillable = [
        'name', 'logo', 'description',
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];
}
