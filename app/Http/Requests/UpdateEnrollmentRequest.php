<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEnrollmentRequest extends FormRequest
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
            'course_group_id' => 'required|exists:course_groups,id',
            'student_id' => 'required|exists:students,id',
            'activity_case_status' => 'required|in:0,1',
            'enrollment_date' => 'required|date',
            'date_start' => 'required|date',
            'date_end' => 'required|date:after:date_start',
            'course_price_id' => 'required|exists:course_prices,id',
        ];
    }
}
