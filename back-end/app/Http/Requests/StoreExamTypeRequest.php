<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExamTypeRequest extends FormRequest
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
            'exam_type_name' => 'required|string|unique:exam_types,exam_type_name|max:255',
            'id' => 'nullable|integer|unique:exam_types,id',
        ];
    }

    public function messages(): array
    {
        return [
            'exam_type_name.unique' => 'ประเภทการสอบนี้มีในระบบเรียบร้อยแล้ว',
            'id.unique' => 'ไอดีประเภทการสอบนี้มีในระบบแล้ว',
        ];
    }
}
