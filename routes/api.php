<?php

use App\Http\Controllers\CourseCategoryController;
use App\Http\Controllers\CourseCategoryBillController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseGroupController;
use App\Http\Controllers\CoursePriceController;
use App\Http\Controllers\CourseAttendenceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => ['api']], function () {
    Route::prefix('course_category')->group(function () {
        Route::get('/{courseCategory}', [CourseCategoryController::class, 'show']);
        Route::post('/', [CourseCategoryController::class, 'store']);
        Route::put('/{courseCategory}', [CourseCategoryController::class, 'update']);
        Route::delete('/{courseCategory}', [CourseCategoryController::class, 'destroy']);
    });
    Route::prefix('course_category_bill')->group(function () {
        Route::get('/{courseCategoryBill}', [CourseCategoryBillController::class, 'show']);
        Route::post('/', [CourseCategoryBillController::class, 'store']);
        Route::put('/{courseCategoryBill}', [CourseCategoryBillController::class, 'update']);
        Route::delete('/{courseCategoryBill}', [CourseCategoryBillController::class, 'destroy']);
    });
    Route::prefix('course')->group(function () {
        Route::get('/', [CourseController::class, 'index']);
        Route::get('/{course}', [CourseController::class, 'show']);
        Route::post('/', [CourseController::class, 'store']);
        Route::put('/{course}', [CourseController::class, 'update']);
        Route::delete('/{course}', [CourseController::class, 'destroy']);
    });
    Route::prefix('course_group')->group(function () {
        Route::get('/', [CourseGroupController::class, 'index']);
        Route::post('/', [CourseGroupController::class, 'store']);
        Route::get('/{courseGroup}', [CourseGroupController::class, 'show']);
        Route::put('/{courseGroup}', [CourseGroupController::class, 'update']);
        Route::delete('/{courseGroup}', [CourseGroupController::class, 'destroy']);
    });
    Route::prefix('course_price')->group(function () {
        Route::get('/', [CoursePriceController::class, 'index']);
        Route::post('/', [CoursePriceController::class, 'store']);
        Route::get('/{coursePrice}', [CoursePriceController::class, 'show']);
        Route::put('/{coursePrice}', [CoursePriceController::class, 'update']);
        Route::delete('/{coursePrice}', [CoursePriceController::class, 'destroy']);
    });
    Route::prefix('course_attendence')->group(function () {
        Route::get('/', [CourseAttendenceController::class, 'index']);
        Route::post('/', [CourseAttendenceController::class, 'store']);
        Route::get('/{courseAttendence}', [CourseAttendenceController::class, 'show']);
        Route::put('/{courseAttendence}', [CourseAttendenceController::class, 'update']);
        Route::delete('/{courseAttendence}', [CourseAttendenceController::class, 'destroy']);
    });
});
