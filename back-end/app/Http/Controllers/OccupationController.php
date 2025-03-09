<?php

namespace App\Http\Controllers;

use App\Models\Occupation;
use App\Traits\JsonResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreOccupationRequest;
use App\Http\Requests\UpdateOccupationRequest;

class OccupationController extends Controller
{
    use JsonResponseTrait;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $occupations = Occupation::all();
        return $this->successResponse($occupations);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function table(Request $request)
    {
        $search = $request->input('search');
        $occupations = Occupation::where('occupation_name', 'like', '%' . $search . '%')
            ->orWhere('id', 'like', '%' . $search . '%')->paginate(10);
        return $this->successResponse($occupations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOccupationRequest $request): JsonResponse
    {
        $occupation = Occupation::create($request->validated());
        return $this->successResponse($occupation, 'Occupation created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $occupation = Occupation::findOrFail($id);
            return $this->successResponse($occupation);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Occupation $occupation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOccupationRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $occupation = Occupation::findOrFail($id);
            $occupation->update($request->all());
            DB::commit();
            return $this->successResponse($occupation, 'Occupation updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $occupation = Occupation::findOrFail($id);
            $occupation->delete();
            DB::commit();
            return $this->successResponse(null, 'Occupation deleted successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
}
