<?php

namespace App\Http\Controllers;

use App\Models\Prename;
use Illuminate\Http\Request;

class PrenameController extends Controller
{
    public function index()
    {
        $prefixNames = Prename::all();
        return response()->json($prefixNames);
    }
}
