<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use App\Traits\JsonResponseTrait;
use Illuminate\Support\Facades\DB;
use App\Models\CourseGroup;

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
        $course_groups = CourseGroup::all();
        return $this->successResponse($course_groups, 'Course groups fetched successfully', 200);
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
        $course_group = CourseGroup::create($request->all());
        return $this->successResponse($course_group, 'Course group created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $course_group = CourseGroup::findOrFail($id);
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
