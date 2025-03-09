<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;
class UpdateExamRequest extends FormRequest
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
                'unique:exams,course_group_id,' . $this->id .
                ',id,year,' . $this->year .
                ',term,' . $this->term .
                ',exam_type_id,' . $this->exam_type_id .
                ',exam_period,' . $this->exam_period
            ],
            'year' => 'required|integer',
            'term' => 'required|integer',
            'exam_type_id' => 'required|exists:exam_types,id',
            'exam_period' => 'required|integer',
            'score_full' => 'required|integer|min:1',
            'score_pass' => [
                'required',
                'integer',
                'min:1',
                'lte:score_full'
            ],
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
            'course_group_id.unique' => 'มีการสร้างข้อสอบสำหรับกลุ่มวิชา ปีการศึกษา เทอม ประเภทการสอบ และช่วงสอบนี้แล้ว',
            'score_pass.required' => 'กรุณากรอกคะแนนผ่าน',
            'score_full.required' => 'กรุณากรอกคะแนนเต็ม',
            'score_full.integer' => 'คะแนนเต็มต้องเป็นจำนวนเต็ม',
            'score_full.min' => 'คะแนนเต็มต้องมากกว่า 0',
            'score_pass.integer' => 'คะแนนผ่านต้องเป็นจำนวนเต็ม',
            'score_pass.min' => 'คะแนนผ่านต้องมากกว่า 0',
            'score_pass.lte' => 'คะแนนผ่านต้องน้อยกว่าคะแนนเต็ม',
        ];
    }
}
