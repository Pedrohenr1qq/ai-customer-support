import { destroy as destroyToken, index as tokensIndex, store as storeToken } from '@/actions/App/Http/Controllers/ApiTokenController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { KeyRound, Trash2 } from 'lucide-react';
import React from 'react';

interface TokenItem {
    id: number;
    name: string;
    last_used_at: string | null;
    created_at: string;
}

interface Props {
    tokens: TokenItem[];
    newToken: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'API Tokens',
        href: tokensIndex.url(),
    },
];

export default function ApiTokens({ tokens, newToken }: Props) {
    const form = useForm({
        name: '',
    });

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        form.post(storeToken.url(), {
            onSuccess: () => form.reset(),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="API Tokens" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound className="size-5" />
                            Sanctum Integration Tokens
                        </CardTitle>
                        <CardDescription>
                            Only authorized external systems with a valid Bearer token can ingest tickets via{' '}
                            <code>POST /api/tickets</code>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3">
                            <div className="min-w-64 flex-1 space-y-1.5">
                                <Label htmlFor="name">Token Name</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="e.g. Zendesk Webhook Bridge"
                                />
                                {form.errors.name && <p className="text-destructive text-xs">{form.errors.name}</p>}
                            </div>
                            <Button type="submit" disabled={form.processing}>
                                Generate Token
                            </Button>
                        </form>

                        {newToken && (
                            <div className="rounded-md border border-green-500/40 bg-green-500/10 p-4 text-xs">
                                <p className="mb-1 font-semibold">Copy your new token now (it will not be shown again):</p>
                                <code className="block break-all font-mono">{newToken}</code>
                            </div>
                        )}

                        <pre className="bg-muted overflow-x-auto rounded-md p-3 text-xs">{`curl -X POST http://localhost:8080/api/tickets \\
  -H "Authorization: Bearer <YOUR_TOKEN>" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json" \\
  -d '{"customer_name":"Jane Doe","customer_email":"jane@example.com","message":"I was charged twice on my invoice #1042."}'`}</pre>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Tokens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tokens.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No active tokens yet.</p>
                        ) : (
                            <div className="divide-y">
                                {tokens.map((token) => (
                                    <div key={token.id} className="flex items-center justify-between py-3 text-sm">
                                        <div>
                                            <div className="font-medium">{token.name}</div>
                                            <div className="text-muted-foreground text-xs">
                                                Created {new Date(token.created_at).toLocaleString()}
                                                {token.last_used_at ? ` • Last used ${new Date(token.last_used_at).toLocaleString()}` : ''}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.delete(destroyToken.url(token.id))}
                                        >
                                            <Trash2 className="text-destructive size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
