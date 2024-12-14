<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubDistrict;

class SubDistrictController extends Controller
{
    public function index(Request $request, $districtId)
    {
        $subDistricts = SubDistrict::where('district_id', $districtId)->get();
        return response()->json($subDistricts);
    }
}
