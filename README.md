# AI Customer Support (`ai-customer-support`)

Intelligent customer support triage and response suggestion system built with **Laravel 12**, **Laravel AI SDK (`laravel/ai`)**, **Google Gemini**, **Laravel Sanctum**, **Inertia.js + React + Wayfinder**, **PostgreSQL**, and **Laravel Sail**.

## Key Features

- **Authorized Ticket Ingestion API (`POST /api/tickets`)**: Protected with **Laravel Sanctum** Bearer tokens and validated via Form Requests.
- **Asynchronous Queue Processing**: Tickets are queued on PostgreSQL (`QUEUE_CONNECTION=database`) and processed by `ClassifyTicketJob` with **3 retries and exponential backoff** (`[10s, 30s, 60s]`).
- **Structured AI Output**: Uses **Laravel AI SDK** (`TicketTriageAgent` implementing `HasStructuredOutput`) with **Gemini** to enforce a strict JSON schema (`category`, `priority`, `subject`, `confidence`, `suggested_reply`).
- **Automatic Human Fallback**: If all 3 AI retry attempts fail, `ClassifyTicketJob::failed()` routes the ticket to the `manual_triage` department with `fallback_manual` status.
- **Full Lifecycle History**: Every status transition (`queued` → `processing` → `awaiting_review` / `fallback_manual` → `resolved`) is recorded in `ticket_status_histories`.
- **Human-in-the-Loop Dashboard**: Built with **Inertia.js + React + TypeScript + Laravel Wayfinder** for reviewing AI classifications, editing suggested replies, managing Sanctum API tokens, and viewing evaluation runs.
- **AI Evaluation Suite (`php artisan ai:evaluate`)**: Benchmarks model accuracy (`category_accuracy`, `priority_accuracy`, `valid_schema_rate`, `avg_latency_ms`) against 20 manually labeled cases in `eval_cases`.

## Getting Started (Laravel Sail)

```bash
cp .env.example .env
# Add your GEMINI_API_KEY in .env

./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate --seed
npm install && npm run build
```

Start the queue worker:

```bash
./vendor/bin/sail artisan queue:work --tries=3
```

Access the app at `http://localhost:8080` (default seeded user: `admin@example.com` / `password`).

## Running Tests & Evaluations

```bash
./vendor/bin/sail artisan test
./vendor/bin/sail artisan ai:evaluate
```
