<?php

namespace App\Http\Controllers;

use App\Models\EducationQual;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Traits\JsonResponseTrait;
class EducationQualController extends Controller
{
    use JsonResponseTrait;
    public function index(): JsonResponse
    {
        $educationQuals = EducationQual::all();
        return $this->successResponse($educationQuals);
    }
}
