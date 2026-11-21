<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('eval_cases', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->string('expected_category');
            $table->string('expected_priority');
            $table->string('expected_department_slug');
            $table->timestamps();
        });

        Schema::create('eval_runs', function (Blueprint $table) {
            $table->id();
            $table->string('provider');
            $table->string('model_name');
            $table->integer('total_cases');
            $table->float('category_accuracy');
            $table->float('priority_accuracy');
            $table->float('valid_schema_rate');
            $table->integer('avg_latency_ms');
            $table->json('results_json');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eval_runs');
        Schema::dropIfExists('eval_cases');
    }
};
