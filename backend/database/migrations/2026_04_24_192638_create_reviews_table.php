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
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('product_id');
            $table->foreign('product_id')
                  ->references('id')
                  ->on('products')
                  ->cascadeOnDelete();           
            $table->string('reviewer_name');
            $table->string('email');
            $table->unsignedTinyInteger('rating');   
            $table->text('body');
            $table->boolean('is_approved')->default(false);
            $table->timestamp('created_at')->useCurrent();

            $table->index('product_id');
            $table->index('is_approved');
            $table->index('rating');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
