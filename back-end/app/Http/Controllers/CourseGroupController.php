<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use App\Traits\JsonResponseTrait;
use Illuminate\Support\Facades\DB;
use App\Models\CourseGroup;
use App\Models\CoursePrice;
use App\Http\Requests\StoreCourseGroupRequest;
use App\Http\Requests\UpdateCourseGroupRequest;
class CourseGroupController extends Controller
{
    use JsonResponseTrait;
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $course_groups = CourseGroup::with([
            'course' => function ($query) {
                $query->select('id', 'course_category_id', 'course_category_bill_id', 'course_name', 'course_description');
            },
            'course.course_category' => function ($query) {
                $query->select('id', 'category_name');
            },
            'course.course_category_bill' => function ($query) {
                $query->select('id', 'category_bill_name');
            }
        ])
            ->select('id', 'batch', 'max_students', 'date_start', 'date_end', 'course_id')
            ->get();

        return $this->successResponse($course_groups, 'Course groups fetched successfully', 200);
    }

    public function course(int $courseId): JsonResponse
    {
        $course_groups = CourseGroup::where('course_id', $courseId)->get();
        return $this->successResponse($course_groups, 'Course groups by course id fetched successfully', 200);
    }

    public function available(): JsonResponse
    {
        $course_groups = CourseGroup::where(
            'date_start',
            '>=',
            date('Y-m-d H:i:s')
        )
            ->with('course', 'enrollments')
            ->get()
            ->groupBy(function ($course_group) {
                return $course_group->course->course_category->category_name;
            })
            ->map(function ($grouped_course_groups) {
                return $grouped_course_groups->map(function ($course_group) {
                    return [
                        'course_name' => $course_group->course->course_name,
                        'course_batch' => $course_group->batch,
                        'max_students' => $course_group->max_students,
                        'students_enrolled' => $course_group->enrollments->count(),
                    ];
                });
            });
        return response()->json([
            'status' => 'success',
            'message' => 'Course data categories retrieved successfully',
            'data' => $course_groups
        ], 200);
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
                'course' => function ($query) {
                    $query->select('id', 'course_category_id', 'course_category_bill_id', 'course_name', 'course_description');
                },
                'course.course_category' => function ($query) {
                    $query->select('id', 'category_name');
                },
                'course.course_category_bill' => function ($query) {
                    $query->select('id', 'category_bill_name');
                },
                'enrollments' => function ($query) {
                    $query->select('course_group_id', 'student_id');
                }
            ])
                ->select('id', 'batch', 'max_students', 'date_start', 'date_end', 'course_id')
                ->findOrFail($id);
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
}
