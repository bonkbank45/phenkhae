<?php

namespace App\Http\Controllers;

use App\Traits\JsonResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\CourseCompletion;
use App\Services\GraduateService;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Enrollment;
class CourseCompletionController extends Controller
{
    use JsonResponseTrait;
    public function __construct(private GraduateService $graduateService)
    {
        $this->graduateService = $graduateService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'course_group_id' => 'required|integer',
            'student_id' => 'required|integer',
            'completion_date' => 'required|date_format:d/m/Y',
        ]);
        try {
            DB::beginTransaction();
            $graduateStatement = $this->graduateService->prepareGraduationStatement(
                $validatedData['course_group_id'],
                $validatedData['student_id'],
                $validatedData['completion_date']
            );
            $courseCompletion = CourseCompletion::create($graduateStatement);
            Enrollment::where('course_group_id', $validatedData['course_group_id'])
                ->where('student_id', $validatedData['student_id'])
                ->update(['date_end' => Carbon::createFromFormat('d/m/Y', $validatedData['completion_date'])->format('Y-m-d')]);
            DB::commit();
            return $this->successResponse('Graduation statement prepared successfully', $courseCompletion);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseCompletionController $courseCompletionController)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CourseCompletionController $courseCompletionController)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CourseCompletionController $courseCompletionController)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseCompletionController $courseCompletionController)
    {
        //
    }

    public function getCourseCompletionTable(Request $request): JsonResponse
    {
        $query = CourseCompletion::with(
            'course_group',
            'course_group.course',
            'student'
        );

        if ($request->course_filter && $request->course_filter !== 'all') {
            $query->courseFilter($request->course_filter);
            if ($request->batch_filter && $request->batch_filter !== 'all') {
                $query->batchFilter($request->batch_filter);
            }
        } else {
            $query->availableLicense($request->available_license);
        }

        $courseCompletion = $query->paginate(10);
        return $this->successResponse($courseCompletion, 'Course completion retrieved successfully', 200);
    }

    public function getUnqualifiedCompletions(Request $request): JsonResponse
    {
        $unqualifiedStudents = CourseCompletion::getUnqualifiedCompletions(
            $request->course_filter,
            $request->batch_filter,
            $request->available_license,
            $request->search_term
        )
            ->paginate(10)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'student_id' => $item->student_id,
                    'course_group_id' => $item->course_group_id,
                    'date_start' => $item->date_start,
                    'date_end' => $item->date_end,
                    'completion_date' => $item->completion_date,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                    'course_group' => [
                        'id' => $item->course_group_id,
                        'course_id' => $item->course_id,
                        'max_students' => $item->max_students,
                        'batch' => $item->batch,
                        'theoretical_score_criteria' => $item->theoretical_score_criteria,
                        'practical_score_criteria' => $item->practical_score_criteria,
                        'date_start' => $item->date_start,
                        'date_end' => $item->date_end,
                        'created_at' => $item->created_at,
                        'updated_at' => $item->updated_at,
                        'course' => [
                            'id' => $item->course_id,
                            'course_category_id' => $item->course_category_id,
                            'course_category_bill_id' => $item->course_category_bill_id,
                            'course_name' => $item->course_name,
                            'course_description' => $item->course_description,
                            'created_at' => $item->course_created_at,
                            'updated_at' => $item->course_updated_at,
                        ]
                    ],
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
                        'updated_at' => $item->updated_at,
                    ]
                ];
            });

        return $this->successResponse($unqualifiedStudents, 'Unlicensed completions retrieved successfully', 200);
    }
}
