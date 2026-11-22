<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Support Lead',
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        $this->call([
            DepartmentSeeder::class,
            EvalCaseSeeder::class,
            AiAgentSeeder::class,
        ]);
    }
}
