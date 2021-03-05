<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('cart_data', 700); //de aici e problema, eu am limitat cosul de cumparaturi sa contina amxim 700 de caractere si la cateva tranzactii ai mai mult si nu a salvat tot, de unde vin si erorile, nu e vina ta
            $table->string('fiscal_data', 700);
            $table->string('delivery_data', 700);
            $table->boolean('paid')->default(false);
            $table->boolean('processed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}
