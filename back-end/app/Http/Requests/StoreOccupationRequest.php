<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOccupationRequest extends FormRequest
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
            "occupation_name" => "required|string|max:255|unique:occupations,occupation_name",
            "id" => "required|string|unique:occupations,id",
        ];
    }

    public function messages(): array
    {
        return [
            "occupation_name.unique" => "อาชีพนี้มีอยู่แล้ว",
            "id.unique" => "ไอดีนี้มีอยู่แล้ว",
        ];
    }
}
