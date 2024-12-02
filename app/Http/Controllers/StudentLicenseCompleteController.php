<?php

namespace App\Http\Controllers;

use App\Traits\JsonResponseTrait;
use Illuminate\Http\JsonResponse;
use App\Models\StudentLicenseComplete;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreStudentLicenseCompleteRequest;
use App\Http\Requests\UpdateStudentLicenseCompleteRequest;
class StudentLicenseCompleteController extends Controller
{
    use JsonResponseTrait;
    public function index(): JsonResponse
    {
        $studentLicenseCompletes = StudentLicenseComplete::all();
        return $this->successResponse($studentLicenseCompletes);
    }
    public function store(StoreStudentLicenseCompleteRequest $request): JsonResponse
    {
        $studentLicenseComplete = StudentLicenseComplete::create($request->all());
        return $this->successResponse($studentLicenseComplete, 'Student license complete created successfully', 201);
    }
    public function show(int $id): JsonResponse
    {
        try {
            $studentLicenseComplete = StudentLicenseComplete::findOrFail($id);
            return $this->successResponse($studentLicenseComplete);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
    public function update(UpdateStudentLicenseCompleteRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $studentLicenseComplete = StudentLicenseComplete::findOrFail($id);
            $studentLicenseComplete->update($request->all());
            DB::commit();
            return $this->successResponse($studentLicenseComplete, 'Student license complete updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $studentLicenseComplete = StudentLicenseComplete::findOrFail($id);
            $studentLicenseComplete->delete();
            DB::commit();
            return $this->successResponse(null, 'Student license complete deleted successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
}
