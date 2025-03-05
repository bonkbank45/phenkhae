<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class SetPasswordController extends Controller
{
    public function setPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ], [
            'password.required' => 'กรุณากรอกรหัสผ่าน',
            'password.min' => 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
            'password.confirmed' => 'ยืนยันรหัสผ่านไม่ตรงกัน',
        ]);

        // ค้นหา token ในตาราง password_reset_tokens
        $tokenData = DB::table('password_reset_tokens')
            ->where('token', $request->token)
            ->first();

        if (!$tokenData) {
            return response()->json([
                'message' => 'ลิงค์ไม่ถูกต้องหรือหมดอายุแล้ว'
            ], 400);
        }

        // อัพเดทรหัสผ่าน
        $user = User::where('email', $tokenData->email)->first();
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // ลบ token เมื่อตั้งรหัสผ่านเสร็จ
        DB::table('password_reset_tokens')
            ->where('token', $request->token)
            ->delete();

        return response()->json([
            'message' => 'ตั้งรหัสผ่านเรียบร้อยแล้ว'
        ]);
    }
}