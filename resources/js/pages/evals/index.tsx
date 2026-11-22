import { store as storeEvalCase } from '@/actions/App/Http/Controllers/EvalCaseController';
import { index as evalsIndex, show as evalsShow, store as runEvals } from '@/actions/App/Http/Controllers/EvalController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { formatDuration } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Play, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface EvalRun {
    id: number;
    provider: string;
    model_name: string;
    total_cases: number;
    category_accuracy: number;
    priority_accuracy: number;
    valid_schema_rate: number;
    avg_latency_ms: number;
    created_at: string;
}

interface EvalCase {
    id: number;
    title: string;
    message: string;
    expected_category: string;
    expected_priority: string;
}

interface Props {
    runs: EvalRun[];
    cases: EvalCase[];
    categories: string[];
    priorities: string[];
    createdCaseId: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'AI Evals',
        href: evalsIndex.url(),
    },
];

export default function EvalsIndex({ runs, cases, categories, priorities, createdCaseId }: Props) {
    const [running, setRunning] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>(() => cases.map((c) => c.id));

    const createForm = useForm({
        title: '',
        message: '',
        expected_category: categories[0] ?? 'technical_support',
        expected_priority: priorities[1] ?? 'medium',
    });

    useEffect(() => {
        if (createdCaseId) {
            setSelectedIds((prev) => (prev.includes(createdCaseId) ? prev : [...prev, createdCaseId]));
        }
    }, [createdCaseId]);

    const allSelected = cases.length > 0 && selectedIds.length === cases.length;

    function toggleCase(id: number) {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    }

    function toggleAll() {
        setSelectedIds(allSelected ? [] : cases.map((c) => c.id));
    }

    function handleRun() {
        if (selectedIds.length === 0) {
            return;
        }
        setRunning(true);
        router.post(
            runEvals.url(),
            { case_ids: selectedIds },
            { onFinish: () => setRunning(false) },
        );
    }

    function handleCreateCase(e: React.FormEvent) {
        e.preventDefault();
        createForm.post(storeEvalCase.url(), {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                setDialogOpen(false);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Evals" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">AI Classification Evaluations</h1>
                        <p className="text-muted-foreground text-sm">
                            Benchmark model accuracy against {cases.length} manually labeled customer support messages.
                        </p>
                    </div>
                    <Button onClick={handleRun} disabled={running || selectedIds.length === 0}>
                        <Play className="mr-2 size-4" />
                        {running
                            ? 'Running Suite...'
                            : `Run Selected (${selectedIds.length}/${cases.length})`}
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Evaluation Runs</CardTitle>
                        <CardDescription>
                            You can also execute <code>php artisan ai:evaluate</code> from the CLI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {runs.length === 0 ? (
                            <p className="text-muted-foreground py-8 text-center text-sm">No evaluation runs recorded yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-muted-foreground border-b text-xs uppercase">
                                        <tr>
                                            <th className="py-2 pr-4">Run</th>
                                            <th className="py-2 pr-4">Provider / Model</th>
                                            <th className="py-2 pr-4">Cases</th>
                                            <th className="py-2 pr-4">Category Acc.</th>
                                            <th className="py-2 pr-4">Priority Acc.</th>
                                            <th className="py-2 pr-4">Valid Schema</th>
                                            <th className="py-2 pr-4">Avg Latency</th>
                                            <th className="py-2 text-right">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {runs.map((run) => (
                                            <tr key={run.id} className="hover:bg-muted/40">
                                                <td className="py-2.5 pr-4 font-mono text-xs">#{run.id}</td>
                                                <td className="py-2.5 pr-4">
                                                    {run.provider} / {run.model_name}
                                                </td>
                                                <td className="py-2.5 pr-4">{run.total_cases}</td>
                                                <td className="py-2.5 pr-4 font-semibold">{run.category_accuracy}%</td>
                                                <td className="py-2.5 pr-4">{run.priority_accuracy}%</td>
                                                <td className="py-2.5 pr-4">{run.valid_schema_rate}%</td>
                                                <td className="py-2.5 pr-4">{formatDuration(run.avg_latency_ms)}</td>
                                                <td className="py-2.5 text-right">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={evalsShow(run.id).url}>Inspect</Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Labeled Evaluation Dataset ({cases.length} cases)</CardTitle>
                            <CardDescription>Select which cases to include in the next evaluation run.</CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button type="button" size="sm">
                                        <Plus className="mr-1.5 size-4" />
                                        Add Eval Case
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>New Evaluation Case</DialogTitle>
                                        <DialogDescription>
                                            Add a labeled customer message to the evaluation dataset.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleCreateCase} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                value={createForm.data.title}
                                                onChange={(e) => createForm.setData('title', e.target.value)}
                                                placeholder="e.g. Webhook timeout in production"
                                            />
                                            {createForm.errors.title && (
                                                <p className="text-destructive text-xs">{createForm.errors.title}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="expected_category">Expected Category</Label>
                                                <select
                                                    id="expected_category"
                                                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                                    value={createForm.data.expected_category}
                                                    onChange={(e) => createForm.setData('expected_category', e.target.value)}
                                                >
                                                    {categories.map((cat) => (
                                                        <option key={cat} value={cat}>
                                                            {cat}
                                                        </option>
                                                    ))}
                                                </select>
                                                {createForm.errors.expected_category && (
                                                    <p className="text-destructive text-xs">{createForm.errors.expected_category}</p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="expected_priority">Expected Priority</Label>
                                                <select
                                                    id="expected_priority"
                                                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm capitalize"
                                                    value={createForm.data.expected_priority}
                                                    onChange={(e) => createForm.setData('expected_priority', e.target.value)}
                                                >
                                                    {priorities.map((prio) => (
                                                        <option key={prio} value={prio}>
                                                            {prio}
                                                        </option>
                                                    ))}
                                                </select>
                                                {createForm.errors.expected_priority && (
                                                    <p className="text-destructive text-xs">{createForm.errors.expected_priority}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="message">Customer Message</Label>
                                            <textarea
                                                id="message"
                                                rows={4}
                                                className="border-input bg-background w-full rounded-md border p-3 text-sm"
                                                value={createForm.data.message}
                                                onChange={(e) => createForm.setData('message', e.target.value)}
                                                placeholder="Write the simulated customer message..."
                                            />
                                            {createForm.errors.message && (
                                                <p className="text-destructive text-xs">{createForm.errors.message}</p>
                                            )}
                                        </div>

                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={createForm.processing}>
                                                {createForm.processing ? 'Saving...' : 'Save Case'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Button type="button" variant="outline" size="sm" onClick={toggleAll}>
                                {allSelected ? 'Clear Selection' : 'Select All'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            {cases.map((item) => {
                                const checked = selectedIds.includes(item.id);
                                return (
                                    <label
                                        key={item.id}
                                        className="hover:bg-muted/30 flex cursor-pointer items-start justify-between gap-4 py-3"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={() => toggleCase(item.id)}
                                                className="mt-0.5"
                                            />
                                            <div>
                                                <div className="text-sm font-medium">{item.title}</div>
                                                <div className="text-muted-foreground text-xs">{item.message}</div>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-2">
                                            <Badge variant="outline">{item.expected_category}</Badge>
                                            <Badge variant="secondary">{item.expected_priority}</Badge>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
