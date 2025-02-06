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
}
