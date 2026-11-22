import {
    activatePrompt,
    index as agentsIndex,
    store as storeAgent,
    storePrompt,
    update as updateAgent,
} from '@/actions/App/Http/Controllers/AiAgentController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Bot, Check, Plus, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

interface AiAgentPrompt {
    id: number;
    ai_agent_id: number;
    name: string;
    instructions: string;
    is_active: boolean;
    created_at: string;
}

interface AiAgent {
    id: number;
    name: string;
    provider: string;
    model_name: string;
    is_active: boolean;
    prompts: AiAgentPrompt[];
}

interface Props {
    agents: AiAgent[];
    availableModels: string[];
    defaultInstructions: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'AI Agents',
        href: agentsIndex.url(),
    },
];

function AgentCard({
    agent,
    availableModels,
    defaultInstructions,
}: {
    agent: AiAgent;
    availableModels: string[];
    defaultInstructions: string;
}) {
    const [promptDialogOpen, setPromptDialogOpen] = useState(false);

    const agentForm = useForm({
        name: agent.name,
        provider: agent.provider,
        model_name: agent.model_name,
        is_active: agent.is_active,
    });

    const activePrompt = agent.prompts.find((p) => p.is_active);

    const promptForm = useForm({
        name: '',
        instructions: activePrompt?.instructions ?? defaultInstructions,
        is_active: true,
    });

    function handleUpdateAgent(e: React.FormEvent) {
        e.preventDefault();
        agentForm.patch(updateAgent.url(agent.id), { preserveScroll: true });
    }

    function handleActivateAgent() {
        router.patch(
            updateAgent.url(agent.id),
            {
                name: agent.name,
                provider: agent.provider,
                model_name: agent.model_name,
                is_active: true,
            },
            { preserveScroll: true },
        );
    }

    function handleCreatePrompt(e: React.FormEvent) {
        e.preventDefault();
        promptForm.post(storePrompt.url(agent.id), {
            preserveScroll: true,
            onSuccess: () => {
                promptForm.reset('name');
                setPromptDialogOpen(false);
            },
        });
    }

    return (
        <Card className={agent.is_active ? 'border-primary/50' : ''}>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="size-5" />
                            {agent.name}
                        </CardTitle>
                        {agent.is_active && <Badge>Active for Ticket Triage</Badge>}
                    </div>
                    <CardDescription>
                        Provider: <strong>{agent.provider}</strong> • Model: <code>{agent.model_name}</code>
                    </CardDescription>
                </div>

                {!agent.is_active && (
                    <Button type="button" size="sm" variant="outline" onClick={handleActivateAgent}>
                        <Check className="mr-1.5 size-4" />
                        Set Active
                    </Button>
                )}
            </CardHeader>

            <CardContent className="space-y-6">
                <form onSubmit={handleUpdateAgent} className="grid gap-4 sm:grid-cols-4 sm:items-end">
                    <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor={`agent-name-${agent.id}`}>Agent Name</Label>
                        <Input
                            id={`agent-name-${agent.id}`}
                            value={agentForm.data.name}
                            onChange={(e) => agentForm.setData('name', e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor={`agent-model-${agent.id}`}>Model</Label>
                        <select
                            id={`agent-model-${agent.id}`}
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                            value={agentForm.data.model_name}
                            onChange={(e) => agentForm.setData('model_name', e.target.value)}
                        >
                            {availableModels.map((model) => (
                                <option key={model} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button type="submit" disabled={agentForm.processing}>
                        {agentForm.processing ? 'Saving...' : 'Save Settings'}
                    </Button>
                </form>

                <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold">Instruction Prompts ({agent.prompts.length})</h3>
                            <p className="text-muted-foreground text-xs">
                                If no active prompt is set, the generic built-in fallback prompt is used.
                            </p>
                        </div>

                        <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
                            <DialogTrigger asChild>
                                <Button type="button" size="sm" variant="outline">
                                    <Plus className="mr-1.5 size-4" />
                                    New Prompt Version
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>New Prompt for {agent.name}</DialogTitle>
                                    <DialogDescription>
                                        Customize the system instructions used to classify tickets and draft replies.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreatePrompt} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor={`prompt-name-${agent.id}`}>Prompt Version Name</Label>
                                        <Input
                                            id={`prompt-name-${agent.id}`}
                                            value={promptForm.data.name}
                                            onChange={(e) => promptForm.setData('name', e.target.value)}
                                            placeholder="e.g. Concise Billing Focus v2"
                                        />
                                        {promptForm.errors.name && (
                                            <p className="text-destructive text-xs">{promptForm.errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor={`prompt-instructions-${agent.id}`}>Instructions</Label>
                                        <textarea
                                            id={`prompt-instructions-${agent.id}`}
                                            rows={10}
                                            className="border-input bg-background w-full rounded-md border p-3 font-mono text-xs"
                                            value={promptForm.data.instructions}
                                            onChange={(e) => promptForm.setData('instructions', e.target.value)}
                                        />
                                        {promptForm.errors.instructions && (
                                            <p className="text-destructive text-xs">{promptForm.errors.instructions}</p>
                                        )}
                                    </div>

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setPromptDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={promptForm.processing}>
                                            {promptForm.processing ? 'Saving...' : 'Save & Activate Prompt'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {agent.prompts.length === 0 ? (
                        <p className="text-muted-foreground text-xs">
                            No custom prompts yet — using generic fallback prompt.
                        </p>
                    ) : (
                        <div className="divide-y rounded-md border">
                            {agent.prompts.map((prompt) => (
                                <div key={prompt.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            {prompt.name}
                                            {prompt.is_active && (
                                                <Badge variant="secondary" className="text-[11px]">
                                                    <Sparkles className="mr-1 size-3" />
                                                    Active
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground line-clamp-2 text-xs whitespace-pre-wrap">
                                            {prompt.instructions}
                                        </p>
                                    </div>
                                    {!prompt.is_active && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                                router.post(
                                                    activatePrompt.url({ aiAgent: agent.id, prompt: prompt.id }),
                                                    {},
                                                    { preserveScroll: true },
                                                )
                                            }
                                        >
                                            Activate
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function AiAgentsIndex({ agents, availableModels, defaultInstructions }: Props) {
    const [createOpen, setCreateOpen] = useState(false);

    const createForm = useForm({
        name: '',
        provider: 'gemini',
        model_name: availableModels[0] ?? 'gemini-flash-lite-latest',
        is_active: true,
        prompt_name: 'Initial Prompt v1',
        instructions: defaultInstructions,
    });

    function handleCreateAgent(e: React.FormEvent) {
        e.preventDefault();
        createForm.post(storeAgent.url(), {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset('name');
                setCreateOpen(false);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Agents" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">AI Triage Agents & Prompts</h1>
                        <p className="text-muted-foreground text-sm">
                            Configure the active model and instruction prompt used to classify tickets and run evaluations.
                        </p>
                    </div>

                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 size-4" />
                                New AI Agent
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create AI Agent Configuration</DialogTitle>
                                <DialogDescription>
                                    Define a model and initial instruction prompt for ticket triage.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateAgent} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="new-agent-name">Agent Name</Label>
                                        <Input
                                            id="new-agent-name"
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                            placeholder="e.g. Fast Support Triage"
                                        />
                                        {createForm.errors.name && (
                                            <p className="text-destructive text-xs">{createForm.errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="new-agent-model">Model</Label>
                                        <select
                                            id="new-agent-model"
                                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                            value={createForm.data.model_name}
                                            onChange={(e) => createForm.setData('model_name', e.target.value)}
                                        >
                                            {availableModels.map((model) => (
                                                <option key={model} value={model}>
                                                    {model}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="new-agent-prompt-name">Initial Prompt Name</Label>
                                    <Input
                                        id="new-agent-prompt-name"
                                        value={createForm.data.prompt_name}
                                        onChange={(e) => createForm.setData('prompt_name', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="new-agent-instructions">Instructions</Label>
                                    <textarea
                                        id="new-agent-instructions"
                                        rows={8}
                                        className="border-input bg-background w-full rounded-md border p-3 font-mono text-xs"
                                        value={createForm.data.instructions}
                                        onChange={(e) => createForm.setData('instructions', e.target.value)}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={createForm.processing}>
                                        {createForm.processing ? 'Creating...' : 'Create Agent'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-6">
                    {agents.map((agent) => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            availableModels={availableModels}
                            defaultInstructions={defaultInstructions}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
