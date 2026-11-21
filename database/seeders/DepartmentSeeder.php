<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            [
                'slug' => 'technical_support',
                'name' => 'Technical Support',
                'description' => 'Bugs, login issues, integrations, errors, and platform downtime.',
            ],
            [
                'slug' => 'billing',
                'name' => 'Billing & Finance',
                'description' => 'Invoices, duplicate charges, refunds, payment methods, and receipts.',
            ],
            [
                'slug' => 'sales',
                'name' => 'Sales & Upgrades',
                'description' => 'Enterprise plans, pricing quotes, seat upgrades, and demos.',
            ],
            [
                'slug' => 'cancellation',
                'name' => 'Retention & Cancellation',
                'description' => 'Subscription cancellations, downgrades, and account closure requests.',
            ],
            [
                'slug' => 'manual_triage',
                'name' => 'Manual Triage',
                'description' => 'Fallback queue for tickets when AI is unavailable or unclassifiable.',
            ],
        ];

        foreach ($departments as $department) {
            Department::updateOrCreate(
                ['slug' => $department['slug']],
                $department,
            );
        }
    }
}
