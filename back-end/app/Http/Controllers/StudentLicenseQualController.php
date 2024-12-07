<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Models\StudentLicenseQual;
use App\Traits\JsonResponseTrait;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreStudentLicenseQualRequest;
use App\Http\Requests\UpdateStudentLicenseQualRequest;
class StudentLicenseQualController extends Controller
{
    use JsonResponseTrait;
    public function index(): JsonResponse
    {
        $studentLicenseQuals = StudentLicenseQual::all();
        return $this->successResponse($studentLicenseQuals);
    }
    public function show(int $id): JsonResponse
    {
        try {
            $studentLicenseQual = StudentLicenseQual::findOrFail($id);
            return $this->successResponse($studentLicenseQual);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
    public function store(StoreStudentLicenseQualRequest $request): JsonResponse
    {
        $studentLicenseQual = StudentLicenseQual::create($request->all());
        return $this->successResponse($studentLicenseQual);
    }
    public function update(UpdateStudentLicenseQualRequest $request, int $id): JsonResponse
    {
        try {
            $studentLicenseQual = StudentLicenseQual::findOrFail($id);
            $studentLicenseQual->update($request->all());
            return $this->successResponse($studentLicenseQual);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
    public function destroy(int $id): JsonResponse
    {
        try {
            $studentLicenseQual = StudentLicenseQual::findOrFail($id);
            $studentLicenseQual->delete();
            return $this->successResponse(null, 'Student license qual deleted successfully');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
}
