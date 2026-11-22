<?php

namespace App\Http\Controllers;

use App\Ai\Agents\TicketTriageAgent;
use App\Http\Requests\StoreAiAgentPromptRequest;
use App\Http\Requests\StoreAiAgentRequest;
use App\Http\Requests\UpdateAiAgentRequest;
use App\Models\AiAgent;
use App\Models\AiAgentPrompt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AiAgentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('agents/index', [
            'agents' => AiAgent::with('prompts')->orderByDesc('is_active')->orderBy('id')->get(),
            'availableModels' => [
                'gemini-flash-lite-latest',
                'gemini-flash-latest',
                'gemini-3.5-flash',
                'gemini-3.5-flash-lite',
                'gemini-3.7-flash',
                'gemini-4-hydrogen',
                'gemini-4-argon',
            ],
            'defaultInstructions' => TicketTriageAgent::defaultInstructions(),
        ]);
    }

    public function store(StoreAiAgentRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $activate = (bool) ($validated['is_active'] ?? false);

        DB::transaction(function () use ($validated, $activate) {
            if ($activate) {
                AiAgent::query()->update(['is_active' => false]);
            }

            $agent = AiAgent::create([
                'name' => $validated['name'],
                'provider' => $validated['provider'],
                'model_name' => $validated['model_name'],
                'is_active' => $activate,
            ]);

            if (! empty($validated['instructions'])) {
                $agent->prompts()->create([
                    'name' => $validated['prompt_name'] ?: 'Initial Prompt v1',
                    'instructions' => $validated['instructions'],
                    'is_active' => true,
                ]);
            }
        });

        return to_route('ai-agents.index')->with('success', 'AI agent created.');
    }

    public function update(UpdateAiAgentRequest $request, AiAgent $aiAgent): RedirectResponse
    {
        $validated = $request->validated();
        $activate = (bool) ($validated['is_active'] ?? $aiAgent->is_active);

        DB::transaction(function () use ($aiAgent, $validated, $activate) {
            if ($activate) {
                AiAgent::where('id', '!=', $aiAgent->id)->update(['is_active' => false]);
            }

            $aiAgent->update([
                'name' => $validated['name'],
                'provider' => $validated['provider'],
                'model_name' => $validated['model_name'],
                'is_active' => $activate,
            ]);
        });

        return to_route('ai-agents.index')->with('success', 'AI agent updated.');
    }

    public function storePrompt(StoreAiAgentPromptRequest $request, AiAgent $aiAgent): RedirectResponse
    {
        $validated = $request->validated();
        $activate = (bool) ($validated['is_active'] ?? true);

        DB::transaction(function () use ($aiAgent, $validated, $activate) {
            if ($activate) {
                $aiAgent->prompts()->update(['is_active' => false]);
            }

            $aiAgent->prompts()->create([
                'name' => $validated['name'],
                'instructions' => $validated['instructions'],
                'is_active' => $activate,
            ]);
        });

        return to_route('ai-agents.index')->with('success', 'Prompt saved.');
    }

    public function activatePrompt(AiAgent $aiAgent, AiAgentPrompt $prompt): RedirectResponse
    {
        abort_unless($prompt->ai_agent_id === $aiAgent->id, 404);

        DB::transaction(function () use ($aiAgent, $prompt) {
            $aiAgent->prompts()->update(['is_active' => false]);
            $prompt->update(['is_active' => true]);
        });

        return to_route('ai-agents.index')->with('success', 'Prompt activated.');
    }
}
