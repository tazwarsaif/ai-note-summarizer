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
        Schema::table('users', function (Blueprint $table) {
            // Add provider-related fields to the users table
            $table->string('provider_id')->nullable()->after('password');
            $table->string('provider_name')->nullable()->after('provider_id');
            $table->text('provider_token')->nullable()->after('provider_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Remove provider-related fields from the users table
            $table->dropColumn(['provider_id', 'provider_name', 'provider_token']);
        });
    }
};
