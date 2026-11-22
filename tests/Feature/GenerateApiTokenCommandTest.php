<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GenerateApiTokenCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_web_routes_for_api_tokens_are_removed(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/settings/api-tokens', ['name' => 'test-token'])
            ->assertNotFound();
    }

    public function test_command_generates_token_for_existing_user_id(): void
    {
        $user = User::factory()->create();

        $this->artisan('api:token', [
            'user_id' => $user->id,
            '--name' => 'zendesk-bridge',
        ])->assertSuccessful();

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->id,
            'name' => 'zendesk-bridge',
        ]);
    }

    public function test_command_fails_when_user_id_does_not_exist(): void
    {
        $this->artisan('api:token', [
            'user_id' => 99999,
        ])->assertFailed();
    }

    public function test_command_can_create_new_user_and_generate_token(): void
    {
        $this->artisan('api:token', [
            '--create-user' => true,
            '--user-name' => 'Webhook Integration',
            '--email' => 'webhook@example.com',
            '--name' => 'webhook-token',
        ])->assertSuccessful();

        $user = User::where('email', 'webhook@example.com')->firstOrFail();

        $this->assertSame('Webhook Integration', $user->name);
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->id,
            'name' => 'webhook-token',
        ]);
    }
}
