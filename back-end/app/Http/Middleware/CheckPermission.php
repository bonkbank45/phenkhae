<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    private $actionMap = [
        'GET' => 'read',
        'POST' => 'create',
        'PUT' => 'update',
        'PATCH' => 'update',
        'DELETE' => 'delete'
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        try {
            if (!auth()->check()) {
                return response()->json([
                    'message' => 'กรุณาเข้าสู่ระบบก่อน',
                    'error' => 'Unauthenticated'
                ], 401);
            }

            $user = auth()->user();
            $role = $user->role;

            if (!$role || !$role->{$permission}) {
                return response()->json(['status' => false, 'message' => 'Permission denied'], 401);
            }

            return $next($request);

        } catch (\Exception $e) {
            \Log::error('Permission Check Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getThaiAction($action): string
    {
        $thaiActions = [
            'create' => 'เพิ่ม',
            'read' => 'ดู',
            'update' => 'แก้ไข',
            'delete' => 'ลบ'
        ];

        return $thaiActions[$action] ?? $action;
    }
}
