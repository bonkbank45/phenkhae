<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateCourseGroupRequest extends FormRequest
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
            'max_students' => 'required|integer|min:1',
            'course_id' => 'required|exists:courses,id',
            'batch' => [
                'required',
                'integer',
                Rule::unique('course_groups')->where('course_id', $this->course_id),
            ],
            'date_start' => 'required|date',
            'date_end' => 'required|date|after:date_start',
        ];
    }

    public function messages(): array
    {
        return [
            'batch.unique' => 'มีรุ่นหลักสูตรนี้ในระบบแล้ว โปรดระบุรุ่นหลักสูตรไม่ให้ซ้ำกัน',
        ];
    }
}
