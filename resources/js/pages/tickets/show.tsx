import { index as dashboardIndex } from '@/actions/App/Http/Controllers/TicketDashboardController';
import { store as submitReview } from '@/actions/App/Http/Controllers/TicketReviewController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Bot, CheckCircle2, History } from 'lucide-react';
import React from 'react';

interface Department {
    id: number;
    slug: string;
    name: string;
}

interface StatusHistory {
    id: number;
    from_status: string | null;
    to_status: string;
    changed_by_type: string;
    notes: string | null;
    created_at: string;
    changed_by_user: { id: number; name: string } | null;
}

interface AiClassification {
    id: number;
    provider: string;
    model_name: string;
    category: string;
    priority: string;
    subject: string;
    confidence: number;
    suggested_reply: string;
    latency_ms: number;
    raw_payload: Record<string, unknown>;
}

interface Ticket {
    id: number;
    external_id: string | null;
    customer_name: string;
    customer_email: string;
    subject_raw: string | null;
    message: string;
    current_status: string;
    department_id: number | null;
    error_reason: string | null;
    department: Department | null;
    latest_classification: AiClassification | null;
    status_histories: StatusHistory[];
    review: {
        id: number;
        final_priority: string;
        final_reply: string;
        ai_was_edited: boolean;
        reviewed_at: string;
        reviewer: { name: string } | null;
        final_department: { name: string } | null;
    } | null;
}

interface Props {
    ticket: Ticket;
    departments: Department[];
    priorities: string[];
}

export default function TicketShow({ ticket, departments, priorities }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Support Queue', href: dashboardIndex.url() },
        { title: `Ticket #${ticket.id}`, href: `/tickets/${ticket.id}` },
    ];

    const form = useForm({
        final_department_id: ticket.department_id ?? departments[0]?.id ?? '',
        final_priority: ticket.latest_classification?.priority ?? 'medium',
        final_reply: ticket.latest_classification?.suggested_reply ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(submitReview.url(ticket.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ticket #${ticket.id}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={dashboardIndex.url()}>
                            <ArrowLeft className="mr-2 size-4" />
                            Back to Queue
                        </Link>
                    </Button>
                    <Badge variant={ticket.current_status === 'fallback_manual' ? 'destructive' : 'default'}>
                        {ticket.current_status.replace('_', ' ')}
                    </Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {ticket.latest_classification?.subject ?? ticket.subject_raw ?? `Ticket #${ticket.id}`}
                                </CardTitle>
                                <CardDescription>
                                    From {ticket.customer_name} ({ticket.customer_email})
                                    {ticket.external_id ? ` • External ID: ${ticket.external_id}` : ''}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/50 rounded-md border p-4 text-sm whitespace-pre-wrap">
                                    {ticket.message}
                                </div>
                                {ticket.error_reason && (
                                    <div className="border-destructive/40 bg-destructive/10 text-destructive mt-4 rounded-md border p-3 text-xs">
                                        <strong>Fallback Reason:</strong> {ticket.error_reason}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {ticket.review ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle2 className="size-5 text-green-600" />
                                        Resolved Review
                                    </CardTitle>
                                    <CardDescription>
                                        Reviewed by {ticket.review.reviewer?.name ?? 'Agent'} •{' '}
                                        {ticket.review.ai_was_edited ? 'AI output edited' : 'AI output approved as-is'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div>
                                        <strong>Final Department:</strong> {ticket.review.final_department?.name}
                                    </div>
                                    <div>
                                        <strong>Final Priority:</strong>{' '}
                                        <span className="capitalize">{ticket.review.final_priority}</span>
                                    </div>
                                    <div className="bg-muted/50 rounded-md border p-4 whitespace-pre-wrap">
                                        {ticket.review.final_reply}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Human Review & Dispatch</CardTitle>
                                    <CardDescription>
                                        Verify the department, priority, and edit the suggested reply before resolving.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="final_department_id">Department</Label>
                                                <select
                                                    id="final_department_id"
                                                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                                    value={form.data.final_department_id}
                                                    onChange={(e) => form.setData('final_department_id', Number(e.target.value))}
                                                >
                                                    {departments.map((dept) => (
                                                        <option key={dept.id} value={dept.id}>
                                                            {dept.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {form.errors.final_department_id && (
                                                    <p className="text-destructive text-xs">{form.errors.final_department_id}</p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="final_priority">Priority</Label>
                                                <select
                                                    id="final_priority"
                                                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm capitalize"
                                                    value={form.data.final_priority}
                                                    onChange={(e) => form.setData('final_priority', e.target.value)}
                                                >
                                                    {priorities.map((p) => (
                                                        <option key={p} value={p}>
                                                            {p}
                                                        </option>
                                                    ))}
                                                </select>
                                                {form.errors.final_priority && (
                                                    <p className="text-destructive text-xs">{form.errors.final_priority}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="final_reply">Reply to Customer</Label>
                                            <textarea
                                                id="final_reply"
                                                rows={6}
                                                className="border-input bg-background w-full rounded-md border p-3 text-sm"
                                                value={form.data.final_reply}
                                                onChange={(e) => form.setData('final_reply', e.target.value)}
                                                placeholder="Write or refine the response..."
                                            />
                                            {form.errors.final_reply && (
                                                <p className="text-destructive text-xs">{form.errors.final_reply}</p>
                                            )}
                                        </div>

                                        <Button type="submit" disabled={form.processing}>
                                            {form.processing ? 'Saving...' : 'Approve & Resolve Ticket'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Bot className="size-4" />
                                    AI Structured Output
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {ticket.latest_classification ? (
                                    <div className="space-y-3 text-xs">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-muted-foreground">Provider:</span>{' '}
                                                <strong>{ticket.latest_classification.provider}</strong>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Latency:</span>{' '}
                                                <strong>{ticket.latest_classification.latency_ms} ms</strong>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Category:</span>{' '}
                                                <strong>{ticket.latest_classification.category}</strong>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Confidence:</span>{' '}
                                                <strong>{Math.round(ticket.latest_classification.confidence * 100)}%</strong>
                                            </div>
                                        </div>
                                        <pre className="bg-muted overflow-x-auto rounded p-2.5 text-[11px]">
                                            {JSON.stringify(ticket.latest_classification.raw_payload, null, 2)}
                                        </pre>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm">No AI classification recorded.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <History className="size-4" />
                                    Lifecycle History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {ticket.status_histories.map((item) => (
                                        <div key={item.id} className="border-l-2 pl-3 text-xs">
                                            <div className="font-medium">
                                                {item.from_status ? `${item.from_status} → ` : ''}
                                                <span className="text-primary">{item.to_status}</span>
                                            </div>
                                            <div className="text-muted-foreground">
                                                by {item.changed_by_user?.name ?? item.changed_by_type} •{' '}
                                                {new Date(item.created_at).toLocaleString()}
                                            </div>
                                            {item.notes && <p className="mt-1">{item.notes}</p>}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
