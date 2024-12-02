<?php

namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Traits\JsonResponseTrait;

use App\Models\CourseCategory;
use App\Http\Requests\StoreCourseCategoryRequest;
use App\Http\Requests\UpdateCourseCategoryRequest;
class CourseCategoryController extends Controller
{
    use JsonResponseTrait;
    public function show(int $id): JsonResponse
    {
        try {
            $courseCategory = CourseCategory::findOrFail($id);
            return $this->successResponse($courseCategory, 'Course category retrieved successfully', 200);
        } catch (ModelNotFoundException $exception) {
            return $this->errorResponse('Course category not found', 404);
        }
    }
    public function update(int $id, UpdateCourseCategoryRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $courseCategory = CourseCategory::findOrFail($id);
            $courseCategory->update($request->all());
            DB::commit();
            return $this->successResponse($courseCategory, 'Course category updated successfully', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update course category', 500);
        }
    }
    public function store(StoreCourseCategoryRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $courseCategory = CourseCategory::create($request->all());
            DB::commit();
            return $this->successResponse($courseCategory, 'Course category created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create course category', 500);
        }
    }
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $courseCategory = CourseCategory::findOrFail($id);
            $courseCategory->delete();
            DB::commit();
            return $this->successResponse($courseCategory, 'Course category deleted successfully', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete course category', 500);
        }
    }
}
