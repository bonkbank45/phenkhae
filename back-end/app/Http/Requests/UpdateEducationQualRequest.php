<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEducationQualRequest extends FormRequest
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
            'id' => 'required|string',
            'edu_qual_name' => 'required|string|max:255|unique:education_quals,edu_qual_name,' . $this->id,
            'edu_qual_eng' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'edu_qual_name.unique' => 'ชื่อวุฒิการศึกษานี้มีอยู่ในระบบแล้ว',
        ];
    }
}
