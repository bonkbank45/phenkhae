<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaritalStatus;
class MaritalStatusController extends Controller
{
    public function index()
    {
        $maritalStatuses = MaritalStatus::all();
        return response()->json($maritalStatuses);
    }
}
