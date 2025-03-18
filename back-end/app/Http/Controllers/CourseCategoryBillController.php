<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Traits\JsonResponseTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Models\CourseCategoryBill;
use App\Http\Requests\UpdateCourseCategoryBillRequest;
use App\Http\Requests\StoreCourseCategoryBillRequest;
use Illuminate\Http\Request;

class CourseCategoryBillController extends Controller
{
    use JsonResponseTrait;
    public function index(): JsonResponse
    {
        $courseCategoryBills = CourseCategoryBill::all();
        return $this->successResponse($courseCategoryBills, 'Course category bills retrieved successfully', 200);
    }

    public function table(Request $request): JsonResponse
    {
        $search = $request->input('search');
        $courseCategoryBills = CourseCategoryBill::where('category_bill_name', 'like', '%' . $search . '%')
            ->orWhere('id', 'like', $search . '%')
            ->paginate(10);
        return $this->successResponse($courseCategoryBills, 'Course category bills retrieved successfully', 200);
    }
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
            return $this->successResponse(null, 'ลบข้อมูลประเภทบิลใบเสร็จสำเร็จ', 200);
        } catch (\PDOException $e) {
            DB::rollBack();
            if ($e->getCode() == 23000) {
                return $this->errorResponse('ไม่สามารถลบข้อมูลได้เนื่องจากมีการใช้งานในหลักสูตรอยู่', 409);
            }
            return $this->errorResponse($e->getMessage(), 409);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('ไม่พบข้อมูลประเภทบิลใบเสร็จ', 409);
        }
    }
}
