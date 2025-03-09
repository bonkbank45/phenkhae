<?php

namespace App\Http\Controllers;

use App\Models\EducationQual;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Traits\JsonResponseTrait;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreEducationQualRequest;
use App\Http\Requests\UpdateEducationQualRequest;

class EducationQualController extends Controller
{
    use JsonResponseTrait;
    public function index(): JsonResponse
    {
        $educationQuals = EducationQual::all();
        return $this->successResponse($educationQuals);
    }

    public function table(Request $request): JsonResponse
    {
        $search = $request->input('search');
        $educationQuals = EducationQual::where('edu_qual_name', 'like', '%' . $search . '%')
            ->orWhere('edu_qual_eng', 'like', '%' . $search . '%')
            ->orWhere('id', 'like', '%' . $search . '%')
            ->paginate(10);
        return $this->successResponse($educationQuals);
    }

    public function store(StoreEducationQualRequest $request): JsonResponse
    {
        $educationQual = EducationQual::create($request->validated());
        return $this->successResponse($educationQual);
    }

    public function update(UpdateEducationQualRequest $request, EducationQual $educationQual): JsonResponse
    {
        $educationQual->update($request->validated());
        return $this->successResponse($educationQual);
    }

    public function destroy(string $educationQual): JsonResponse
    {
        try {
            $educationQual = EducationQual::findOrFail($educationQual);
            $educationQual->delete();
            return $this->successResponse($educationQual, 'ลบวุฒิการศึกษาสำเร็จ', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('วุฒิการศึกษาไม่พบ', 404);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
