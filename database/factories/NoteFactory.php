<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Note>
 */
class NoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 1, // Assuming a user with ID 1 exists
            'title' => $this->faker->sentence(),
            'content' => $this->faker->paragraphs(3, true),
            'summary' => $this->faker->paragraph(),
        ];
    }
}
