<?php

namespace Database\Seeders;

use App\Models\EvalCase;
use Illuminate\Database\Seeder;

class EvalCaseSeeder extends Seeder
{
    public function run(): void
    {
        $cases = [
            ['title' => 'Production API 500 error', 'message' => 'Our entire production webhook integration has been returning HTTP 500 errors for the last 20 minutes. Customers cannot check out!', 'expected_category' => 'technical_support', 'expected_priority' => 'urgent', 'expected_department_slug' => 'technical_support'],
            ['title' => 'Duplicate credit card charge', 'message' => 'I was charged twice on my credit card this month ($99.00 x 2). Please refund the duplicate charge as soon as possible.', 'expected_category' => 'billing', 'expected_priority' => 'high', 'expected_department_slug' => 'billing'],
            ['title' => 'Enterprise quote request', 'message' => 'We have a team of 120 agents and would like a custom annual quote for the Enterprise plan with SSO.', 'expected_category' => 'sales', 'expected_priority' => 'medium', 'expected_department_slug' => 'sales'],
            ['title' => 'Cancel subscription immediately', 'message' => 'Please cancel my subscription before the next billing cycle. We are no longer using the platform.', 'expected_category' => 'cancellation', 'expected_priority' => 'medium', 'expected_department_slug' => 'cancellation'],
            ['title' => 'Password reset email missing', 'message' => 'I tried resetting my password three times today and never received the email in my inbox or spam folder.', 'expected_category' => 'technical_support', 'expected_priority' => 'medium', 'expected_department_slug' => 'technical_support'],
            ['title' => 'Download October invoice PDF', 'message' => 'Hi, could you send me the PDF invoice for October 2026? Our accounting team needs it for tax filing.', 'expected_category' => 'billing', 'expected_priority' => 'low', 'expected_department_slug' => 'billing'],
            ['title' => 'Database locked out all users', 'message' => 'All 40 of our team members are locked out with an Invalid Tenant Token error right now.', 'expected_category' => 'technical_support', 'expected_priority' => 'urgent', 'expected_department_slug' => 'technical_support'],
            ['title' => 'Upgrade from Starter to Pro', 'message' => 'How do I upgrade from Starter to Pro and add 5 more seats? Do you offer a discount for annual billing?', 'expected_category' => 'sales', 'expected_priority' => 'low', 'expected_department_slug' => 'sales'],
            ['title' => 'Cancel due to high price', 'message' => 'The new pricing is too expensive for our small business, so I want to close my account this week.', 'expected_category' => 'cancellation', 'expected_priority' => 'high', 'expected_department_slug' => 'cancellation'],
            ['title' => 'Update billing VAT number', 'message' => 'We changed our company legal entity and need to update our VAT tax ID on future invoices.', 'expected_category' => 'billing', 'expected_priority' => 'low', 'expected_department_slug' => 'billing'],
            ['title' => 'CSV export crashes browser', 'message' => 'Whenever I export more than 5,000 rows to CSV from the reports page, the page freezes and crashes.', 'expected_category' => 'technical_support', 'expected_priority' => 'high', 'expected_department_slug' => 'technical_support'],
            ['title' => 'Demo request for healthcare', 'message' => 'Can we schedule a 30-minute product demo next Tuesday? We are evaluating tools for a 50-person support team.', 'expected_category' => 'sales', 'expected_priority' => 'medium', 'expected_department_slug' => 'sales'],
            ['title' => 'Unauthorized charge after cancel', 'message' => 'I cancelled two weeks ago and you still charged my card $49 today! Fix this immediately or I will file a chargeback.', 'expected_category' => 'billing', 'expected_priority' => 'urgent', 'expected_department_slug' => 'billing'],
            ['title' => 'Two-factor auth lost phone', 'message' => 'I lost my phone and no longer have access to my 2FA authenticator app. How can I regain access?', 'expected_category' => 'technical_support', 'expected_priority' => 'high', 'expected_department_slug' => 'technical_support'],
            ['title' => 'How to delete account', 'message' => 'Where is the button to permanently delete my workspace and cancel my plan?', 'expected_category' => 'cancellation', 'expected_priority' => 'medium', 'expected_department_slug' => 'cancellation'],
            ['title' => 'Dark mode toggle question', 'message' => 'Is there a keyboard shortcut to switch between light and dark mode in the dashboard?', 'expected_category' => 'technical_support', 'expected_priority' => 'low', 'expected_department_slug' => 'technical_support'],
            ['title' => 'Nonprofit discount inquiry', 'message' => 'Do you offer special pricing or discounts for registered 501(c)(3) nonprofit organizations?', 'expected_category' => 'sales', 'expected_priority' => 'low', 'expected_department_slug' => 'sales'],
            ['title' => 'Payment failed card expired', 'message' => 'My payment failed because my corporate card expired. Where do I enter the new card details?', 'expected_category' => 'billing', 'expected_priority' => 'medium', 'expected_department_slug' => 'billing'],
            ['title' => 'Pause subscription for 2 months', 'message' => 'We are seasonal and want to cancel or pause our subscription until February.', 'expected_category' => 'cancellation', 'expected_priority' => 'low', 'expected_department_slug' => 'cancellation'],
            ['title' => 'General partnership inquiry', 'message' => 'Hello, we run a podcast about customer experience and would love to interview your founder.', 'expected_category' => 'other', 'expected_priority' => 'low', 'expected_department_slug' => 'manual_triage'],
        ];

        foreach ($cases as $case) {
            EvalCase::updateOrCreate(
                ['title' => $case['title']],
                $case,
            );
        }
    }
}
