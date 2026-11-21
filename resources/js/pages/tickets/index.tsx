import { index as dashboardIndex, show as ticketShow } from '@/actions/App/Http/Controllers/TicketDashboardController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Clock, Inbox, Sparkles } from 'lucide-react';

interface Department {
    id: number;
    slug: string;
    name: string;
}

interface Classification {
    id: number;
    category: string;
    priority: string;
    subject: string;
    confidence: number;
    latency_ms: number;
}

interface Ticket {
    id: number;
    external_id: string | null;
    customer_name: string;
    customer_email: string;
    subject_raw: string | null;
    message: string;
    current_status: string;
    created_at: string;
    department: Department | null;
    latest_classification: Classification | null;
}

interface Props {
    tickets: {
        data: Ticket[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    departments: Department[];
    statuses: Array<{ value: string; label: string }>;
    metrics: {
        total: number;
        queued: number;
        awaiting_review: number;
        fallback_manual: number;
        resolved: number;
        ai_acceptance_rate: number | null;
    };
    filters: {
        status: string;
        department_id: number | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Support Queue',
        href: '/dashboard',
    },
];

const statusBadgeVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    queued: 'secondary',
    processing: 'secondary',
    awaiting_review: 'default',
    fallback_manual: 'destructive',
    resolved: 'outline',
};

const priorityColor: Record<string, string> = {
    urgent: 'text-red-600 dark:text-red-400 font-semibold',
    high: 'text-orange-600 dark:text-orange-400 font-medium',
    medium: 'text-yellow-600 dark:text-yellow-400',
    low: 'text-muted-foreground',
};

export default function TicketsIndex({ tickets, departments, statuses, metrics, filters }: Props) {
    function applyFilter(key: 'status' | 'department_id', value: string) {
        router.get(
            dashboardIndex.url({
                query: {
                    ...filters,
                    [key]: value || undefined,
                },
            }),
            {},
            { preserveState: true, replace: true },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Support Queue" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                            <Inbox className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Queued / Processing</CardTitle>
                            <Clock className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.queued}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Awaiting Review</CardTitle>
                            <Sparkles className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.awaiting_review}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Manual Fallback</CardTitle>
                            <AlertTriangle className="text-destructive size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-destructive text-2xl font-bold">{metrics.fallback_manual}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">AI Approval Rate</CardTitle>
                            <CheckCircle2 className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {metrics.ai_acceptance_rate !== null ? `${metrics.ai_acceptance_rate}%` : '—'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle>Incoming Support Tickets</CardTitle>
                        <div className="flex flex-wrap gap-2">
                            <select
                                className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
                                value={filters.status ?? ''}
                                onChange={(e) => applyFilter('status', e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                {statuses.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
                                value={filters.department_id ?? ''}
                                onChange={(e) => applyFilter('department_id', e.target.value)}
                            >
                                <option value="">All Departments</option>
                                {departments.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {tickets.data.length === 0 ? (
                            <div className="text-muted-foreground py-12 text-center text-sm">
                                No tickets found. Generate a Sanctum token in <strong>API Tokens</strong> and POST to{' '}
                                <code>/api/tickets</code>.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-muted-foreground border-b text-xs uppercase">
                                        <tr>
                                            <th className="py-3 pr-4">ID</th>
                                            <th className="py-3 pr-4">Customer</th>
                                            <th className="py-3 pr-4">Subject / Summary</th>
                                            <th className="py-3 pr-4">Department</th>
                                            <th className="py-3 pr-4">Priority</th>
                                            <th className="py-3 pr-4">Status</th>
                                            <th className="py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {tickets.data.map((ticket) => (
                                            <tr key={ticket.id} className="hover:bg-muted/40">
                                                <td className="py-3 pr-4 font-mono text-xs">#{ticket.id}</td>
                                                <td className="py-3 pr-4">
                                                    <div className="font-medium">{ticket.customer_name}</div>
                                                    <div className="text-muted-foreground text-xs">{ticket.customer_email}</div>
                                                </td>
                                                <td className="max-w-xs truncate py-3 pr-4">
                                                    {ticket.latest_classification?.subject ?? ticket.subject_raw ?? ticket.message}
                                                </td>
                                                <td className="py-3 pr-4">{ticket.department?.name ?? 'Pending'}</td>
                                                <td className={`py-3 pr-4 capitalize ${priorityColor[ticket.latest_classification?.priority ?? ''] ?? ''}`}>
                                                    {ticket.latest_classification?.priority ?? '—'}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <Badge variant={statusBadgeVariant[ticket.current_status] ?? 'outline'}>
                                                        {ticket.current_status.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={ticketShow(ticket.id).url}>Inspect</Link>
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
            </div>
        </AppLayout>
    );
}
