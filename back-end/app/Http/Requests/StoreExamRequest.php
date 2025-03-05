<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;
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
            'course_group_id' => [
                'required',
                'exists:course_groups,id',
                'unique:exams,course_group_id,NULL,id,year,' . $this->year .
                ',term,' . $this->term .
                ',exam_type_id,' . $this->exam_type_id .
                ',exam_period,' . $this->exam_period
            ],
            'year' => 'required|integer',
            'term' => 'required|integer',
            'exam_type_id' => 'required|exists:exam_types,id',
            'exam_period' => 'required|in:1,2,3',
            'score_pass' => 'required|integer',
            'date_start_exam' => 'required|date',
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'date_start_exam' => Carbon::createFromFormat('d/m/Y', $this->date_start_exam)->format('Y-m-d'),
        ]);
    }

    public function messages()
    {
        return [
            'course_group_id.unique' => 'มีการสร้างข้อสอบสำหรับกลุ่มวิชา ปีการศึกษา เทอม ประเภทการสอบ และช่วงสอบนี้แล้ว'
        ];
    }
}
