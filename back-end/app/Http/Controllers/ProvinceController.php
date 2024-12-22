<?php


namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Traits\JsonResponseTrait;
use App\Models\Province;

class ProvinceController extends Controller
{
    use JsonResponseTrait;
    public function index()
    {
        $provinces = Province::all();
        return $this->successResponse($provinces, 'Provinces retrieved successfully');
    }
}
