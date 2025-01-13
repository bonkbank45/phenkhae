<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEnrollmentRequest extends FormRequest
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
            'student_ids' => 'required|array',
            'student_ids.*' => 'required|exists:students,id',
        ];

        // return [
        //     'course_group_id' => 'required|exists:course_groups,id',
        //     'student_id' => 'required|exists:students,id',
        //     'activity_case_status' => 'required|in:0,1',
        //     'enrollment_date' => 'required|date',
        //     'date_start' => 'required|date',
        //     'date_end' => 'required|date:after:date_start',
        //     'course_price_id' => 'required|exists:course_prices,id',
        // ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'student_ids.required' => 'Please select at least one student',
            'student_ids.array' => 'Student IDs must be provided as an array',
            'student_ids.min' => 'Please select at least one student',
            'student_ids.*.required' => 'Each student ID must be provided',
            'student_ids.*.integer' => 'Each student ID must be a number',
            'student_ids.*.exists' => 'One or more selected students do not exist',
        ];
    }
}
