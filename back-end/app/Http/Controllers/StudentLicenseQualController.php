<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Models\StudentLicenseQual;
use Illuminate\Http\Request;
use App\Traits\JsonResponseTrait;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreStudentLicenseQualRequest;
use App\Http\Requests\UpdateStudentLicenseQualRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StudentLicenseQualController extends Controller
{
    use JsonResponseTrait;
    public function index(): JsonResponse
    {
        $studentLicenseQuals = StudentLicenseQual::all();
        return $this->successResponse($studentLicenseQuals);
    }
    public function show(int $id): JsonResponse
    {
        try {
            $studentLicenseQual = StudentLicenseQual::with('student', 'course')->findOrFail($id);
            return $this->successResponse($studentLicenseQual);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
    public function store(StoreStudentLicenseQualRequest $request): JsonResponse
    {
        $studentLicenseQual = StudentLicenseQual::create($request->all());
        return $this->successResponse($studentLicenseQual);
    }
    public function update(UpdateStudentLicenseQualRequest $request, int $id): JsonResponse
    {
        try {
            $studentLicenseQual = StudentLicenseQual::findOrFail($id);
            $studentLicenseQual->update($request->all());
            return $this->successResponse($studentLicenseQual);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
    public function destroy(int $id): JsonResponse
    {
        try {
            $studentLicenseQual = StudentLicenseQual::findOrFail($id);
            $studentLicenseQual->delete();
            return $this->successResponse(null, 'Student license qual deleted successfully');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    public function table(Request $request): JsonResponse
    {
        $studentLicenseQuals = StudentLicenseQual::withFullDetails()
            ->when($request->has('course_id'), function ($query) use ($request) {
                return $query->byCourse($request->course_id);
            })
            ->when($request->has('license_status'), function ($query) use ($request) {
                return $query->byLicenseStatus($request->license_status);
            })
            ->when($request->has('search'), function ($query) use ($request) {
                return $query->search($request->search);
            })
            ->when($request->has('date_search_start'), function ($query) use ($request) {
                return $query->dateSearchStart($request->date_search_start);
            })
            ->when($request->has('date_search_end'), function ($query) use ($request) {
                return $query->dateSearchEnd($request->date_search_end);
            })
            ->paginate(10);

        return $this->successResponse($studentLicenseQuals, 'Student license quals fetched successfully', 200);
    }

    public function bulkStore(Request $request): JsonResponse
    {
        $dateQualified = Carbon::createFromFormat('d/m/Y', $request->input('date_qualified'))
            ->format('Y-m-d');
        $students = $request->input('students');

        $createdRecords = collect($students)->map(function ($student) use ($dateQualified) {
            return StudentLicenseQual::create([
                'student_id' => $student['student_id'],
                'course_id' => $student['course_id'],
                'date_qualified' => $dateQualified
            ]);
        });

        return $this->successResponse($createdRecords);
    }

    public function getUnlicensedStudents(Request $request): JsonResponse
    {
        $unlicensedStudents = StudentLicenseQual::getUnlicensedStudents($request->course_id)
            ->paginate(10)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'student_id' => $item->student_id,
                    'course_id' => $item->course_id,
                    'date_qualified' => $item->date_qualified,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                    'student' => [
                        'id' => $item->student_id,
                        'prename_id' => $item->prename_id,
                        'firstname_tha' => $item->firstname_tha,
                        'lastname_tha' => $item->lastname_tha,
                        'firstname_eng' => $item->firstname_eng,
                        'lastname_eng' => $item->lastname_eng,
                        'citizenid_card' => $item->citizenid_card,
                        'birthdate' => $item->birthdate,
                        'birth_province_id' => $item->birth_province_id,
                        'father_fname' => $item->father_fname,
                        'father_lname' => $item->father_lname,
                        'mother_fname' => $item->mother_fname,
                        'mother_lname' => $item->mother_lname,
                        'marital_id' => $item->marital_id,
                        'address_num' => $item->address_num,
                        'address_moo' => $item->address_moo,
                        'address_soi' => $item->address_soi,
                        'address_road' => $item->address_road,
                        'address_subdistrict_id' => $item->address_subdistrict_id,
                        'address_zip_code' => $item->address_zip_code,
                        'phonenumber' => $item->phonenumber,
                        'email' => $item->email,
                        'occupation_id' => $item->occupation_id,
                        'medical_condition_id' => $item->medical_condition_id,
                        'surgery_history' => $item->surgery_history,
                        'edu_qual_id' => $item->edu_qual_id,
                        'edu_ins' => $item->edu_ins,
                        'learn_massage' => $item->learn_massage,
                        'learn_massage_description' => $item->learn_massage_description,
                        'work_massage' => $item->work_massage,
                        'work_massage_description' => $item->work_massage_description,
                        'profile_image' => $item->profile_image,
                        'date_register_from_form' => $item->date_register_from_form,
                        'created_at' => $item->created_at,
                        'updated_at' => $item->updated_at
                    ],
                    'course' => [
                        'id' => $item->course_id,
                        'course_category_id' => $item->course_category_id,
                        'course_category_bill_id' => $item->course_category_bill_id,
                        'course_name' => $item->course_name,
                        'course_description' => $item->course_description,
                        'created_at' => $item->course_created_at,
                        'updated_at' => $item->course_updated_at
                    ]
                ];
            });

        return $this->successResponse($unlicensedStudents, 'Unqualified students retrieved successfully', 200);
    }
}
