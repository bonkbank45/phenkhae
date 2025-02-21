<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use App\Traits\JsonResponseTrait;
use Illuminate\Support\Facades\DB;
use App\Models\CourseGroup;
use App\Models\Enrollment;
use App\Http\Requests\StoreCourseGroupRequest;
use App\Http\Requests\UpdateCourseGroupRequest;
use App\Services\EnrollmentService;
use Illuminate\Http\Request;
use Mpdf\Mpdf;
use App\Models\CourseAttendence;
use Carbon\Carbon;

class CourseGroupController extends Controller
{
    use JsonResponseTrait;
    protected $enrollmentService;

    public function __construct(EnrollmentService $enrollmentService)
    {
        $this->enrollmentService = $enrollmentService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        // $coures_groups = CourseGroup::all();
        // return $this->successResponse($coures_groups, 'Course groups fetched successfully', 200);
        $course_groups = CourseGroup::with([
            'course',
            'course.course_category' => function ($query) {
                $query->select('id', 'category_name');
            },
            'course.course_category_bill' => function ($query) {
                $query->select('id', 'category_bill_name');
            },
            'course.latest_course_price',
        ])
            ->paginate(10);
        return $this->successResponse($course_groups, 'Course groups fetched successfully', 200);
    }

    public function table(Request $request)
    {
        $course_groups = CourseGroup::with([
            'course',
            'course.course_category' => function ($query) {
                $query->select('id', 'category_name');
            },
            'course.course_category_bill' => function ($query) {
                $query->select('id', 'category_bill_name');
            },
            'course.latest_course_price',
            'enrollments'
        ])
            ->withCount('enrollments as students_enrolled')
            ->orderBy('date_start', 'desc')
            ->search($request->search)
            ->filterByStatus($request->status)
            ->filterByCourse($request->course_id)
            ->paginate(9);

        return $this->successResponse($course_groups, 'Course groups fetched successfully', 200);
    }

    public function getCourseGroupByCourseId(int $courseId): JsonResponse
    {
        $course_groups = CourseGroup::where('course_id', $courseId)->get();
        return $this->successResponse($course_groups, 'Course groups by course id fetched successfully', 200);
    }

    public function getCourseGroupByCourseIds(Request $request): JsonResponse
    {
        $courseIds = explode(',', $request->input('course_ids'));
        $course_groups = CourseGroup::whereIn('course_id', $courseIds)
            ->get()
            ->groupBy('course_id');
        return $this->successResponse($course_groups, 'Course groups by courses id fetched successfully', 200);
    }

    public function available(): JsonResponse
    {
        $course_groups = CourseGroup::where(
            'date_end',
            '>=',
            date('Y-m-d H:i:s')
        )
            ->with('course')
            ->withCount('enrollments as students_enrolled')
            ->get()
            ->groupBy(function ($course_group) {
                return $course_group->course->course_category->category_name;
            });
        // ->map(function ($grouped_course_groups) {
        //     return $grouped_course_groups->map(function ($course_group) {
        //         return [
        //             'course_name' => $course_group->course->course_name,
        //             'course_batch' => $course_group->batch,
        //             'max_students' => $course_group->max_students,
        //             'students_enrolled' => $course_group->enrollments->count(),
        //         ];
        //     });
        // });
        return $this->successResponse($course_groups, 'Course data categories retrieved successfully', 200);
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
    public function store(StoreCourseGroupRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course_group = CourseGroup::create([
                'batch' => $request->batch,
                'max_students' => $request->max_students,
                'date_start' => $request->date_start,
                'date_end' => $request->date_end,
                'course_id' => $request->course_id,
                'theoretical_score_criteria' => 60,
                'practical_score_criteria' => 80,
            ]);
            DB::commit();
            return $this->successResponse($course_group, 'Course group created successfully', 201);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course group and price creation failed' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $course_group = CourseGroup::with([
                'course',
                'course.course_category' => function ($query) {
                    $query->select('id', 'category_name');
                },
                'course.course_category_bill' => function ($query) {
                    $query->select('id', 'category_bill_name');
                },
                'course.latest_course_price',
                'enrollments',
                'enrollments.student',
                'enrollments.student.prename',
                'enrollments.student.bill_infos'
            ])->findOrFail($id);
            $course_group->students_enrolled = $course_group->enrollments->count();
            return $this->successResponse($course_group, 'Course group fetched successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Course group not found', 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseGroupRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course_group = CourseGroup::findOrFail($id);
            $course_group->update($request->all());
            $course_group->refresh();

            Enrollment::where('course_group_id', $id)->update([
                'date_start' => $course_group->date_start,
            ]);
            DB::commit();
            return $this->successResponse($course_group, 'Course group updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course group not found', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course_group = CourseGroup::findOrFail($id);
            $course_group->delete();
            DB::commit();
            return $this->successResponse('Course group deleted successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course group not found', 404);
        }
    }

