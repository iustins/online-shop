<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductPriceHistory extends Model
{
    protected $table = "product_price_history";

    public $timestamps = false;

    protected $fillable = [
        'product_id', 'price', 'date'
    ];
}
