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
            'max_students' => [
                'required',
                'integer',
                'min:1',
                function ($attribute, $value, $fail) {
                    $courseGroup = \App\Models\CourseGroup::findOrFail($this->id);
                    $enrollmentsCount = $courseGroup->enrollments->count();
                    if ($enrollmentsCount > $value) {
                        $fail("ไม่สามารถกำหนดจำนวนรับนักเรียนน้อยกว่าจำนวนนักเรียนที่ลงทะเบียนอยู่ได้ (ปัจจุบันมีนักเรียน {$enrollmentsCount} คน)");
                    }
                }
            ],
            'course_id' => 'required|exists:courses,id',
            'batch' => [
                'min:1',
                'required',
                'integer',
                Rule::unique('course_groups')
                    ->where('course_id', $this->course_id)
                    ->ignore($this->id),
            ],
            'theoretical_score_criteria' => 'nullable|integer|min:0|max:100',
            'practical_score_criteria' => 'nullable|integer|min:0|max:100',
            'date_start' => 'required|date',
            'date_end' => 'required|date|after:date_start',
        ];
    }

    public function messages(): array
    {
        return [
            'max_students.min' => 'จำนวนนักเรียนที่รับต้องมากกว่าหรือเท่ากับ 1 คน',
            'batch.unique' => 'มีรุ่นหลักสูตรนี้ในระบบแล้ว โปรดระบุรุ่นหลักสูตรไม่ให้ซ้ำกัน',
            'batch.min' => 'รุ่นหลักสูตรต้องมากกว่าหรือเท่ากับ 1',
        ];
    }
}
