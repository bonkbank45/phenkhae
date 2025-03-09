<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseCategoryRequest extends FormRequest
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
            'category_name' => 'required|string|max:255|unique:course_categories,category_name',
            'id' => 'nullable|integer|unique:course_categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'category_name.unique' => 'ชื่อประเภทหลักสูตรนี้มีอยู่ในระบบแล้ว',
            'id.unique' => 'รหัสประเภทหลักสูตรนี้มีอยู่ในระบบแล้ว',
        ];
    }
}
