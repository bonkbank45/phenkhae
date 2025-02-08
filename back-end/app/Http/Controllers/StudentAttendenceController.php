<?php

namespace App\Http\Controllers;

use App\Traits\JsonResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Models\StudentAttendence;

class StudentAttendenceController extends Controller
{
    use JsonResponseTrait;

    public function index(): JsonResponse
    {
        $student_attendences = StudentAttendence::all();
        return $this->successResponse($student_attendences, 'Student attendences fetched successfully', 200);
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            foreach ($request->all() as $attendance) {
                StudentAttendence::updateOrCreate(
                    [
                        'course_attendence_id' => $attendance['course_attendence_id'],
                        'student_id' => $attendance['student_id']
                    ],
                    [
                        'status' => $attendance['status']
                    ]
                );
            }
            DB::commit();
            return $this->successResponse(true, 'Student attendence updated successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Student attendence update failed: ' . $e->getMessage(), 500);
        }
    }

    public function getStudentAttendencesByCourseAttendenceId(int $courseAttendenceId): JsonResponse
    {
        $student_attendences = StudentAttendence::where('course_attendence_id', $courseAttendenceId)
            ->with('student')
            ->get();
        return $this->successResponse($student_attendences, 'Student attendences fetched successfully', 200);
    }
}
