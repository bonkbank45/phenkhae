<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use App\Traits\JsonResponseTrait;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreEnrollmentRequest;
use App\Http\Requests\UpdateEnrollmentRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Services\EnrollmentService;
use App\Models\Student;
class EnrollmentController extends Controller
{
    use JsonResponseTrait;
    /**
     * Display a listing of the resource.
     */

    public function __construct(private EnrollmentService $enrollmentService)
    {
        $this->enrollmentService = $enrollmentService;
    }
    public function index(): JsonResponse
    {
        $enrollments = Enrollment::all();
        return $this->successResponse($enrollments, 'Enrollments retrieved successfully', 200);
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
    public function store(StoreEnrollmentRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $enrollments = $this->enrollmentService
                ->storeEnrollment($request->course_group_id, $request->student_ids);
            Enrollment::insert($enrollments);
            DB::commit();
            return $this->successResponse($enrollments, 'Enrollments created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Enrollment failed ' . $e->getMessage(), 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        try {
            $enrollment = Enrollment::findOrFail($id);
            return $this->successResponse($enrollment, 'Enrollment retrieved successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Enrollment not found', 404);
        }
    }

    public function getEnrollmentStudentStatusByCourseGroupId(int $courseGroupId): JsonResponse
    {
        try {
            $enrollment = Enrollment::where('course_group_id', $courseGroupId)
                ->with('student', 'course_group', 'course_group.course')
                ->paginate(10);
            return $this->successResponse($enrollment, 'Enrollment retrieved successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Enrollment not found', 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Enrollment $enrollment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEnrollmentRequest $request, int $courseGroupId, int $studentId): JsonResponse
    {
        DB::beginTransaction();
        try {
            $enrollment = Enrollment::where('course_group_id', $courseGroupId)
                ->where('student_id', $studentId)
                ->firstOrFail();

            Enrollment::where('course_group_id', $courseGroupId)
                ->where('student_id', $studentId)
                ->update($request->all());

            $enrollment = Enrollment::where('course_group_id', $courseGroupId)
                ->where('student_id', $studentId)
                ->first();

            DB::commit();
            return $this->successResponse($enrollment, 'Enrollment updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Enrollment not found', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, int $courseGroupId): JsonResponse
    {
        $studentIds = $request->input('student_ids');
        DB::beginTransaction();
        try {
            \Log::info('Hello from controller !');
            $enrollments = $this->enrollmentService->removeEnrollment($courseGroupId, $studentIds);
            $enrollments->delete();
            DB::commit();
            return $this->successResponse($enrollments, 'Enrollments removed successfully', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Destroy Enrollment failed ' . $e->getMessage(), 400);
        }
    }

    public function getEnrolledStudentsByBatchId(int $courseBatchId, Request $request): JsonResponse
    {
        $query = Enrollment::where('course_group_id', $courseBatchId)
            ->join('students', 'enrollments.student_id', '=', 'students.id')
            ->select('students.*', 'enrollments.enrollment_date', 'enrollments.activity_case_status')
            // ->orderBy('enrollments.created_at', 'desc')
            ->orderBy('enrollments.student_id', 'asc');

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->search($searchTerm);
        }

        if ($request->has('age_range')) {
            $query->filterAgeRange($request->age_range);
        }

        if ($request->has('experience')) {
            $query->filterExperience($request->experience);
        }

        if ($request->has('education')) {
            $query->filterEducation($request->education);
        }

        if ($request->has('recently_added')) {
            $query->filterRecentlyAdded($request->recently_added);
        }

        return $this->successResponse($query->paginate(10), 'Enrollments retrieved successfully', 200);
    }

    public function getEnrolledStudentsByBatchIds(Request $request): JsonResponse
    {
        $query = DB::table('course_groups')
            ->select(
                'course_groups.id as course_group_id',
                'students.id as student_id',
                'students.firstname_tha',
                'students.lastname_tha',
                'courses.course_name',
                'course_groups.batch',
                'course_groups.date_start as batch_start',
                'course_groups.date_end as batch_end',
                'enrollments.date_start as student_date_start',
                'enrollments.date_end as student_date_end'
            )
            ->join('courses', 'courses.id', '=', 'course_groups.course_id')
            ->join('enrollments', 'course_groups.id', '=', 'enrollments.course_group_id')
            ->join('students', 'enrollments.student_id', '=', 'students.id');


        if ($request->has('fetch_all')) {

        } else {
            $validated = $request->validate([
                'batch_ids' => ['required', 'string', 'regex:/^\d+(,\d+)*$/']  // ตรวจสอบรูปแบบ "1,2,3"
            ]);
            $batchIds = explode(',', string: $validated['batch_ids']);
            $query->whereIn('course_groups.id', $batchIds);
        }

        if ($request->has('no_pagination') && $request->no_pagination == 'true') {
            $students = $query->get();
        } else {
            $students = $query->paginate(10);
        }

        return $this->successResponse($students, 'Enrolled students retrieved successfully', 200);
    }

    public function getEnrollmentStatusGraduateByBatchId(int $courseGroupId): JsonResponse
    {
        $enrollmentStatusGraduate = DB::table('enrollments as en')
            ->join('students', 'en.student_id', '=', 'students.id')
            ->join('course_groups', 'en.course_group_id', '=', 'course_groups.id')
            ->join('courses', 'course_groups.course_id', '=', 'courses.id')
            ->join('course_prices', function ($join) {
                $join->on('courses.id', '=', 'course_prices.course_id')
                    ->whereColumn('course_prices.id', '=', 'en.course_price_id');
            })
            ->join('course_category_bills', 'courses.course_category_bill_id', '=', 'course_category_bills.id')
            ->leftJoin('course_completions', function ($join) {
                $join->on('en.student_id', '=', 'course_completions.student_id')
                    ->whereColumn('en.course_group_id', '=', 'course_completions.course_group_id');
            })
            ->leftJoin('bill_infos', function ($join) {
                $join->on('en.student_id', '=', 'bill_infos.student_id')
                    ->whereColumn('en.course_group_id', '=', 'bill_infos.course_group_id');
            })
            ->leftJoin('course_attendences as ca', 'en.course_group_id', '=', 'ca.course_group_id')
            ->leftJoin('student_attendences as sa', function ($join) {
                $join->on('ca.id', '=', 'sa.course_attendence_id')
                    ->whereColumn('en.student_id', '=', 'sa.student_id');
            })
            ->select(
                'courses.id as course_id',
                'courses.course_name',
                'course_category_bills.id as course_category_bill_id',
                'course_category_bills.category_bill_name as course_category_bill_name',
                'en.course_group_id',
                'course_groups.batch',
                'course_groups.theoretical_score_criteria as course_group_theoretical_score_criteria',
                'course_groups.practical_score_criteria as course_group_practical_score_criteria',
                'course_groups.date_start as course_group_date_start',
                'course_groups.date_end as course_group_date_end',
                'en.student_id',
                'students.firstname_tha',
                'students.lastname_tha',
                'en.activity_case_status',
                'en.theoretical_score',
                'en.practical_score',
                'en.enrollment_date',
                'en.date_start as enrollment_date_start',
                'en.date_end as enrollment_date_end',
                'en.created_at as enrollments_created_at',
                'en.updated_at as enrollments_updated_at',
                'bill_infos.vol as bill_infos_vol',
                'bill_infos.no as bill_infos_no',
                'bill_infos.date_submit',
                'bill_infos.created_at as bill_infos_create_at',
                'bill_infos.updated_at as bill_infos_updated_at',
                'course_prices.price as course_price',
                DB::raw('COUNT(ca.id) as total_classes'),
                DB::raw('SUM(CASE WHEN COALESCE(sa.status, 0) = 1 THEN 1 ELSE 0 END) as present_count'),
                DB::raw('SUM(CASE WHEN COALESCE(sa.status, 0) = 0 THEN 1 ELSE 0 END) as absent_count'),
                'course_completions.id as course_completion_id',
                'course_completions.date_start as course_completion_date_start',
                'course_completions.date_end as course_completion_date_end',
                'course_completions.completion_date as course_completion_completed_date'
            )
            ->where('en.course_group_id', $courseGroupId)
            ->groupBy(
                'courses.id',
                'courses.course_name',
                'course_category_bills.id',
                'course_category_bills.category_bill_name',
                'en.course_group_id',
                'course_groups.batch',
                'course_groups.theoretical_score_criteria',
                'course_groups.practical_score_criteria',
                'course_groups.date_start',
                'course_groups.date_end',
                'en.student_id',
                'students.firstname_tha',
                'students.lastname_tha',
                'en.activity_case_status',
                'en.theoretical_score',
                'en.practical_score',
                'en.enrollment_date',
                'en.date_start',
                'en.date_end',
                'en.created_at',
                'en.updated_at',
                'bill_infos.vol',
                'bill_infos.no',
                'bill_infos.date_submit',
                'bill_infos.created_at',
                'bill_infos.updated_at',
                'course_prices.price',
                'course_completions.id',
                'course_completions.student_id',
                'course_completions.course_group_id',
                'course_completions.date_start',
                'course_completions.date_end',
                'course_completions.completion_date'
            )
            ->orderBy('en.student_id', 'asc')
            ->paginate(10)
            ->through(function ($item) {
                return [
                    'course_id' => $item->course_id,
                    'course_name' => $item->course_name,
                    'course_category' => [
                        'course_category_bill_id' => $item->course_category_bill_id,
                        'course_category_bill_name' => $item->course_category_bill_name,
                    ],
                    'course_group' => [
                        'course_group_id' => $item->course_group_id,
                        'batch' => $item->batch,
                        'date_start' => $item->course_group_date_start,
                        'date_end' => $item->course_group_date_end,
                        'theoretical_score_criteria' => $item->course_group_theoretical_score_criteria,
                        'practical_score_criteria' => $item->course_group_practical_score_criteria,
                    ],
                    'enrollment' => [
                        'course_group_id' => $item->course_group_id,
                        'student_id' => $item->student_id,
                        'firstname_tha' => $item->firstname_tha,
                        'lastname_tha' => $item->lastname_tha,
                        'activity_case_status' => $item->activity_case_status,
                        'theoretical_score' => $item->theoretical_score,
                        'practical_score' => $item->practical_score,
                        'enrollment_date' => $item->enrollment_date,
                        'enrollment_date_start' => $item->enrollment_date_start,
                        'enrollment_date_end' => $item->enrollment_date_end,
                        'created_at' => $item->enrollments_created_at,
                        'updated_at' => $item->enrollments_updated_at,
                    ],
                    'bill_infos' => [
                        'vol' => $item->bill_infos_vol,
                        'no' => $item->bill_infos_no,
                        'date_submit' => $item->date_submit,
                        'created_at' => $item->bill_infos_create_at,
                        'updated_at' => $item->bill_infos_updated_at,
                        'course_price' => $item->course_price,
                    ],
                    'student_attendance' => [
                        'total_classes' => $item->total_classes,
                        'present_count' => $item->present_count,
                        'absent_count' => $item->absent_count,
                    ],
                    'course_completion' => [
                        'course_completion_id' => $item->course_completion_id,
                        'course_completion_date_start' => $item->course_completion_date_start,
                        'course_completion_date_end' => $item->course_completion_date_end,
                        'course_completion_completed_date' => $item->course_completion_completed_date,
                    ],
                ];
            });
        return $this->successResponse($enrollmentStatusGraduate, 'Enrollment status retrieved successfully', 200);
    }

    public function getAllEnrollmentByCourseGroupId(int $courseGroupId): JsonResponse
    {
        $enrollment = Enrollment::where('course_group_id', $courseGroupId)
            ->with('student', 'course_group', 'course_group.course')
            ->get();
        return $this->successResponse($enrollment, 'Enrollment retrieved successfully', 200);
    }
}