    public function getAllCourseBatchNumberByCourseId(int $courseId): JsonResponse
    {
        try {
            $batches = CourseGroup::where('course_id', $courseId)
                ->orderBy('batch')
                ->pluck('batch')
                ->unique()
                ->values()
                ->toArray();

            $response_data = [
                'batch' => $batches
            ];
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Course group not found', 404);
        }

        return $this->successResponse($response_data, 'Course batch number fetched successfully', 200);
    }

    public function updateScoreCriteria(Request $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course_group = CourseGroup::findOrFail($id);
            $course_group->update([
                'theoretical_score_criteria' => $request->theory_cri,
                'practical_score_criteria' => $request->practical_cri,
            ]);

            DB::commit();
            return $this->successResponse($course_group, 'Course group updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course group not found', 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update score criteria: ' . $e->getMessage(), 500);
        }
    }

    public function resetScoreCriteria(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course_group = CourseGroup::findOrFail($id);
            $course_group->update([
                'theoretical_score_criteria' => 60,
                'practical_score_criteria' => 80,
            ]);
            DB::commit();
            return $this->successResponse($course_group, 'Course group updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course group not found', 404);
        }
    }

    public function generateStudentCardPdf(int $id)
    {
        try {
            $course_group = CourseGroup::findOrFail($id);
            $mpdf = new Mpdf(config('pdf'));
            $mpdf->AddPage('L');

            $students = $course_group->enrollments->map(function ($enrollment) use ($course_group) {
                return (object) [
                    'name' => $enrollment->student->firstname_tha . ' ' . $enrollment->student->lastname_tha,
                    'course' => $course_group->course->course_name,
                    'batch' => $course_group->batch,
                    'student_id' => $enrollment->student->id,
                ];
            })->values()->all();

            $html = view('pdfs.std_card', [
                'students' => $students,
            ])->render();

            $mpdf->WriteHTML($html);
            return response($mpdf->Output('student-card.pdf', 'S'), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="student-card-' . $course_group->batch . '.pdf"',
            ]);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    public function generateEmptyStudentListPdf(int $id, int $attendence_id)
    {
        try {
            $course_group = CourseGroup::findOrFail($id);
            $attendence = CourseAttendence::findOrFail($attendence_id);
            $mpdf = new Mpdf(config('pdf'));

            $html = view('pdfs.check_name_v2', [
                'course_group' => $course_group,
                'attendence' => $attendence
            ])->render();

            $mpdf->WriteHTML($html);

            $pdfContent = $mpdf->Output('student-list.pdf', 'S');

            return response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="student-empty-list-'
                    . $course_group->batch . '-' . $attendence->attendence_date . '.pdf"',
            ]);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to generate PDF: ' . $e->getMessage(), 500);
        }
    }

    public function generateStudentListPdf(int $id, int $attendence_id)
    {
        try {
            $course_group = CourseGroup::with(
                'course',
                'enrollments.student'
            )->findOrFail($id);

            $attendence = CourseAttendence::findOrFail($attendence_id);

            $attendence_date = Carbon::createFromFormat('Y-m-d', $attendence->attendence_date)->format('d/m/Y');

            $mpdf = new Mpdf(config('pdf'));

            $html = view('pdfs.check_name', [
                'course_group' => $course_group,
                'enrollments' => $course_group->enrollments,
                'attendence_date' => $attendence_date
            ])->render();

            $mpdf->WriteHTML($html);

            $pdfContent = $mpdf->Output('student-list.pdf', 'S');

            return response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="student-list-'
                    . $course_group->batch . '-' . $attendence_date . '.pdf"',
            ]);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to generate PDF: ' . $e->getMessage(), 500);
        }
    }

    public function getCourseGroupStatistics(): JsonResponse
    {
        try {
            $statistics = CourseGroup::select([
                'course_groups.id',
                'course_groups.date_start',
                'course_groups.batch',
                'courses.course_name',
                DB::raw('COUNT(CASE WHEN students.gender = 1 THEN 1 END) as male'),
                DB::raw('COUNT(CASE WHEN students.gender = 2 THEN 1 END) as female')
            ])
                ->join('courses', 'course_groups.course_id', '=', 'courses.id')
                ->join('enrollments', 'course_groups.id', '=', 'enrollments.course_group_id')
                ->join('students', 'enrollments.student_id', '=', 'students.id')
                ->groupBy('course_groups.id')
                ->get()
                ->groupBy(function ($item) {
                    return Carbon::parse($item->date_start)->year;
                })
                ->map(function ($yearGroups) {
                    return [
                        'year' => (int) Carbon::parse($yearGroups->first()->date_start)->year,
                        'courses' => $yearGroups->groupBy('course_name')
                            ->map(function ($courseGroups) {
                                return $courseGroups->map(function ($group) {
                                    return [
                                        'batch' => $group->batch,
                                        'male' => (int) $group->male,
                                        'female' => (int) $group->female
                                    ];
                                });
                            })
                    ];
                })
                ->values();

            return $this->successResponse($statistics, 'Course group statistics fetched successfully', 200);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch statistics: ' . $e->getMessage(), 500);
        }
    }
}
