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
use App\Http\Controllers\PrenameController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\DistrictController;
use App\Http\Controllers\SubDistrictController;
use App\Http\Controllers\EducationQualController;
use App\Http\Controllers\BillInfoController;
use App\Http\Controllers\StudentAttendenceController;
use App\Http\Controllers\CourseCompletionController;
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
        Route::get('/', [CourseCategoryBillController::class, 'index']);
        Route::get('/{courseCategoryBill}', [CourseCategoryBillController::class, 'show']);
        Route::post('/', [CourseCategoryBillController::class, 'store']);
        Route::put('/{courseCategoryBill}', [CourseCategoryBillController::class, 'update']);
        Route::delete('/{courseCategoryBill}', [CourseCategoryBillController::class, 'destroy']);
    });
    Route::prefix('course')->group(function () {
        Route::get('/', [CourseController::class, 'index']);
        Route::get('/table', [CourseController::class, 'table']);
        Route::get('/{course}', [CourseController::class, 'show']);
        Route::post('/', [CourseController::class, 'store']);
        Route::put('/{course}', [CourseController::class, 'update']);
        Route::delete('/{course}', [CourseController::class, 'destroy']);
    });
    Route::prefix('course_group')->group(function () {
        Route::get('/', [CourseGroupController::class, 'index']);
        Route::get('/table', [CourseGroupController::class, 'table']);
        Route::get('/course/{courseId}', [CourseGroupController::class, 'getCourseGroupByCourseId']);
        Route::get('/courses', [CourseGroupController::class, 'getCourseGroupByCourseIds']);
        Route::get('/available', [CourseGroupController::class, 'available']);
        Route::post('/', [CourseGroupController::class, 'store']);
        Route::patch('/{courseGroup}/score-criteria', [CourseGroupController::class, 'updateScoreCriteria']);
        Route::post('/{courseGroup}/score-criteria/reset', [CourseGroupController::class, 'resetScoreCriteria']);
        Route::get('/{courseGroup}', [CourseGroupController::class, 'show']);
        Route::put('/{courseGroup}', [CourseGroupController::class, 'update']);
        Route::delete('/{courseGroup}', [CourseGroupController::class, 'destroy']);
        Route::get('/course/{courseId}/batch', [CourseGroupController::class, 'getAllCourseBatchNumberByCourseId']);
    });
    Route::prefix('course_price')->group(function () {
        Route::get('/', [CoursePriceController::class, 'index']);
        Route::post('/', [CoursePriceController::class, 'store']);
        Route::post('/{coursePrice}', [CoursePriceController::class, 'updateNewPrice']);
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
        Route::get('/course_group/{courseGroupId}', [CourseAttendenceController::class, 'getCourseAttendencesByCourseGroupId']);
    });

    Route::prefix('student_attendence')->group(function () {
        Route::get('/', [StudentAttendenceController::class, 'index']);
        Route::get('/course_group/{courseGroupId}', [StudentAttendenceController::class, 'getStudentAttendencesByCourseGroupId']);
        Route::get('/course_attendence/{courseAttendenceId}', [StudentAttendenceController::class, 'getStudentAttendencesByCourseAttendenceId']);
        Route::put('/', [StudentAttendenceController::class, 'bulkUpdate']);
        Route::delete('/{courseAttendenceId}', [StudentAttendenceController::class, 'destroy']);
        Route::put('/large_bulk_update', [StudentAttendenceController::class, 'largeBulkUpdate']);
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
        Route::post('/bulk', [StudentLicenseQualController::class, 'bulkStore']);
        Route::get('/{studentLicenseQual}', [StudentLicenseQualController::class, 'show']);
        Route::put('/{studentLicenseQual}', [StudentLicenseQualController::class, 'update']);
        Route::delete('/{studentLicenseQual}', [StudentLicenseQualController::class, 'destroy']);
    });
    Route::prefix('student')->group(function () {
        Route::get('/', [StudentController::class, 'index']);
        Route::get('/table', [StudentController::class, 'table']);
        Route::get('/count', [StudentController::class, 'count']);
        Route::post('/', [StudentController::class, 'store']);
        Route::get('/{student}', [StudentController::class, 'show']);
        Route::get('/{student}/application-form', [StudentController::class, 'generateApplicationForm']);
        Route::put('/{student}', [StudentController::class, 'update']);
        Route::delete('/{student}', [StudentController::class, 'destroy']);
    });
    Route::prefix('enrollment')->group(function () {
        Route::get('/', [EnrollmentController::class, 'index']);
        Route::post('/', [EnrollmentController::class, 'store']);
        Route::get('/course-batches', [EnrollmentController::class, 'getEnrolledStudentsByBatchIds']);
        Route::get('/course-batch/{courseBatchId}', [EnrollmentController::class, 'getEnrolledStudentsByBatchId']);
        Route::get('/{enrollment}', [EnrollmentController::class, 'show']);
        Route::patch('/{enrollment}-{studentId}', [EnrollmentController::class, 'update']);
        Route::delete('/{enrollment}', [EnrollmentController::class, 'destroy']);
        Route::get('/course_group/{courseGroupId}/graduate', [EnrollmentController::class, 'getEnrollmentStatusGraduateByBatchId']);
        Route::get('/course_group/{courseGroupId}', [EnrollmentController::class, 'getEnrollmentStudentStatusByCourseGroupId']);
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
    Route::prefix('province/{provinceId}/district')->group(function () {
        Route::get('/', [DistrictController::class, 'index']);
    });
    Route::prefix('district/{districtId}/sub_district')->group(function () {
        Route::get('/', [SubDistrictController::class, 'index']);
    });
    Route::prefix('prename')->group(function () {
        Route::get('/', [PrenameController::class, 'index']);
        Route::get('/table', [PrenameController::class, 'table']);
        Route::post('/', [PrenameController::class, 'store']);
        Route::get('/{prename}', [PrenameController::class, 'show']);
        Route::put('/{prename}', [PrenameController::class, 'update']);
        Route::delete('/{prename}', [PrenameController::class, 'destroy']);
    });

    Route::prefix('education_qual')->group(function () {
        Route::get('/', [EducationQualController::class, 'index']);
    });

    Route::prefix('bill_info')->group(function () {
        Route::get('/', [BillInfoController::class, 'index']);
        Route::post('/', [BillInfoController::class, 'store']);
        Route::put('/{billInfoId}-{billInfoNo}-{courseGroupId}', [BillInfoController::class, 'update']);
        Route::delete('/{billInfoId}-{billInfoNo}', [BillInfoController::class, 'delete']);
        Route::get('/get-bill-info/{courseBatchId}', [BillInfoController::class, 'getBillInfo']);
        Route::get('/get-latest-bill-vol', [BillInfoController::class, 'getLatestBillVol']);
    });

    Route::prefix('course_completion')->group(function () {
        Route::get('/', [CourseCompletionController::class, 'index']);
        Route::post('/', [CourseCompletionController::class, 'store']);
        Route::get('/table', [CourseCompletionController::class, 'getCourseCompletionTable']);
        Route::get('/unlicensed-completions/table', [CourseCompletionController::class, 'getUnlicensedCompletions']);
    });
});
