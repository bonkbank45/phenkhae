<?php

namespace App\Http\Controllers;

use App\Models\Prename;
use Illuminate\Http\Request;

class PrenameController extends Controller
{
    public function index(Request $request)
    {
        $prefixNames = Prename::filterByStatus($request->show_status)
            ->get();
        return response()->json($prefixNames);
    }

    public function table(Request $request)
    {
        $prefixNames = Prename::filterByStatus($request->show_status)
            ->search($request->search)
            ->paginate(10);
        return response()->json($prefixNames);
    }

    public function store(Request $request)
    {
        $prefixName = Prename::create($request->all());
        return response()->json($prefixName, 201);
    }

    public function show($id)
    {
        $prefixName = Prename::find($id);
        return response()->json($prefixName);
    }

    public function update(Request $request, $id)
    {
        $prefixName = Prename::find($id);
        $prefixName->update($request->all());
        return response()->json($prefixName);
    }

    public function destroy($id)
    {
        try {
            $prefixName = Prename::find($id);
            if ($prefixName->students()->exists()) {
                return response()->json(['message' => 'ไม่สามารถลบคำนำหน้าชื่อนี้ได้เนื่องจากมีการใช้งานอยู่'], 409);
            }
            $prefixName->delete();
            return response()->json(['message' => 'ลบคำนำหน้าชื่อสำเร็จ']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'ไม่สามารถลบคำนำหน้าชื่อนี้ได้เนื่องจากมีการใช้งานอยู่'], 409);
        }
    }
}