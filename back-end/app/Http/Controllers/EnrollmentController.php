<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use App\Traits\JsonResponseTrait;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreEnrollmentRequest;
use App\Http\Requests\UpdateEnrollmentRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Services\EnrollmentService;

class EnrollmentController extends Controller
{
    use JsonResponseTrait;
    /**
     * Display a listing of the resource.
     */

    public function __construct(private EnrollmentService $enrollmentService)
    {
        $this->enrollmentService = $enrollmentService;
    }
    public function index(): JsonResponse
    {
        $enrollments = Enrollment::all();
        return $this->successResponse($enrollments, 'Enrollments retrieved successfully', 200);
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
    public function store(StoreEnrollmentRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $enrollments = $this->enrollmentService
                ->storeEnrollment($request->course_group_id, $request->student_ids);
            Enrollment::insert($enrollments);
            DB::commit();
            return $this->successResponse($enrollments, 'Enrollments created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Enrollment failed ' . $e->getMessage(), 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $enrollment = Enrollment::findOrFail($id);
            return $this->successResponse($enrollment, 'Enrollment retrieved successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Enrollment not found', 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Enrollment $enrollment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEnrollmentRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $enrollment = Enrollment::findOrFail($id);
            $enrollment->update($request->all());
            DB::commit();
            return $this->successResponse($enrollment, 'Enrollment updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Enrollment not found', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $enrollment = Enrollment::findOrFail($id);
            $enrollment->delete();
            DB::commit();
            return $this->successResponse(null, 'Enrollment deleted successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Enrollment not found', 404);
        }
    }
}
