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
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Debug เพื่อดูว่ามี token หรือไม่
            \Log::info('Token: ' . $request->bearerToken());
            \Log::info('User: ' . auth()->user());

            if (!auth()->check()) {
                return response()->json([
                    'message' => 'กรุณาเข้าสู่ระบบก่อน',
                    'error' => 'Unauthenticated'
                ], 401);
            }

            $user = auth()->user();

            if (!$user || !$user->role) {
                return response()->json([
                    'message' => 'ไม่พบข้อมูลสิทธิ์การใช้งาน',
                    'error' => 'No role found'
                ], 403);
            }

            $requiredPermission = $this->actionMap[$request->method()] ?? null;

            if (!$requiredPermission || !$user->role->$requiredPermission) {
                return response()->json([
                    'message' => "คุณไม่มีสิทธิ์ในการ{$this->getThaiAction($requiredPermission)}ข้อมูล",
                    'error' => 'Permission denied'
                ], 403);
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
