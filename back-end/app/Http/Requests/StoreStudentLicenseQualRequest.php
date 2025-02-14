<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;
class StoreStudentLicenseQualRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "student_id" => "required|exists:students,id",
            "course_id" => "required|exists:courses,id",
            "date_qualified" => "required|date",
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'date_qualified' => Carbon::createFromFormat('d/m/Y', $this->date_qualified)->format('Y-m-d'),
        ]);
    }
}
