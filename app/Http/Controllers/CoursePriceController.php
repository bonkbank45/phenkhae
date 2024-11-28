<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\JsonResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Models\CoursePrice;

class CoursePriceController extends Controller
{
    use JsonResponseTrait;
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $course_prices = CoursePrice::all();
        return $this->successResponse($course_prices, 'Course prices fetched successfully');
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
    public function store(Request $request): JsonResponse
    {
        $course_price = CoursePrice::create($request->all());
        return $this->successResponse($course_price, 'Course price created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        try {
            $course_price = CoursePrice::findOrFail($id);
            return $this->successResponse($course_price, 'Course price fetched successfully');
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Course price not found', 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course_price = CoursePrice::findOrFail($id);
            DB::commit();
            return $this->successResponse($course_price, 'Course price fetched successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course price not found', 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course_price = CoursePrice::findOrFail($id);
            $course_price->update($request->all());
            DB::commit();
            return $this->successResponse($course_price, 'Course price updated successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course price not found', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course_price = CoursePrice::findOrFail($id);
            $course_price->delete();
            DB::commit();
            return $this->successResponse(null, 'Course price deleted successfully');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course price not found', 404);
        }
    }
}
