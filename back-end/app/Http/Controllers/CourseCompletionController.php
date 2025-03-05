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
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Mpdf\Mpdf;
use Illuminate\Http\Response;
use App\Http\Requests\UpdateCourseCompletionController;
use Exception;

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
    public function update(UpdateCourseCompletionController $request, $courseCompletionId)
    {
        \Log::info($request->all());
        try {
            DB::beginTransaction();
            $courseCompletion = CourseCompletion::findOrFail($courseCompletionId);
            $courseCompletion->update($request->validated());
            DB::commit();
            return $this->successResponse('Course completion updated successfully', $courseCompletion);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course completion not found', 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($courseCompletionId)
    {
        try {
            $courseCompletion = CourseCompletion::findOrFail($courseCompletionId);
            $courseCompletion->delete();

            return $this->successResponse(null, 'Course completion deleted successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Course completion not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
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
        }
        if ($request->search_term) {
            $query->searchTerm($request->search_term);
        }
        if ($request->date_search_start) {
            $query->dateSearchStart($request->date_search_start);
        }
        if ($request->date_search_end) {
            $query->dateSearchEnd($request->date_search_end);
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

    public function getCertificateStatistic(): JsonResponse
    {
        $allCourse = DB::table('courses')
            ->pluck('course_name')
            ->mapWithKeys(function ($courseName) {
                return [$courseName => 0];
            })
            ->toArray();

        $certificateStatistic = CourseCompletion::select(
            DB::raw('YEAR(completion_date) as year'),
            'course_group_id',
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('year', 'course_group_id')
            ->get()
            ->reduce(function ($result, $item) use ($allCourse) {
                if (!isset($result[$item->year])) {
                    $result[$item->year] = [
                        'year' => $item->year,
                        'courses' => $allCourse
                    ];
                }

                $result[$item->year]['courses'][$item->course_group->course->course_name] = $item->count;

                return $result;
            }, []);

        $certificateStatistic = array_values($certificateStatistic);

        return $this->successResponse($certificateStatistic, 'Certificate statistic retrieved successfully', 200);
    }

    public function getCourseCompletedStatistic(): JsonResponse
    {
        $rawData = DB::table('course_completions')
            ->join('course_groups', 'course_completions.course_group_id', '=', 'course_groups.id')
            ->join('courses', 'course_groups.course_id', '=', 'courses.id')
            ->join('students', 'course_completions.student_id', '=', 'students.id')
            ->select(
                DB::raw('YEAR(course_groups.date_start) as year'),
                'courses.course_name',
                'course_groups.batch',
                DB::raw('COUNT(CASE WHEN students.gender = 1 THEN 1 END) as male'),
                DB::raw('COUNT(CASE WHEN students.gender = 2 THEN 1 END) as female')
            )
            ->groupBy('year', 'course_groups.id', 'courses.course_name', 'course_groups.batch')
            ->orderBy('year')
            ->get();

        $formattedData = $rawData->groupBy('year')
            ->map(function ($yearGroup) {
                return [
                    'year' => $yearGroup->first()->year,
                    'courses' => $yearGroup->groupBy('course_name')
                        ->map(function ($courseGroup) {
                            return $courseGroup->map(function ($item) {
                                return [
                                    'batch' => $item->batch,
                                    'male' => $item->male,
                                    'female' => $item->female
                                ];
                            });
                        })
                ];
            })->values()->all();

        return $this->successResponse($formattedData, 'Course completion statistics retrieved successfully', 200);
    }

    public function getCourseCompletedAndTakeCertificateStatistic(): JsonResponse
    {
        $rawData = DB::table('course_completions')
            ->join('course_groups', 'course_completions.course_group_id', '=', 'course_groups.id')
            ->join('courses', 'course_groups.course_id', '=', 'courses.id')
            ->join('students', 'course_completions.student_id', '=', 'students.id')
            ->select(
                DB::raw('YEAR(course_groups.date_start) as year'),
                'courses.course_name',
                'course_groups.batch',
                DB::raw('COUNT(CASE WHEN students.gender = 1 THEN 1 END) as male'),
                DB::raw('COUNT(CASE WHEN students.gender = 2 THEN 1 END) as female'),
                'course_completions.certificate_date'
            )
            ->where('course_completions.certificate_status', 1)
            ->groupBy('year', 'course_groups.id', 'certificate_date')
            ->orderBy('year')
            ->get();

        $formattedData = $rawData->groupBy('year')
            ->map(function ($yearGroup) {
                return [
                    'year' => $yearGroup->first()->year,
                    'courses' => $yearGroup->groupBy('course_name')
                        ->map(function ($courseGroup) {
                            return $courseGroup->map(function ($item) {
                                return [
                                    'batch' => $item->batch,
                                    'male' => $item->male,
                                    'female' => $item->female,
                                    'certificate_date' => $item->certificate_date
                                ];
                            });
                        })
                ];
            })->values()->all();

        return $this->successResponse($formattedData, 'Course completion and certificate statistics retrieved successfully', 200);
    }

    public function generatePdfStudentCertificate(Request $request, $courseCompletionId): JsonResponse|Response
    {
        try {
            $courseCompletion = CourseCompletion::with('course_group', 'student')
                ->findOrFail($courseCompletionId);

            $mpdf = new Mpdf(config('pdf'));
            $mpdf->AddPageByArray([
                'orientation' => 'L',
                'margin-left' => 8.3,
                'margin-right' => 8.3,
                'margin-top' => 8.3,
                'margin-bottom' => 8.3
            ]);

            switch ($courseCompletion->course_group->course->id) {
                case 1:
                    $html = view('pdfs.certificate.certificate1', [
                        'courseCompletion' => $courseCompletion
                    ])->render();
                    break;
                case 2:
                    $html = view('pdfs.certificate.certificate2', [
                        'courseCompletion' => $courseCompletion
                    ])->render();
                    break;
                case 3:
                    $html = view('pdfs.certificate.certificate3', [
                        'courseCompletion' => $courseCompletion
                    ])->render();
                    break;
                case 4:
                    $html = view('pdfs.certificate.certificate4', [
                        'courseCompletion' => $courseCompletion
                    ])->render();
                    break;
                case 5:
                    $html = view('pdfs.certificate.certificate5', [
                        'courseCompletion' => $courseCompletion
                    ])->render();
                    break;
                case 6:
                    $html = view('pdfs.certificate.certificate6', [
                        'courseCompletion' => $courseCompletion
                    ])->render();
                    break;
                case 7:
                    $html = view('pdfs.certificate.certificate7', [
                        'courseCompletion' => $courseCompletion
                    ])->render();
                    break;
                case 8:
                    $html = view('pdfs.certificate.certificate8', [
                        'courseCompletion' => $courseCompletion
                    ])->render();
                    break;
                case 9:
                    $html = view('pdfs.certificate.certificate9', [
                        'courseCompletion' => $courseCompletion
                    ])->render();
                    break;
                case 10:
                    $html = view('pdfs.certificate.certificate10', [
                        'courseCompletion' => $courseCompletion
                    ])->render();
                    break;
                default:
                    return $this->errorResponse('Invalid course Id', 400);
            }
            $mpdf->WriteHTML($html);
            return response($mpdf->Output('certificate_' . $courseCompletion->course_group->course->id . '.pdf', 'S'), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="certificate_' . rawurlencode($courseCompletion->student->firstname_tha . '_' . $courseCompletion->student->lastname_tha) . '.pdf"',
            ]);

        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Course completion not found', 404);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function generatePdfStudentCompletion(Request $request)
    {
        try {
            $studentCompletion = CourseCompletion::select(
                'course_completions.completion_date',
                'enrollments.no_reg',
                'course_groups.date_start',
                'prenames.prename_tha',
                'students.firstname_tha',
                'students.lastname_tha',
                'students.citizenid_card',
                'course_groups.course_id'
            )
                ->join('enrollments', function ($join) {
                    $join->on('course_completions.student_id', '=', 'enrollments.student_id')
                        ->on('course_completions.course_group_id', '=', 'enrollments.course_group_id');
                })
                ->join('course_groups', 'enrollments.course_group_id', '=', 'course_groups.id')
                ->join('courses', 'course_groups.course_id', '=', 'courses.id')
                ->join('students', 'enrollments.student_id', '=', 'students.id')
                ->join('prenames', 'students.prename_id', '=', 'prenames.id')
                ->whereIn('course_completions.id', $request->student_completion_ids)
                ->get()->values();


            $mpdf = new Mpdf(config('pdf'));
            $mpdf->AddPage('L');

            $studentCompletionData = $studentCompletion->map(function ($item, $index) {
                return [
                    'q' => $index + 1,
                    'idstd' => "-",
                    'id' => $item->citizenid_card,
                    'prename' => $item->prename_tha,
                    'fname' => $item->firstname_tha,
                    'lname' => $item->lastname_tha,
                    'congrat' => Carbon::parse($item->completion_date)->format('d/m/') . (Carbon::parse($item->completion_date)->format('Y') + 543),
                    'course_id' => $item->course_id,
                ];
            })->values()->all();

            $html = view('pdfs.name_congrat', [
                'students' => $studentCompletionData,
            ])->render();

            $mpdf->WriteHTML($html);
            return response($mpdf->Output('student_completion.pdf', 'S'), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="student_completion.pdf"',
            ]);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
