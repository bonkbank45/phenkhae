<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExamRequest extends FormRequest
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
            'year' => 'required|string',
            'term' => 'required|string',
            'exam_type_id' => 'required|exists:exam_types,id',
            'exam_period' => 'required|in:1,2',
            'score_full' => 'required|integer',
            'score_real' => 'required|integer',
            'date_exam' => 'required|date',
        ];
    }
}
