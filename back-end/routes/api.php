<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
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
use App\Http\Controllers\Auth\EmployeeController;
use App\Http\Controllers\Auth\SetPasswordController;
use App\Http\Controllers\ExamInvidualController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::group(['middleware' => ['api', 'auth:sanctum']], function () {
    Route::prefix('course_category')->group(function () {
        Route::get('/', [CourseCategoryController::class, 'index'])->middleware('permission:read');
        Route::get('/table', [CourseCategoryController::class, 'table'])->middleware('permission:read');
        Route::get('/{courseCategory}', [CourseCategoryController::class, 'show'])->middleware('permission:read');
        Route::post('/', [CourseCategoryController::class, 'store'])->middleware('permission:create');
        Route::put('/{courseCategory}', [CourseCategoryController::class, 'update'])->middleware('permission:update');
        Route::delete('/{courseCategory}', [CourseCategoryController::class, 'destroy'])->middleware('permission:delete');
    });

    Route::prefix('course_category_bill')->group(function () {
        Route::get('/', [CourseCategoryBillController::class, 'index'])->middleware('permission:read');
        Route::get('/table', [CourseCategoryBillController::class, 'table'])->middleware('permission:read');
        Route::get('/{courseCategoryBill}', [CourseCategoryBillController::class, 'show'])->middleware('permission:read');
        Route::post('/', [CourseCategoryBillController::class, 'store'])->middleware('permission:create');
        Route::put('/{courseCategoryBill}', [CourseCategoryBillController::class, 'update'])->middleware('permission:update');
        Route::delete('/{courseCategoryBill}', [CourseCategoryBillController::class, 'destroy'])->middleware('permission:delete');
    });

    Route::prefix('course')->group(function () {
        Route::get('/', [CourseController::class, 'index'])->middleware('permission:read');
        Route::get('/table', [CourseController::class, 'table'])->middleware('permission:read');
        Route::get('/{course}', [CourseController::class, 'show'])->middleware('permission:read');
        Route::post('/', [CourseController::class, 'store'])->middleware('permission:create');
        Route::put('/{course}', [CourseController::class, 'update'])->middleware('permission:update');
        Route::delete('/{course}', [CourseController::class, 'destroy'])->middleware('permission:delete');
    });

    Route::prefix('course_category')->group(function () {
        Route::get('/table', [CourseCategoryController::class, 'table'])->middleware('permission:read');

    });

    Route::prefix('course_group')->group(function () {
        Route::get('/', [CourseGroupController::class, 'index'])->middleware('permission:read');
        Route::get('/course_group_statistic', [CourseGroupController::class, 'getCourseGroupStatistics'])->middleware('permission:read');
        Route::get('/table', [CourseGroupController::class, 'table'])->middleware('permission:read');
        Route::get('/course/{courseId}', [CourseGroupController::class, 'getCourseGroupByCourseId'])->middleware('permission:read');
        Route::get('/courses', [CourseGroupController::class, 'getCourseGroupByCourseIds'])->middleware('permission:read');
        Route::get('/available', [CourseGroupController::class, 'available'])->middleware('permission:read');
        Route::post('/', [CourseGroupController::class, 'store'])->middleware('permission:create');
        Route::patch('/{courseGroup}/score-criteria', [CourseGroupController::class, 'updateScoreCriteria'])->middleware('permission:update');
        Route::post('/{courseGroup}/score-criteria/reset', [CourseGroupController::class, 'resetScoreCriteria'])->middleware('permission:update');
        Route::get('/{courseGroup}', [CourseGroupController::class, 'show'])->middleware('permission:read');
        Route::put('/{courseGroup}', [CourseGroupController::class, 'update'])->middleware('permission:update');
        Route::delete('/{courseGroup}', [CourseGroupController::class, 'destroy'])->middleware('permission:delete');
        Route::get('/course/{courseId}/batch', [CourseGroupController::class, 'getAllCourseBatchNumberByCourseId'])->middleware('permission:read');
        Route::get('/{courseGroup}/pdf-student-list/{attendenceId}', [CourseGroupController::class, 'generateStudentListPdf'])->middleware('permission:read');
        Route::get('/{courseGroup}/pdf-empty-student-list/{attendenceId}', [CourseGroupController::class, 'generateEmptyStudentListPdf'])->middleware('permission:read');
        Route::get('/{courseGroup}/pdf-student-card', [CourseGroupController::class, 'generateStudentCardPdf'])->middleware('permission:read');
    });

    Route::prefix('course_price')->group(function () {
        Route::get('/', [CoursePriceController::class, 'index'])->middleware('permission:read');
        Route::post('/', [CoursePriceController::class, 'store'])->middleware('permission:create');
        Route::post('/{coursePrice}', [CoursePriceController::class, 'updateNewPrice'])->middleware('permission:update');
        Route::get('/{coursePrice}', [CoursePriceController::class, 'show'])->middleware('permission:read');
        Route::put('/{coursePrice}', [CoursePriceController::class, 'update'])->middleware('permission:update');
        Route::delete('/{coursePrice}', [CoursePriceController::class, 'destroy'])->middleware('permission:delete');
    });

    Route::prefix('course_attendence')->group(function () {
        Route::get('/', [CourseAttendenceController::class, 'index'])->middleware('permission:read');
        Route::post('/', [CourseAttendenceController::class, 'store'])->middleware('permission:create');
        Route::get('/{courseAttendence}', [CourseAttendenceController::class, 'show'])->middleware('permission:read');
        Route::put('/{courseAttendence}', [CourseAttendenceController::class, 'update'])->middleware('permission:update');
        Route::delete('/{courseAttendence}', [CourseAttendenceController::class, 'destroy'])->middleware('permission:delete');
        Route::get('/course_group/{courseGroupId}', [CourseAttendenceController::class, 'getCourseAttendencesByCourseGroupId'])->middleware('permission:read');
    });

    Route::prefix('student_attendence')->group(function () {
        Route::get('/', [StudentAttendenceController::class, 'index'])->middleware('permission:read');
        Route::get('/course_group/{courseGroupId}', [StudentAttendenceController::class, 'getStudentAttendencesByCourseGroupId'])->middleware('permission:read');
        Route::get('/course_attendence/{courseAttendenceId}', [StudentAttendenceController::class, 'getStudentAttendencesByCourseAttendenceId'])->middleware('permission:read');
        Route::put('/', [StudentAttendenceController::class, 'bulkUpdate'])->middleware('permission:update');
        Route::delete('/{courseAttendenceId}', [StudentAttendenceController::class, 'destroy'])->middleware('permission:delete');
        Route::put('/large_bulk_update', [StudentAttendenceController::class, 'largeBulkUpdate'])->middleware('permission:update');
    });

    Route::prefix('medical_condition')->group(function () {
        Route::get('/', [MedicalConditionController::class, 'index'])->middleware('permission:read');
        Route::post('/', [MedicalConditionController::class, 'store'])->middleware('permission:create');
        Route::get('/{medicalCondition}', [MedicalConditionController::class, 'show'])->middleware('permission:read');
        Route::put('/{medicalCondition}', [MedicalConditionController::class, 'update'])->middleware('permission:update');
        Route::delete('/{medicalCondition}', [MedicalConditionController::class, 'destroy'])->middleware('permission:delete');
    });

    Route::prefix('occupation')->group(function () {
        Route::get('/', [OccupationController::class, 'index'])->middleware('permission:read');
        Route::get('/table', [OccupationController::class, 'table'])->middleware('permission:read');
        Route::get('/{occupation}', [OccupationController::class, 'show'])->middleware('permission:read');
        Route::post('/', [OccupationController::class, 'store'])->middleware('permission:create');
        Route::put('/{occupation}', [OccupationController::class, 'update'])->middleware('permission:update');
        Route::delete('/{occupation}', [OccupationController::class, 'destroy'])->middleware('permission:delete');
    });

    Route::prefix('student_license_complete')->group(function () {
        Route::get('/', [StudentLicenseCompleteController::class, 'index'])->middleware('permission:read');
        Route::get('/table', [StudentLicenseCompleteController::class, 'table'])->middleware('permission:read');
        Route::post('/', [StudentLicenseCompleteController::class, 'store'])->middleware('permission:create');
        Route::post('/bulk', [StudentLicenseCompleteController::class, 'bulkStore'])->middleware('permission:create');
        Route::get('/{studentLicenseComplete}', [StudentLicenseCompleteController::class, 'show'])->middleware('permission:read');
        Route::put('/{studentLicenseComplete}', [StudentLicenseCompleteController::class, 'update'])->middleware('permission:update');
        Route::delete('/{studentLicenseComplete}', [StudentLicenseCompleteController::class, 'destroy'])->middleware('permission:delete');
        Route::get('/course_license_completed_per_year/statistic', [StudentLicenseCompleteController::class, 'getCourseLicenseCompletedPerYear'])->middleware('permission:read');
    });

    Route::prefix('student_license_qual')->group(function () {
        Route::get('/', [StudentLicenseQualController::class, 'index'])->middleware('permission:read');
        Route::get('/table', [StudentLicenseQualController::class, 'table'])->middleware('permission:read');
        Route::post('/', [StudentLicenseQualController::class, 'store'])->middleware('permission:create');
        Route::post('/bulk', [StudentLicenseQualController::class, 'bulkStore'])->middleware('permission:create');
        Route::get('/{studentLicenseQual}', [StudentLicenseQualController::class, 'show'])->middleware('permission:read');
        Route::put('/{studentLicenseQual}', [StudentLicenseQualController::class, 'update'])->middleware('permission:update');
        Route::delete('/{studentLicenseQual}', [StudentLicenseQualController::class, 'destroy'])->middleware('permission:delete');
        Route::get('/unlicensed/table', [StudentLicenseQualController::class, 'getUnlicensedStudents'])->middleware('permission:read');
        Route::post('/pdf-student-qual', [StudentLicenseQualController::class, 'generatePdfStudentQual'])->middleware('permission:read');
    });

    Route::prefix('student')->group(function () {
        Route::get('/', [StudentController::class, 'index'])->middleware('permission:read');
        Route::get('/table', [StudentController::class, 'table'])->middleware('permission:read');
        Route::get('/count', [StudentController::class, 'count'])->middleware('permission:read');
        Route::post('/', [StudentController::class, 'store'])->middleware('permission:create');
        Route::get('/{student}', [StudentController::class, 'show'])->middleware('permission:read');
        Route::get('/{student}/application-form', [StudentController::class, 'generateApplicationForm'])->middleware('permission:read');
        Route::put('/{student}', [StudentController::class, 'update'])->middleware('permission:update');
        Route::delete('/{student}', [StudentController::class, 'destroy'])->middleware('permission:delete');
    });

    Route::prefix('enrollment')->group(function () {
        Route::get('/', [EnrollmentController::class, 'index'])->middleware('permission:read');
        Route::post('/', [EnrollmentController::class, 'store'])->middleware('permission:create');
        Route::get('/course-batches', [EnrollmentController::class, 'getEnrolledStudentsByBatchIds'])->middleware('permission:read');
        Route::get('/course-batch/{courseBatchId}', [EnrollmentController::class, 'getEnrolledStudentsByBatchId'])->middleware('permission:read');
        Route::get('/course_group/{courseGroupId}/all', [EnrollmentController::class, 'getAllEnrollmentByCourseGroupId'])->middleware('permission:read'); // No pagination
        Route::get('/{enrollment}', [EnrollmentController::class, 'show'])->middleware('permission:read');
        Route::patch('/{enrollment}-{studentId}', [EnrollmentController::class, 'update'])->middleware('permission:update');
        Route::delete('/{enrollment}', [EnrollmentController::class, 'destroy'])->middleware('permission:delete');
        Route::get('/course_group/{courseGroupId}/graduate', [EnrollmentController::class, 'getEnrollmentStatusGraduateByBatchId'])->middleware('permission:read');
        Route::get('/course_group/{courseGroupId}', [EnrollmentController::class, 'getEnrollmentStudentStatusByCourseGroupId'])->middleware('permission:read');
    });


    Route::prefix('exam')->group(function () {
        Route::get('/', [ExamController::class, 'index'])->middleware('permission:read');
        Route::post('/', [ExamController::class, 'store'])->middleware('permission:create');
        Route::get('/{exam}', [ExamController::class, 'show'])->middleware('permission:read');
        Route::put('/{exam}', [ExamController::class, 'update'])->middleware('permission:update');
        Route::delete('/{exam}', [ExamController::class, 'destroy'])->middleware('permission:delete');
        Route::get('/course_batch/{courseBatchId}/table', [ExamController::class, 'getExamByCourseBatchId'])->middleware('permission:read');
        Route::post('/course_batch/{courseBatchId}', [ExamController::class, 'addExamToCourseBatch'])->middleware('permission:create');
        Route::get('/{exam_id}/pdf-score', [ExamController::class, 'generatePdfScore'])->middleware('permission:read');
    });

    Route::prefix('exam_invidual')->group(function () {
        Route::post('/', [ExamInvidualController::class, 'addBulk'])->middleware('permission:create');
        Route::put('/{examInvidual}', [ExamInvidualController::class, 'update'])->middleware('permission:update');
        Route::delete('/{examInvidual}', [ExamInvidualController::class, 'destroy'])->middleware('permission:delete');
        Route::get('/{examId}/pdf-score', [ExamInvidualController::class, 'generatePdfScore'])->middleware('permission:read');
    });

    Route::prefix('exam_type')->group(function () {
        Route::get('/', [ExamTypeController::class, 'index'])->middleware('permission:read');
        Route::get('/table', [ExamTypeController::class, 'table'])->middleware('permission:read');
        Route::post('/', [ExamTypeController::class, 'store'])->middleware('permission:create');
        Route::get('/{examType}', [ExamTypeController::class, 'show'])->middleware('permission:read');
        Route::put('/{examType}', [ExamTypeController::class, 'update'])->middleware('permission:update');
        Route::delete('/{examType}', [ExamTypeController::class, 'destroy'])->middleware('permission:delete');
    });

    Route::prefix('marital_status')->group(function () {
        Route::get('/', [MaritalStatusController::class, 'index'])->middleware('permission:read');
        Route::get('/table', [MaritalStatusController::class, 'table'])->middleware('permission:read');
        Route::post('/', [MaritalStatusController::class, 'store'])->middleware('permission:create');
        Route::get('/{maritalStatus}', [MaritalStatusController::class, 'show'])->middleware('permission:read');
        Route::put('/{maritalStatus}', [MaritalStatusController::class, 'update'])->middleware('permission:update');
        Route::delete('/{maritalStatus}', [MaritalStatusController::class, 'destroy'])->middleware('permission:delete');
    });

    Route::prefix('province')->group(function () {
        Route::get('/', [ProvinceController::class, 'index'])->middleware('permission:read');
    });

    Route::prefix('province/{provinceId}/district')->group(function () {
        Route::get('/', [DistrictController::class, 'index'])->middleware('permission:read');
    });

    Route::prefix('district/{districtId}/sub_district')->group(function () {
        Route::get('/', [SubDistrictController::class, 'index'])->middleware('permission:read');
    });

    Route::prefix('prename')->group(function () {
        Route::get('/', [PrenameController::class, 'index'])->middleware('permission:read');
        Route::get('/table', [PrenameController::class, 'table'])->middleware('permission:read');
        Route::post('/', [PrenameController::class, 'store'])->middleware('permission:create');
        Route::get('/{prename}', [PrenameController::class, 'show'])->middleware('permission:read');
        Route::put('/{prename}', [PrenameController::class, 'update'])->middleware('permission:update');
        Route::delete('/{prename}', [PrenameController::class, 'destroy'])->middleware('permission:delete');
    });

    Route::prefix('education_qual')->group(function () {
        Route::get('/', [EducationQualController::class, 'index'])->middleware('permission:read');
        Route::get('/table', [EducationQualController::class, 'table'])->middleware('permission:read');
        Route::post('/', [EducationQualController::class, 'store'])->middleware('permission:create');
        Route::get('/{educationQual}', [EducationQualController::class, 'show'])->middleware('permission:read');
        Route::put('/{educationQual}', [EducationQualController::class, 'update'])->middleware('permission:update');
        Route::delete('/{educationQual}', [EducationQualController::class, 'destroy'])->middleware('permission:delete');
    });

    Route::prefix('bill_info')->group(function () {
        Route::get('/', [BillInfoController::class, 'index'])->middleware('permission:read');
        Route::post('/', [BillInfoController::class, 'store'])->middleware('permission:create');
        Route::get('/get-latest-bill-vol', [BillInfoController::class, 'getLatestBillVol'])->middleware('permission:read');
        Route::get('/get-bill-info/{courseBatchId}', [BillInfoController::class, 'getBillInfo'])->middleware('permission:read');
        Route::get('/get_bill_info_paid/course_group/{courseBatchId}', [BillInfoController::class, 'getBillInfoPaid'])->middleware('permission:read');
        Route::post('/pdf-bill', [BillInfoController::class, 'generatePdfBill'])->middleware('permission:read');
        Route::get('/{billInfoVol}-{billInfoNo}', [BillInfoController::class, 'show'])->middleware('permission:read');
        Route::put('/{billInfoId}-{billInfoNo}-{courseGroupId}', [BillInfoController::class, 'update'])->middleware('permission:update');
        Route::delete('/{billInfoId}-{billInfoNo}', [BillInfoController::class, 'delete'])->middleware('permission:delete');
    });

    Route::prefix('course_completion')->group(function () {
        Route::get('/', [CourseCompletionController::class, 'index'])->middleware('permission:read');
        Route::post('/', [CourseCompletionController::class, 'store'])->middleware('permission:create');
        Route::get('/table', [CourseCompletionController::class, 'getCourseCompletionTable'])->middleware('permission:read');
        Route::get('/unqualified/table', [CourseCompletionController::class, 'getUnqualifiedCompletions'])->middleware('permission:read');
        Route::put('/{courseCompletionId}', [CourseCompletionController::class, 'update'])->middleware('permission:update');
        Route::get('/certificate/statistic', [CourseCompletionController::class, 'getCertificateStatistic'])->middleware('permission:read');
        Route::delete('/{courseCompletionId}', [CourseCompletionController::class, 'destroy'])->middleware('permission:delete');
        Route::get('/completed/statistic/', [CourseCompletionController::class, 'getCourseCompletedStatistic'])->middleware('permission:read');
        Route::get('/completed_and_take_certificate/statistic', [CourseCompletionController::class, 'getCourseCompletedAndTakeCertificateStatistic'])->middleware('permission:read');
        Route::get('/pdf-student-certificate/{courseCompletionId}', [CourseCompletionController::class, 'generatePdfStudentCertificate'])->middleware('permission:read');
        Route::post('/pdf-student-completion', [CourseCompletionController::class, 'generatePdfStudentCompletion'])->middleware('permission:read');

    });

    Route::prefix('user')->group(function () {
        Route::get('/table', [UserController::class, 'table'])->middleware('permission:read');
        Route::get('/{user}', [UserController::class, 'show'])->middleware('permission:read');
        Route::put('/{user}', [UserController::class, 'update'])->middleware('permission:update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->middleware('permission:delete');
    });

    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::post('/set-password', [SetPasswordController::class, 'setPassword']);
    Route::post('/reset-password', [EmployeeController::class, 'resetPassword']);
});
