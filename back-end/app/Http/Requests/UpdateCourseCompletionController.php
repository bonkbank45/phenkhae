<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;
class UpdateCourseCompletionController extends FormRequest
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
            'id' => 'required|integer|exists:course_completions,id',
            'date_start' => 'required|date',
            'date_end' => 'required|date',
            'completion_date' => 'required|date',
            'certificate_status' => 'required|integer:0,1',
            'certificate_date' => 'nullable|date',
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'date_start' => Carbon::createFromFormat('d/m/Y', $this->date_start)->format('Y-m-d'),
            'date_end' => Carbon::createFromFormat('d/m/Y', $this->date_end)->format('Y-m-d'),
            'completion_date' => Carbon::createFromFormat('d/m/Y', $this->completion_date)->format('Y-m-d'),
            'certificate_date' => $this->certificate_date ? Carbon::createFromFormat('d/m/Y', $this->certificate_date)->format('Y-m-d') : null,
        ]);
    }
}
