<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\JsonResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Models\CourseAttendence;
use App\Http\Requests\StoreCourseAttendenceRequest;
use App\Http\Requests\UpdateCourseAttendenceRequest;
class CourseAttendenceController extends Controller
{
    use JsonResponseTrait;
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $course_attendences = CourseAttendence::all();
        return $this->successResponse($course_attendences, 'Course attendences fetched successfully', 200);
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
    public function store(StoreCourseAttendenceRequest $request): JsonResponse
    {
        $course_attendence = CourseAttendence::create($request->all());
        return $this->successResponse($course_attendence, 'Course attendence created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $course_attendence = CourseAttendence::with('course_group', 'course_group.course')->findOrFail($id);
            return $this->successResponse($course_attendence, 'Course attendence fetched successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Course attendence not found', 404);
        }
    }

    public function showByCourseGroupIdAndDate(int $courseGroupId, string $date): JsonResponse
    {
        $course_attendences = CourseAttendence::where('course_group_id', $courseGroupId)
            ->where('attendence_date', $date)->get();
        return $this->successResponse($course_attendences, 'Course attendences fetched successfully', 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CourseAttendence $courseAttendence)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseAttendenceRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course_attendence = CourseAttendence::findOrFail($id);
            $course_attendence->update($request->all());
            DB::commit();
            return $this->successResponse($course_attendence, 'Course attendence updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course attendence not found', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course_attendence = CourseAttendence::findOrFail($id);
            $course_attendence->delete();
            DB::commit();
            return $this->successResponse(null, 'Course attendence deleted successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course attendence not found', 404);
        }
    }

    public function getCourseAttendencesByCourseGroupId(int $course_group_id): JsonResponse
    {
        $course_attendences = CourseAttendence::where('course_group_id', $course_group_id)
            ->orderBy('attendence_date', 'asc')
            ->get();
        return $this->successResponse($course_attendences, 'Course attendences fetched successfully', 200);
    }
}
