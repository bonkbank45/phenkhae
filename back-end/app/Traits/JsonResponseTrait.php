<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait JsonResponseTrait
{
    protected function successResponse($data, string $message = '', int $code = 200): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], status: $code);
    }

    protected function errorResponse(string $message = '', int $code = 422): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message
        ], status: $code);
    }
}
