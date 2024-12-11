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
use App\Http\Controllers\StudentLicenseQualController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ExamTypeController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MaritalStatusController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\PrenameController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::group(['middleware' => ['api']], function () {
    Route::prefix('course_category')->group(function () {
        Route::get('/', [CourseCategoryController::class, 'index']);
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
    Route::prefix('student_license_qual')->group(function () {
        Route::get('/', [StudentLicenseQualController::class, 'index']);
        Route::post('/', [StudentLicenseQualController::class, 'store']);
        Route::get('/{studentLicenseQual}', [StudentLicenseQualController::class, 'show']);
        Route::put('/{studentLicenseQual}', [StudentLicenseQualController::class, 'update']);
        Route::delete('/{studentLicenseQual}', [StudentLicenseQualController::class, 'destroy']);
    });
    Route::prefix('student')->group(function () {
        Route::get('/', [StudentController::class, 'index']);
        Route::post('/', [StudentController::class, 'store']);
        Route::get('/{student}', [StudentController::class, 'show']);
        Route::put('/{student}', [StudentController::class, 'update']);
        Route::delete('/{student}', [StudentController::class, 'destroy']);
    });
    Route::prefix('enrollment')->group(function () {
        Route::get('/', [EnrollmentController::class, 'index']);
        Route::post('/', [EnrollmentController::class, 'store']);
        Route::get('/{enrollment}', [EnrollmentController::class, 'show']);
        Route::put('/{enrollment}', [EnrollmentController::class, 'update']);
        Route::delete('/{enrollment}', [EnrollmentController::class, 'destroy']);
    });
    Route::prefix('exam_type')->group(function () {
        Route::get('/', [ExamTypeController::class, 'index']);
        Route::post('/', [ExamTypeController::class, 'store']);
        Route::get('/{examType}', [ExamTypeController::class, 'show']);
        Route::put('/{examType}', [ExamTypeController::class, 'update']);
        Route::delete('/{examType}', [ExamTypeController::class, 'destroy']);
    });
    Route::prefix('exam')->group(function () {
        Route::get('/', [ExamController::class, 'index']);
        Route::post('/', [ExamController::class, 'store']);
        Route::get('/{exam}', [ExamController::class, 'show']);
        Route::put('/{exam}', [ExamController::class, 'update']);
        Route::delete('/{exam}', [ExamController::class, 'destroy']);
    });
    Route::prefix('marital_status')->group(function () {
        Route::get('/', [MaritalStatusController::class, 'index']);
    });
    Route::prefix('province')->group(function () {
        Route::get('/', [ProvinceController::class, 'index']);
    });
    Route::prefix('prefix_name')->group(function () {
        Route::get('/', [PrenameController::class, 'index']);
    });
});
