<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CourseCategoryController;
use App\Http\Controllers\CourseCategoryBillController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseGroupController;
use App\Http\Controllers\CoursePriceController;
use App\Http\Controllers\CourseAttendenceController;
use App\Http\Controllers\MedicalConditionController;
use App\Http\Controllers\OccupationController;
use App\Http\Controllers\StudentLicenseCompleteController;
use App\Http\Controllers\StudentController;
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
    Route::prefix('medical_condition')->group(function () {
        Route::get('/', [MedicalConditionController::class, 'index']);
        Route::post('/', [MedicalConditionController::class, 'store']);
        Route::get('/{medicalCondition}', [MedicalConditionController::class, 'show']);
        Route::put('/{medicalCondition}', [MedicalConditionController::class, 'update']);
        Route::delete('/{medicalCondition}', [MedicalConditionController::class, 'destroy']);
    });
    Route::prefix('occupation')->group(function () {
        Route::get('/', [OccupationController::class, 'index']);
        Route::post('/', [OccupationController::class, 'store']);
        Route::get('/{occupation}', [OccupationController::class, 'show']);
        Route::put('/{occupation}', [OccupationController::class, 'update']);
        Route::delete('/{occupation}', [OccupationController::class, 'destroy']);
    });
    Route::prefix('student_license_complete')->group(function () {
        Route::get('/', [StudentLicenseCompleteController::class, 'index']);
        Route::post('/', [StudentLicenseCompleteController::class, 'store']);
        Route::get('/{studentLicenseComplete}', [StudentLicenseCompleteController::class, 'show']);
        Route::put('/{studentLicenseComplete}', [StudentLicenseCompleteController::class, 'update']);
        Route::delete('/{studentLicenseComplete}', [StudentLicenseCompleteController::class, 'destroy']);
    });
    Route::prefix('student')->group(function () {
        Route::post('/', [StudentController::class, 'store']);
    });
});
