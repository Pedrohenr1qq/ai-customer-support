<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_classifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('tickets')->cascadeOnDelete();
            $table->string('provider');
            $table->string('model_name');
            $table->string('category');
            $table->string('priority');
            $table->string('subject');
            $table->float('confidence');
            $table->text('suggested_reply');
            $table->json('raw_payload');
            $table->integer('latency_ms');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_classifications');
    }
};
