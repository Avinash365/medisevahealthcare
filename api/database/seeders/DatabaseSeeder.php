<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create a default test user if not exists
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create admin user from env or default credentials
        $adminEmail = env('ADMIN_EMAIL', 'admin@mediseva.local');
        $adminPassword = env('ADMIN_PASSWORD', 'Admin@123');
        if (!User::where('email', $adminEmail)->exists()) {
            User::create([
                'name' => 'Administrator',
                'email' => $adminEmail,
                'password' => $adminPassword,
                'api_token' => hash('sha256', \Illuminate\Support\Str::random(60))
            ]);
        }
    }
}
