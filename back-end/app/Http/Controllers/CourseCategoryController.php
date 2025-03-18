<?php

namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Traits\JsonResponseTrait;

use App\Models\CourseCategory;
use App\Http\Requests\StoreCourseCategoryRequest;
use App\Http\Requests\UpdateCourseCategoryRequest;
use Illuminate\Http\Request;
class CourseCategoryController extends Controller
{
    use JsonResponseTrait;
    public function index(): JsonResponse
    {
        $courseCategories = CourseCategory::all();
        return $this->successResponse($courseCategories, 'Course categories retrieved successfully', 200);
    }
    public function show(int $id): JsonResponse
    {
        try {
            $courseCategory = CourseCategory::with('courses')
                ->findOrFail($id);
            return $this->successResponse($courseCategory, 'Course category retrieved successfully', 200);
        } catch (ModelNotFoundException $exception) {
            return $this->errorResponse('Course category not found', 404);
        }
    }
    public function update(int $courseCategoryId, UpdateCourseCategoryRequest $request): JsonResponse
    {
        DB::beginTransaction();
        \Log::info($request->all());
        try {
            $courseCategory = CourseCategory::findOrFail($courseCategoryId);
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
            $courseCategory = CourseCategory::create($request->validated());
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
        } catch (\PDOException $e) {
            DB::rollBack();
            if ($e->getCode() == 23000) {
                return $this->errorResponse('ไม่สามารถลบข้อมูลได้เนื่องจากมีการใช้งานในหลักสูตรอยู่', 409);
            }
            return $this->errorResponse($e->getMessage(), 409);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete course category', 500);
        }
    }

    public function table(Request $request): JsonResponse
    {
        $search = $request->input('search');
        $courseCategories = CourseCategory::where('category_name', 'like', '%' . $search . '%')
            ->orWhere('id', 'like', $search . '%')
            ->paginate(10);
        return $this->successResponse($courseCategories, 'Course categories retrieved successfully', 200);
    }
}
