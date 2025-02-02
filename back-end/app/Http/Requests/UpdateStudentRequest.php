<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
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
            "prename_id" => "required|exists:prenames,id",
            "firstname_tha" => "required|string|max:255",
            "lastname_tha" => "required|string|max:255",
            "firstname_eng" => "required|string|max:255",
            "lastname_eng" => "required|string|max:255",
            "citizenid_card" => "required|string|max:255|exists:students,citizenid_card",
            "birthdate" => "nullable|date",
            "date_register_from_form" => "nullable|date",
            "birth_province_id" => "required|exists:provinces,id",
            "father_lname" => "required|string|max:255",
            "mother_fname" => "required|string|max:255",
            "mother_lname" => "required|string|max:255",
            "marital_id" => "required|exists:marital_statuses,id",
            "address_number" => "nullable|string|max:255",
            "address_moo" => "nullable|string|max:255",
            "address_road" => "nullable|string|max:255",
            "address_subdistrict_id" => "required|exists:subdistricts,id",
            "address_zip_code" => "required|string|max:255",
            "phonenumber" => "required|string|max:255",
            "email" => "required|string|max:255|email|exists:students,email",
            "occupation_id" => "required|exists:occupations,id",
            "medical_condition_id" => "nullable|exists:medical_conditions,id",
            "surgery_history" => "nullable|string|max:60",
            "learn_massage" => "required|integer|min:0|max:1",
            "learn_massage_description" => "nullable|string|max:70",
            "work_massage" => "required|integer|min:0|max:1",
            "work_massage_description" => "nullable|string|max:70",
            "course_training" => "nullable|array",
            "edu_qual_id" => "required|exists:education_quals,id",
            "edu_ins" => "nullable|string|max:60",
            "profile_image" => "nullable|image|mimes:jpeg,png,jpg|max:10240",
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'prename_id' => $this->prename_tha,
            'birth_province_id' => $this->birth_province,
            'address_subdistrict_id' => $this->address_sub_district,
            'address_number' => $this->address_num,
            'marital_id' => $this->marital_status,
            'occupation_id' => $this->occupation_student,
            'phonenumber' => $this->phone_number,
            'learn_massage' => $this->learn_massage === 'ไม่เคยนวด/เรียน' ? 0 : 1,
            'learn_massage_description' => $this->learn_massage_description === null || $this->learn_massage_description === 'null' ? null : $this->learn_massage_description,
            'work_massage' => $this->work_massage === 'ไม่เคยทำงานเกี่ยวข้องกับการนวดไทย' ? 0 : 1,
            'work_massage_description' => $this->work_massage_description === null || $this->work_massage_description === 'null' ? null : $this->work_massage_description,
            'medical_condition_id' => $this->medical_condition === null || $this->medical_condition === 'null' ? null : $this->medical_condition,
            'surgery_history' => $this->surgery_history === null || $this->surgery_history === 'null' ? null : $this->surgery_history,
            'edu_qual_id' => $this->edu_qual,
            'birthdate' => \Carbon\Carbon::createFromFormat('d/m/Y', $this->birthdate)->format('Y-m-d'),
            'date_register_from_form' => \Carbon\Carbon::createFromFormat('d/m/Y', $this->date_register_from_form)->format('Y-m-d'),
        ]);
    }

    public function messages()
    {
        return [
            'birthdate.date_format' => 'กรุณากรอกวันที่วันเกิดให้อยู่ในรูปแบบ วัน/เดือน/ปี',
            'date_register_from_form.date_format' => 'กรุณากรอกวันที่สมัครจากใบสมัครนักเรียนให้อยู่ในรูปแบบ วัน/เดือน/ปี',
            'citizenid_card.unique' => 'รหัสประจำตัวประชาชนนี้มีอยู่ในระบบแล้ว',
            'email.unique' => 'อีเมลนี้มีอยู่ในระบบแล้ว',
        ];
    }
}
