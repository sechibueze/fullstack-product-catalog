<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('category_id');
            $table->foreign('category_id')
                  ->references('id')
                  ->on('categories')
                  ->cascadeOnDelete();              
            $table->string('name');
            $table->string('slug')->unique();       
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->unsignedInteger('stock_qty')->default(0);
            $table->boolean('is_published')->default(false);
            
            $table->index('category_id');
            $table->index('is_published');
            $table->index('slug');
            $table->timestamps();
            $table->softDeletes();          

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
