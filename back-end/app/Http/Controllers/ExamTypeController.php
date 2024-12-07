<?php

namespace App\Http\Controllers;

use App\Traits\JsonResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\ExamType;
use App\Http\Requests\StoreExamTypeRequest;
use App\Http\Requests\UpdateExamTypeRequest;

class ExamTypeController extends Controller
{
    use JsonResponseTrait;
    public function index(): JsonResponse
    {
        $exam_types = ExamType::all();
        return $this->successResponse($exam_types, 'Exam types retrieved successfully', 200);
    }
    public function show(int $id): JsonResponse
    {
        $exam_type = ExamType::findOrFail($id);
        return $this->successResponse($exam_type, 'Exam type retrieved successfully', 200);
    }
    public function store(StoreExamTypeRequest $request): JsonResponse
    {
        $exam_type = ExamType::create($request->all());
        return $this->successResponse($exam_type, 'Exam type created successfully', 201);
    }
    public function update(UpdateExamTypeRequest $request, int $id): JsonResponse
    {
        $exam_type = ExamType::findOrFail($id);
        $exam_type->update($request->all());
        return $this->successResponse($exam_type, 'Exam type updated successfully', 200);
    }
    public function destroy(int $id): JsonResponse
    {
        $exam_type = ExamType::findOrFail($id);
        $exam_type->delete();
        return $this->successResponse(null, 'Exam type deleted successfully', 200);
    }
}
