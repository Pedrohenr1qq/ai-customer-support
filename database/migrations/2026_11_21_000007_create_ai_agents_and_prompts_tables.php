<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_agents', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('provider')->default('gemini');
            $table->string('model_name');
            $table->boolean('is_active')->default(false)->index();
            $table->timestamps();
        });

        Schema::create('ai_agent_prompts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_agent_id')->constrained('ai_agents')->cascadeOnDelete();
            $table->string('name');
            $table->text('instructions');
            $table->boolean('is_active')->default(false)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_agent_prompts');
        Schema::dropIfExists('ai_agents');
    }
};
