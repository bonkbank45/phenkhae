<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;
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
            'bill_receiver' => 'required|string',
            'date_submit' => 'required|date',
            'note' => 'nullable|string',
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'bill_receiver' => $this->bill_infos_receiver,
            'date_submit' => Carbon::createFromFormat('d/m/Y', $this->bill_infos_date)->format('Y-m-d'),
            'note' => $this->bill_infos_note,
        ]);
    }
}
