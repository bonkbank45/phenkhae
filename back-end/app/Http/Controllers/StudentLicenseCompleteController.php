<?php

namespace App\Http\Controllers;

use App\Traits\JsonResponseTrait;
use Illuminate\Http\JsonResponse;
use App\Models\StudentLicenseComplete;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreStudentLicenseCompleteRequest;
use App\Http\Requests\UpdateStudentLicenseCompleteRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;
class StudentLicenseCompleteController extends Controller
{
    use JsonResponseTrait;
    public function index(): JsonResponse
    {
        $studentLicenseCompletes = StudentLicenseComplete::all();
        return $this->successResponse($studentLicenseCompletes);
    }

    public function table(Request $request): JsonResponse
    {
        $studentLicenseCompletes = StudentLicenseComplete::with('student', 'course_group', 'course_group.course')
            ->when($request->has('search'), function ($query) use ($request) {
                return $query->search($request->search);
            })
            ->when($request->has('course_id'), function ($query) use ($request) {
                return $query->byCourse($request->course_id);
            })
            ->when($request->has('date_search_start'), function ($query) use ($request) {
                return $query->dateSearchStart($request->date_search_start);
            })
            ->when($request->has('date_search_end'), function ($query) use ($request) {
                return $query->dateSearchEnd($request->date_search_end);
            })
            ->paginate(10);
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

    public function bulkStore(Request $request): JsonResponse
    {
        $dateCompleted = Carbon::createFromFormat('d/m/Y', $request->input('date_completed'))
            ->format('Y-m-d');
        $students = $request->input('students');

        $createdRecords = collect($students)->map(function ($student) use ($dateCompleted) {
            return StudentLicenseComplete::create([
                'student_id' => $student['student_id'],
                'course_group_id' => $student['course_group_id'],
                'date_complete' => $dateCompleted
            ]);
        });

        return $this->successResponse($createdRecords, 'Student license complete created successfully', 201);
    }

    public function getCourseLicenseCompletedPerYear(): JsonResponse
    {
        $result = StudentLicenseComplete::join('course_groups', 'student_license_completes.course_group_id', '=', 'course_groups.id')
            ->join('courses', 'course_groups.course_id', '=', 'courses.id')
            ->join('students', 'student_license_completes.student_id', '=', 'students.id')
            ->select(
                DB::raw('YEAR(course_groups.date_start) as year'),
                'courses.course_name',
                'course_groups.batch',
                DB::raw('COUNT(CASE WHEN students.gender = 1 THEN 1 END) as male'),
                DB::raw('COUNT(CASE WHEN students.gender = 2 THEN 1 END) as female')
            )
            ->groupBy('year', 'course_groups.id')
            ->get();

        $formattedData = $result->groupBy('year')
            ->map(function ($yearGroup) {
                return [
                    'year' => $yearGroup->first()->year,
                    'courses' => $yearGroup->groupBy('course_name')
                        ->map(function ($item) {
                            return $item->map(function ($item) {
                                return [
                                    'course_name' => $item->course_name,
                                    'batch' => $item->batch,
                                    'male' => $item->male,
                                    'female' => $item->female
                                ];
                            });
                        })
                ];
            })->values()->all();

        return $this->successResponse($formattedData, 'Course license completed per year', 200);
    }
}

