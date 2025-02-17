<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;
class UpdateStudentLicenseCompleteRequest extends FormRequest
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
            "course_id" => [
                "required",
                "exists:courses,id",
                // "unique:student_license_completes,course_id,student_id",
            ],
            "date_complete" => "required|date",
        ];
    }

    public function messages(): array
    {
        return [
            "date_complete.required" => "กรุณาเลือกวันที่",
            "date_complete.date" => "วันที่ไม่ถูกต้อง",
            // "course_id.unique" => "ไม่สามารถเพิ่มข้อมูลของหลักสูตรนี้ได้เพราะนักเรียนนี้ได้รับใบประกอบวิชาชีพก่อนหน้านี้แล้ว",
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'date_complete' => Carbon::createFromFormat('d/m/Y', $this->date_complete)->format('Y-m-d'),
        ]);
    }
}
