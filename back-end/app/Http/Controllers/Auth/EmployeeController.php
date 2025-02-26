<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CreateEmployeeRequest;
use App\Mail\SetPasswordMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
class EmployeeController extends Controller
{
    public function store(CreateEmployeeRequest $request)
    {
        $user = User::create([
            'email' => $request->email,
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'role_id' => 2
        ]);

        $token = Str::random(64);
        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => $token,
            'created_at' => now()
        ]);

        Mail::to($user->email)->send(new SetPasswordMail(
            token: $token,
            name: $user->firstname
        ));

        return response()->json([
            'message' => 'ลิงค์สำหรับตั้งรหัสผ่านถูกส่งไปยังอีเมล์เรียบร้อยแล้ว'
        ]);
    }
}