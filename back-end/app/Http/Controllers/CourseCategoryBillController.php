<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Traits\JsonResponseTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Models\CourseCategoryBill;
use App\Http\Requests\UpdateCourseCategoryBillRequest;
use App\Http\Requests\StoreCourseCategoryBillRequest;
class CourseCategoryBillController extends Controller
{
    use JsonResponseTrait;
    public function show(int $id): JsonResponse
    {
        try {
            $courseCategoryBill = CourseCategoryBill::findOrFail($id);
            return $this->successResponse($courseCategoryBill, 'Course category bill retrieved successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Course category bill not found', 404);
        }
    }
    public function update(int $id, UpdateCourseCategoryBillRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $courseCategoryBill = CourseCategoryBill::findOrFail($id);
            $courseCategoryBill->update($request->all());
            DB::commit();
            return $this->successResponse($courseCategoryBill, 'Course category bill updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course category bill not found', 404);
        }
    }
    public function store(StoreCourseCategoryBillRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $courseCategoryBill = CourseCategoryBill::create($request->all());
            DB::commit();
            return $this->successResponse($courseCategoryBill, 'Course category bill created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create course category bill', 500);
        }
    }
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $courseCategoryBill = CourseCategoryBill::findOrFail($id);
            $courseCategoryBill->delete();
            DB::commit();
            return $this->successResponse(null, 'Course category bill deleted successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to delete course category bill', 500);
        }
    }
}
