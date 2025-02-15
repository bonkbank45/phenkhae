<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Models\StudentLicenseQual;
use Illuminate\Http\Request;
use App\Traits\JsonResponseTrait;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreStudentLicenseQualRequest;
use App\Http\Requests\UpdateStudentLicenseQualRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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
            $studentLicenseQual = StudentLicenseQual::with('student', 'course')->findOrFail($id);
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

    public function table(Request $request): JsonResponse
    {
        $studentLicenseQuals = StudentLicenseQual::withFullDetails()
            ->when($request->has('course_id'), function ($query) use ($request) {
                return $query->byCourse($request->course_id);
            })
            ->when($request->has('license_status'), function ($query) use ($request) {
                return $query->byLicenseStatus($request->license_status);
            })
            ->when($request->has('search'), function ($query) use ($request) {
                return $query->search($request->search);
            })
            ->when($request->has('date_search_start'), function ($query) use ($request) {
                return $query->dateSearchStart($request->date_search_start);
            })
            ->when($request->has('date_search_end'), function ($query) use ($request) {
                return $query->dateSearchEnd($request->date_search_end);
            })
            ->paginate(10);

        return $this->successResponse($studentLicenseQuals, 'Student license quals fetched successfully', 200);
    }

    public function bulkStore(Request $request): JsonResponse
    {
        $dateQualified = Carbon::createFromFormat('d/m/Y', $request->input('date_qualified'))
            ->format('Y-m-d');
        $students = $request->input('students');

        $createdRecords = collect($students)->map(function ($student) use ($dateQualified) {
            return StudentLicenseQual::create([
                'student_id' => $student['student_id'],
                'course_id' => $student['course_id'],
                'date_qualified' => $dateQualified
            ]);
        });

        return $this->successResponse($createdRecords);
    }
}
