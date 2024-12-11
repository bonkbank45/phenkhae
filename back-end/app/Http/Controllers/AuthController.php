<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Email or password is incorrect'], 401);
        }

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'role' => Role::find($user->role_id)->name,
                ],
                'token' => $token,
            ]);
        }

        return response()->json(['error' => 'Email or password is incorrect'], 401);
    }
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logout successful'], 200);
    }
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'role_id' => 1,
        ]);

        return response()->json(['message' => 'User created successfully'], 201);
    }
    public function user(Request $request)
    {
        $user = Auth::user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'role' => Role::find($user->role_id)->name,
            ]
        ], 200);
    }
}
