<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CreateEmployeeRequest;
use App\Mail\SetPasswordMail;
use App\Models\User;
use App\Traits\JsonResponseTrait;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class EmployeeController extends Controller
{
    use JsonResponseTrait;

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

    public function resetPassword(Request $request)
    {
        try {
            $user = User::where('email', $request->email)->first();


            $token = Str::random(64);


            try {
                DB::table('password_reset_tokens')->insert([
                    'email' => $user->email,
                    'token' => $token,
                    'created_at' => now()
                ]);
            } catch (QueryException $e) {
                return $this->errorResponse('ส่งอีเมล์ตั้งค่ารหัสผ่านไปก่อนหน้านี้แล้ว', 500);
            }

            Mail::to($user->email)->send(new SetPasswordMail(
                token: $token,
                name: $user->firstname
            ));

            return $this->successResponse($user, 'Send reset password email successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('User not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
