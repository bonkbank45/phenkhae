<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBillInfoRequest extends FormRequest
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
            'course_group_id' => 'required|exists:course_groups,id',
            'student_id' => 'required|exists:students,id',
            'bill_vol' => 'required|numeric',
            'bill_no' => 'required|numeric',
            'bill_receiver' => 'required|string',
            'bill_date' => 'required|date',
        ];
    }
}
