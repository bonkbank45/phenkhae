<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMaritalStatusRequest extends FormRequest
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
            'marital_name' => 'required|string|unique:marital_statuses,marital_name,' . $this->id,
        ];
    }

    public function messages(): array
    {
        return [
            'marital_name.unique' => 'ชื่อสถานะนี้มีอยู่ในระบบแล้ว',
        ];
    }
}
