<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Traits\JsonResponseTrait;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Exam;
use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;
class ExamController extends Controller
{
    use JsonResponseTrait;
    public function index(): JsonResponse
    {
        $exams = Exam::all();
        return $this->successResponse($exams, 'Exams retrieved successfully', 200);
    }
    public function show(int $id): JsonResponse
    {
        try {
            $exam = Exam::findOrFail($id);
            return $this->successResponse($exam, 'Exam retrieved successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Exam not found', 404);
        }
    }
    public function store(StoreExamRequest $request): JsonResponse
    {
        $exam = Exam::create($request->all());
        return $this->successResponse($exam, 'Exam created successfully', 201);
    }
    public function update(UpdateExamRequest $request, int $id): JsonResponse
    {
        try {
            $exam = Exam::findOrFail($id);
            $exam->update($request->all());
            return $this->successResponse($exam, 'Exam updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Exam not found', 404);
        }
    }
    public function destroy(int $id): JsonResponse
    {
        try {
            $exam = Exam::findOrFail($id);
            $exam->delete();
            return $this->successResponse(null, 'Exam deleted successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Exam not found', 404);
        }
    }
}
