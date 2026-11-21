import { index as evalsIndex, store as runEvals } from '@/actions/App/Http/Controllers/EvalController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Play } from 'lucide-react';
import { useState } from 'react';

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
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'AI Evals',
        href: evalsIndex.url(),
    },
];

export default function EvalsIndex({ runs, cases }: Props) {
    const [running, setRunning] = useState(false);

    function handleRun() {
        setRunning(true);
        router.post(runEvals.url(), {}, { onFinish: () => setRunning(false) });
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
                    <Button onClick={handleRun} disabled={running}>
                        <Play className="mr-2 size-4" />
                        {running ? 'Running Suite...' : 'Run Evaluation Suite'}
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
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {runs.map((run) => (
                                            <tr key={run.id}>
                                                <td className="py-2.5 pr-4 font-mono text-xs">#{run.id}</td>
                                                <td className="py-2.5 pr-4">
                                                    {run.provider} / {run.model_name}
                                                </td>
                                                <td className="py-2.5 pr-4">{run.total_cases}</td>
                                                <td className="py-2.5 pr-4 font-semibold">{run.category_accuracy}%</td>
                                                <td className="py-2.5 pr-4">{run.priority_accuracy}%</td>
                                                <td className="py-2.5 pr-4">{run.valid_schema_rate}%</td>
                                                <td className="py-2.5 pr-4">{run.avg_latency_ms} ms</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Labeled Evaluation Dataset ({cases.length} cases)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            {cases.map((item) => (
                                <div key={item.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="text-sm font-medium">{item.title}</div>
                                        <div className="text-muted-foreground text-xs">{item.message}</div>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <Badge variant="outline">{item.expected_category}</Badge>
                                        <Badge variant="secondary">{item.expected_priority}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
