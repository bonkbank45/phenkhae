<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\District;
class DistrictController extends Controller
{
    public function index(Request $request, $provinceId)
    {
        $districts = District::where('province_id', $provinceId)->get();
        return response()->json($districts);
    }
}
