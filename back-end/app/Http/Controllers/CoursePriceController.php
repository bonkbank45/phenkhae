<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\JsonResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Models\CoursePrice;
use Exception;
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
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'price' => 'required|numeric|min:0',
        ]);
        $request->merge([
            'date_start' => now(),
            'date_end' => null,
        ]);
        DB::beginTransaction();
        try {
            $course_price = CoursePrice::create($request->all());
            DB::commit();
            return $this->successResponse($course_price, 'Course price created successfully', 201);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create course price: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        try {
            $course_price = CoursePrice::findOrFail($id);
            return $this->successResponse($course_price, 'Course price fetched successfully', 200);
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
            return $this->successResponse($course_price, 'Course price fetched successfully', 200);
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
            return $this->successResponse($course_price, 'Course price updated successfully', 200);
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
            return $this->successResponse(null, 'Course price deleted successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course price not found', 404);
        }
    }

    public function updateNewPrice(Request $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $course_price = CoursePrice::findOrFail($id);
            $course_price->update([
                'date_end' => now(),
            ]);
            $new_course_price = CoursePrice::create([
                'course_id' => $course_price->course_id,
                'price' => $request->new_price,
                'date_start' => now(),
                'date_end' => null,
            ]);
            DB::commit();
            return $this->successResponse($new_course_price, 'Course price updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Course price not found', 404);
        }
    }
}
