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
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')
                  ->nullable()
                  ->constrained('logistic_providers')
                  ->onDelete('cascade');
            $table->foreignId('driver_id')
                  ->nullble()
                  ->constrainted('drivers')
                  ->onDelete('cascade');
            $table->foreignId('location_id')
                  ->nullble()
                  ->constrainted('locations')
                  ->onDelete('cascade');
            $table->string('address');
            $table->enum('status', ['DELIVERED', 'IN-PROGRESS', 'FAILED']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};
