import { index as evalsIndex, show as evalsShow } from '@/actions/App/Http/Controllers/EvalController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDuration } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

interface EvalResultItem {
    eval_case_id: number;
    title: string;
    message?: string;
    expected_category: string;
    predicted_category: string | null;
    category_match: boolean;
    expected_priority: string;
    predicted_priority: string | null;
    priority_match: boolean;
    predicted_subject?: string | null;
    suggested_reply?: string | null;
    schema_valid: boolean;
    confidence: number | null;
    latency_ms: number;
    error: string | null;
}

interface EvalRun {
    id: number;
    provider: string;
    model_name: string;
    total_cases: number;
    category_accuracy: number;
    priority_accuracy: number;
    valid_schema_rate: number;
    avg_latency_ms: number;
    results_json: EvalResultItem[];
    created_at: string;
}

interface Props {
    run: EvalRun;
}

export default function EvalsShow({ run }: Props) {
    const [matchFilter, setMatchFilter] = useState<string>('all');
    const [confidenceFilter, setConfidenceFilter] = useState<string>('all');
    const [latencyFilter, setLatencyFilter] = useState<string>('all');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'AI Evals', href: evalsIndex.url() },
        { title: `Run #${run.id}`, href: evalsShow(run.id).url },
    ];

    const filteredResults = useMemo(() => {
        return run.results_json.filter((item) => {
            if (matchFilter === 'full_match' && !(item.category_match && item.priority_match)) {
                return false;
            }
            if (matchFilter === 'mismatch' && item.category_match && item.priority_match && !item.error) {
                return false;
            }
            if (matchFilter === 'category_match' && !item.category_match) {
                return false;
            }
            if (matchFilter === 'priority_match' && !item.priority_match) {
                return false;
            }
            if (matchFilter === 'error' && !item.error) {
                return false;
            }

            if (confidenceFilter === 'high' && (item.confidence === null || item.confidence < 0.8)) {
                return false;
            }
            if (confidenceFilter === 'medium' && (item.confidence === null || item.confidence < 0.5 || item.confidence >= 0.8)) {
                return false;
            }
            if (confidenceFilter === 'low' && (item.confidence === null || item.confidence >= 0.5)) {
                return false;
            }
            if (confidenceFilter === 'none' && item.confidence !== null) {
                return false;
            }

            if (latencyFilter === 'fast' && item.latency_ms >= 1000) {
                return false;
            }
            if (latencyFilter === 'normal' && (item.latency_ms < 1000 || item.latency_ms > 5000)) {
                return false;
            }
            if (latencyFilter === 'slow' && item.latency_ms <= 5000) {
                return false;
            }

            return true;
        });
    }, [run.results_json, matchFilter, confidenceFilter, latencyFilter]);

    const hasActiveFilters = matchFilter !== 'all' || confidenceFilter !== 'all' || latencyFilter !== 'all';

    function resetFilters() {
        setMatchFilter('all');
        setConfidenceFilter('all');
        setLatencyFilter('all');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Eval Run #${run.id}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={evalsIndex.url()}>
                            <ArrowLeft className="mr-2 size-4" />
                            Back to AI Evals
                        </Link>
                    </Button>
                    <div className="text-muted-foreground text-xs">
                        {run.provider} / <strong>{run.model_name}</strong> • {new Date(run.created_at).toLocaleString()}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{run.total_cases}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Category Accuracy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{run.category_accuracy}%</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Priority Accuracy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{run.priority_accuracy}%</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Valid Schema Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{run.valid_schema_rate}%</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatDuration(run.avg_latency_ms)}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-base">Filter Results</CardTitle>
                            <CardDescription>
                                Showing {filteredResults.length} of {run.results_json.length} evaluated cases
                            </CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <select
                                className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
                                value={matchFilter}
                                onChange={(e) => setMatchFilter(e.target.value)}
                            >
                                <option value="all">All Matches</option>
                                <option value="full_match">Full Match (Category & Priority)</option>
                                <option value="mismatch">Mismatched / Failed</option>
                                <option value="category_match">Category Match</option>
                                <option value="priority_match">Priority Match</option>
                                <option value="error">Errors Only</option>
                            </select>

                            <select
                                className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
                                value={confidenceFilter}
                                onChange={(e) => setConfidenceFilter(e.target.value)}
                            >
                                <option value="all">All Confidence Levels</option>
                                <option value="high">High (&ge; 80%)</option>
                                <option value="medium">Medium (50% - 79%)</option>
                                <option value="low">Low (&lt; 50%)</option>
                                <option value="none">No Confidence (Failed)</option>
                            </select>

                            <select
                                className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
                                value={latencyFilter}
                                onChange={(e) => setLatencyFilter(e.target.value)}
                            >
                                <option value="all">All Response Times</option>
                                <option value="fast">Fast (&lt; 1s)</option>
                                <option value="normal">Normal (1s - 5s)</option>
                                <option value="slow">Slow (&gt; 5s)</option>
                            </select>

                            {hasActiveFilters && (
                                <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                </Card>

                <div className="space-y-4">
                    {filteredResults.length === 0 ? (
                        <Card>
                            <CardContent className="text-muted-foreground py-8 text-center text-sm">
                                No evaluation cases match the selected filters.
                            </CardContent>
                        </Card>
                    ) : (
                        filteredResults.map((item) => (
                            <Card key={item.eval_case_id}>
                                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle className="text-base">
                                            #{item.eval_case_id} — {item.title}
                                        </CardTitle>
                                        {item.predicted_subject && (
                                            <CardDescription>AI Subject: {item.predicted_subject}</CardDescription>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <Badge variant={item.schema_valid ? 'outline' : 'destructive'}>
                                            {item.schema_valid ? 'Valid Schema' : 'Invalid Schema'}
                                        </Badge>
                                        {item.confidence !== null && (
                                            <Badge variant="secondary">{Math.round(item.confidence * 100)}% confidence</Badge>
                                        )}
                                        <span className="text-muted-foreground font-mono">
                                            {formatDuration(item.latency_ms)}
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {item.message && (
                                        <div className="bg-muted/40 rounded-md border p-3 text-sm">
                                            <div className="text-muted-foreground mb-1 text-xs font-semibold uppercase">
                                                Customer Message
                                            </div>
                                            {item.message}
                                        </div>
                                    )}

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="flex items-center justify-between rounded-md border p-3 text-sm">
                                            <div>
                                                <div className="text-muted-foreground text-xs uppercase">Category</div>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <Badge variant="outline">Expected: {item.expected_category}</Badge>
                                                    <Badge variant={item.category_match ? 'default' : 'destructive'}>
                                                        AI: {item.predicted_category ?? 'none'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {item.category_match ? (
                                                <CheckCircle2 className="size-5 text-green-600" />
                                            ) : (
                                                <XCircle className="text-destructive size-5" />
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between rounded-md border p-3 text-sm">
                                            <div>
                                                <div className="text-muted-foreground text-xs uppercase">Priority</div>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <Badge variant="outline">Expected: {item.expected_priority}</Badge>
                                                    <Badge variant={item.priority_match ? 'default' : 'destructive'}>
                                                        AI: {item.predicted_priority ?? 'none'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {item.priority_match ? (
                                                <CheckCircle2 className="size-5 text-green-600" />
                                            ) : (
                                                <XCircle className="text-destructive size-5" />
                                            )}
                                        </div>
                                    </div>

                                    {item.suggested_reply && (
                                        <div className="bg-muted/30 rounded-md border p-3 text-sm">
                                            <div className="text-muted-foreground mb-1 text-xs font-semibold uppercase">
                                                AI Suggested Reply
                                            </div>
                                            <p className="whitespace-pre-wrap">{item.suggested_reply}</p>
                                        </div>
                                    )}

                                    {item.error && (
                                        <div className="border-destructive/40 bg-destructive/10 text-destructive rounded-md border p-3 text-xs">
                                            <strong>Error:</strong> {item.error}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
