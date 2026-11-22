<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class GenerateApiTokenCommand extends Command
{
    protected $signature = 'api:token
        {user_id? : ID of an existing user}
        {--create-user : Create a new user and generate a token for them}
        {--name=integration-token : Name of the API token}
        {--user-name= : Name for the new user (when --create-user is passed)}
        {--email= : Email for the new user (when --create-user is passed)}';

    protected $description = 'Generate a Sanctum API token for an existing user ID or create a new user.';

    public function handle(): int
    {
        $createUser = (bool) $this->option('create-user');
        $userId = $this->argument('user_id');

        if ($createUser) {
            $user = $this->createNewUser();

            if (! $user) {
                return self::FAILURE;
            }
        } else {
            if (! $userId) {
                $this->error('Please provide a user_id or pass --create-user.');

                return self::FAILURE;
            }

            $user = User::find($userId);

            if (! $user) {
                $this->error("User with ID {$userId} not found.");

                return self::FAILURE;
            }
        }

        $tokenName = (string) ($this->option('name') ?: 'integration-token');
        $plainTextToken = $user->createToken($tokenName)->plainTextToken;

        $this->info('Sanctum API token generated successfully.');
        $this->table(
            ['User ID', 'User Email', 'Token Name', 'Bearer Token'],
            [[$user->id, $user->email, $tokenName, $plainTextToken]],
        );

        return self::SUCCESS;
    }

    private function createNewUser(): ?User
    {
        $name = $this->option('user-name') ?: $this->ask('New user name');
        $email = $this->option('email') ?: $this->ask('New user email');

        $validator = Validator::make(
            ['name' => $name, 'email' => $email],
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            ],
        );

        if ($validator->fails()) {
            $this->error($validator->errors()->first());

            return null;
        }

        return User::create([
            'name' => $name,
            'email' => $email,
            'password' => Str::random(32),
            'email_verified_at' => now(),
        ]);
    }
}
