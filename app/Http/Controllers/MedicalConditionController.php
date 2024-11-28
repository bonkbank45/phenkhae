<?php

namespace App\Http\Controllers;

use App\Models\MedicalCondition;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Traits\JsonResponseTrait;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\StoreMedicalConditionRequest;
use App\Http\Requests\UpdateMedicalConditionRequest;
class MedicalConditionController extends Controller
{
    use JsonResponseTrait;
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $medical_conditions = MedicalCondition::all();
        return $this->successResponse($medical_conditions, 'Medical conditions retrieved successfully');
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
    public function store(StoreMedicalConditionRequest $request): JsonResponse
    {
        $medical_condition = MedicalCondition::create($request->all());
        return $this->successResponse($medical_condition, 'Medical condition created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $medical_condition = MedicalCondition::findOrFail($id);
            return $this->successResponse($medical_condition, 'Medical condition retrieved successfully');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Medical condition not found', 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MedicalCondition $medicalCondition)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMedicalConditionRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $medical_condition = MedicalCondition::findOrFail($id);
            $medical_condition->update($request->all());
            DB::commit();
            return $this->successResponse($medical_condition, 'Medical condition updated successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Medical condition not found', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $medical_condition = MedicalCondition::findOrFail($id);
            $medical_condition->delete();
            DB::commit();
            return $this->successResponse(null, 'Medical condition deleted successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Medical condition not found', 404);
        }
    }
}
