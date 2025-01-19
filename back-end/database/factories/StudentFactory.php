<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Student;
use App\Models\Prename;
use App\Models\MaritalStatus;
use App\Models\Occupation;
use App\Models\Province;
use App\Models\Subdistrict;
use App\Models\MedicalCondition;
use App\Models\EducationQual;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    protected $model = Student::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $thai_faker = \Faker\Factory::create('th_TH');
        return [
            'prename_id' => Prename::inRandomOrder()->first()->id,
            'firstname_tha' => $thai_faker->firstName,
            'lastname_tha' => $thai_faker->lastName,
            'firstname_eng' => $this->faker->firstName,
            'lastname_eng' => $this->faker->lastName,
            'citizenid_card' => $this->faker->numerify,
            'birthdate' => $this->faker->date('Y-m-d', '-20 years'),
            'birth_province_id' => Province::inRandomOrder()->first()->id,
            'father_fname' => $thai_faker->firstNameMale,
            'father_lname' => $thai_faker->lastName,
            'mother_fname' => $thai_faker->firstNameFemale,
            'mother_lname' => $thai_faker->lastName,
            'marital_id' => MaritalStatus::inRandomOrder()->first()->id,
            'address_num' => $this->faker->numerify,
            'address_moo' => $this->faker->numerify,
            'address_soi' => $this->faker->randomDigitNotNull,
            'address_road' => $this->faker->streetName,
            'address_subdistrict_id' => Subdistrict::inRandomOrder()->first()->id,
            'phonenumber' => $this->faker->phoneNumber,
            'email' => $this->faker->email,
            'occupation_id' => Occupation::inRandomOrder()->first()->id,
            'medical_condition_id' => MedicalCondition::inRandomOrder()->first()->id,
            'surgery_history' => $this->faker->text,
            'edu_qual_id' => EducationQual::inRandomOrder()->first()->id,
            'edu_ins' => $this->faker->text,
            'learn_massage' => $this->faker->numberBetween(0, 1),
            'learn_massage_description' => function (array $attributes) {
                return $attributes['learn_massage'] == 1 ? $this->faker->text : null;
            },
            'work_massage' => $this->faker->numberBetween(0, 1),
            'work_massage_description' => function (array $attributes) {
                return $attributes['work_massage'] == 1 ? $this->faker->text : null;
            },
        ];
    }
}

