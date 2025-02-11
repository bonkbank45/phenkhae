<?php

namespace App\Http\Controllers;

use App\Traits\JsonResponseTrait;
use Illuminate\Http\Request;
use App\Models\CourseCompletion;
use App\Services\GraduateService;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Enrollment;
class CourseCompletionController extends Controller
{
    use JsonResponseTrait;
    public function __construct(private GraduateService $graduateService)
    {
        $this->graduateService = $graduateService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'course_group_id' => 'required|integer',
            'student_id' => 'required|integer',
            'completion_date' => 'required|date_format:d/m/Y',
        ]);
        try {
            DB::beginTransaction();
            $graduateStatement = $this->graduateService->prepareGraduationStatement(
                $validatedData['course_group_id'],
                $validatedData['student_id'],
                $validatedData['completion_date']
            );
            $courseCompletion = CourseCompletion::create($graduateStatement);
            Enrollment::where('course_group_id', $validatedData['course_group_id'])
                ->where('student_id', $validatedData['student_id'])
                ->update(['date_end' => Carbon::createFromFormat('d/m/Y', $validatedData['completion_date'])->format('Y-m-d')]);
            DB::commit();
            return $this->successResponse('Graduation statement prepared successfully', $courseCompletion);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseCompletionController $courseCompletionController)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CourseCompletionController $courseCompletionController)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CourseCompletionController $courseCompletionController)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseCompletionController $courseCompletionController)
    {
        //
    }
}
