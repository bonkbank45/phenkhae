<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Traits\JsonResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Models\Course;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
class CourseController extends Controller
{
    use JsonResponseTrait;
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $courses = Course::all();
        return $this->successResponse($courses, 'Courses fetched successfully');
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
    public function store(StoreCourseRequest $request): JsonResponse
    {
        $course = Course::create($request->all());
        return $this->successResponse($course, 'Course created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $course = Course::findOrFail($id);
            return $this->successResponse($course, 'Course fetched successfully');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Course not found', 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id): JsonResponse
    {
        try {
            $course = Course::findOrFail($id);
            return $this->successResponse($course, 'Course fetched successfully');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Course not found', 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course = Course::findOrFail($id);
            $course->update($request->all());
            DB::commit();
            return $this->successResponse($course, 'Course updated successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course not found', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course = Course::findOrFail($id);
            $course->delete();
            DB::commit();
            return $this->successResponse(null, 'Course deleted successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course not found', 404);
        }
    }
}
