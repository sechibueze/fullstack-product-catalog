<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

abstract class ApiTestCase extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = $this->createAdmin();
        $this->token = $this->admin->createToken('test-token')->plainTextToken;
    }

    protected function createAdmin(): User
    {
        return User::factory()->create([
            'name'  => 'Test Admin',
            'email' => 'admin@test.com',
        ]);
    }

    protected function authHeaders(): array
    {
        return [
            'Authorization' => "Bearer {$this->token}",
            'Accept'        => 'application/json',
        ];
    }

    protected function publicHeaders(): array
    {
        return [
            'Accept' => 'application/json',
        ];
    }

    protected function assertJsonEnvelope(
        $response,
        int $status,
        bool $hasData = true
    ): void {
        $response->assertStatus($status);
        $response->assertJsonStructure(['message']);

        if ($hasData) {
            $response->assertJsonStructure(['data', 'message']);
        }
    }

    protected function assertErrorEnvelope($response, int $status): void
    {
        $response->assertStatus($status);
        $response->assertJsonStructure(['message', 'errors']);
    }
}