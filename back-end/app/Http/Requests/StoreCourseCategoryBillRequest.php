<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseCategoryBillRequest extends FormRequest
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
            'category_bill_name' => 'required|string|max:255|unique:course_category_bills,category_bill_name',
            'id' => 'nullable|integer|unique:course_category_bills,id',
        ];
    }

    public function messages(): array
    {
        return [
            'category_bill_name.unique' => 'ชื่อประเภทบิลนี้มีอยู่ในระบบแล้ว',
            'id.unique' => 'รหัสประเภทบิลนี้มีอยู่ในระบบแล้ว',
        ];
    }
}
