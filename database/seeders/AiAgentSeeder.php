<?php

namespace Database\Seeders;

use App\Ai\Agents\TicketTriageAgent;
use App\Models\AiAgent;
use Illuminate\Database\Seeder;

class AiAgentSeeder extends Seeder
{
    public function run(): void
    {
        $agent = AiAgent::firstOrCreate(
            ['name' => 'Default Triage Agent'],
            [
                'provider' => config('ai.default', 'gemini'),
                'model_name' => config('ai.providers.gemini.models.text.default', 'gemini-flash-lite-latest'),
                'is_active' => true,
            ],
        );

        if ($agent->prompts()->count() === 0) {
            $agent->prompts()->create([
                'name' => 'Default Generic Prompt v1',
                'instructions' => TicketTriageAgent::defaultInstructions(),
                'is_active' => true,
            ]);
        }
    }
}
