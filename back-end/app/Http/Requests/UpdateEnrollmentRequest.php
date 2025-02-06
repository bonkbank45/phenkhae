<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;
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
            'theoretical_score' => 'nullable|integer|min:0|max:100',
            'practical_score' => 'nullable|integer|min:0|max:100',
            'date_start' => 'required|date',
            'date_end' => 'nullable|date:after:date_start',
            'course_price_id' => 'nullable|exists:course_prices,id',
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'enrollment_date' => Carbon::createFromFormat('d/m/Y', $this->input('enrollment_date'))->format('Y-m-d'),
            'date_start' => Carbon::createFromFormat('d/m/Y', $this->input('date_start'))->format('Y-m-d'),
        ]);
    }
}
