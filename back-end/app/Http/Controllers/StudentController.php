<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Traits\JsonResponseTrait;
use Illuminate\Http\Request;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\PDF\Generators\Templates\ApplicationFormGenerator;
use App\Services\ImageService;
use App\Services\EnrollmentService;
use Exception;
class StudentController extends Controller
{
    use JsonResponseTrait;
    protected $imageService;
    protected $enrollmentService;

    public function __construct(ImageService $imageService, EnrollmentService $enrollmentService)
    {
        $this->imageService = $imageService;
        $this->enrollmentService = $enrollmentService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $students = Student::all();
        return $this->successResponse($students, 'Students fetched successfully', 200);
    }

    /**
     * แสดงตารางของนักเรียนแบบมี pagination
     */
    public function table(Request $request)
    {
        $request->validate([
            'age_range' => 'nullable|string|in:all,20-30,31-40,41-50,51+',
            'experience' => 'nullable|string|in:all,hasExpLearn,hasExpWork',
            'recently_added' => 'nullable|string|in:all,today,yesterday,last7days,last30days',
            'search' => 'nullable|string|max:255',
            'education' => 'nullable|string|in:all,below,bachelor,above',
            'course_group_id' => 'nullable|integer|exists:course_groups,id',
            'page' => 'required|integer|min:1',
        ]);

        $query = Student::search($request->search);

        $filters = [
            'age_range' => 'filterAgeRange',
            'experience' => 'filterExperience',
            'recently_added' => 'filterRecentlyAdded',
            'education' => 'filterEducation',
        ];

        foreach ($filters as $param => $method) {
            if ($request->has($param)) {
                $query->{$method}($request->$param);
            }
        }

        if ($request->has('course_group_id')) {
            $query->whereDoesntHave('enrollments', function ($query) use ($request) {
                $query->where('course_group_id', $request->course_group_id);
            });
        }
        $students = $query->paginate(10);
        return $this->successResponse($students, 'Students fetched successfully', 200);
    }

    /**
     * นับจำนวนนักเรียนทั้งหมดในระบบ
     * 
     * @return JsonResponse
     */
    public function count(): JsonResponse
    {
        try {
            $count = Student::count();
            return $this->successResponse(['total' => $count], 'Students count fetched successfully', 200);
        } catch (Exception $e) {
            return $this->errorResponse('Error counting students: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            if ($request->hasFile('profile_image')) {
                $student = Student::create($request->all());
                $fileName = $this->imageService->uploadStudentProfileImage(
                    $request->file('profile_image'),
                    $student->id
                );
                $student->profile_image = $fileName;
                $student->save();
            } else {
                $student = Student::create($request->all());
            }

            if ($request->has('course_batch_id_register')) {
                $enrollments = [];
                foreach ($request->course_batch_id_register as $courseBatchId) {
                    $enrollments = $this->enrollmentService
                        ->storeEnrollment($courseBatchId, [$student->id]);
                }
                Enrollment::insert($enrollments);
            }

            DB::commit();
            return $this->successResponse($student, 'Student created successfully', 201);

        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 404);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Error processing student data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $student = Student::with([
                'prename',
                'birth_province',
                'subdistrict' => function ($query) {
                    $query->select(['id', 'name_in_thai', 'name_in_english', 'district_id', 'zip_code']);
                },
                'subdistrict.districts' => function ($query) {
                    $query->select(['id', 'name_in_thai', 'name_in_english', 'province_id']);
                },
                'subdistrict.districts.provinces' => function ($query) {
                    $query->select(['id', 'name_in_thai', 'name_in_english']);
                },
                'occupation',
                'edu_qual' => function ($query) {
                    $query->select(['id', 'edu_qual_name', 'edu_qual_eng']);
                },
                'marital_status',
                'medical_condition',
                'enrollments',
                'enrollments.course_group',
                'enrollments.course_group.course',
                'bill_infos'
            ])->findOrFail($id);
            return $this->successResponse($student, 'Student fetched successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentRequest $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $student = Student::findOrFail($id);
            if ($request->has(key: 'is_remove_image') && $request->is_remove_image === true) {
                if ($student->profile_image) {
                    $this->imageService->deleteStudentProfile($student->profile_image);
                    $student->profile_image = null;
                    $student->save();
                }
            } else if ($request->hasFile('profile_image')) {
                if ($student->profile_image) {
                    $this->imageService->deleteStudentProfile($student->profile_image);
                }
                $fileName = $this->imageService->uploadStudentProfileImage(
                    $request->file('profile_image'),
                    $student->id
                );
                $student->profile_image = $fileName;
                $student->save();
            }
            $student->update($request->except(['profile_image']));
            DB::commit();
            return $this->successResponse($student, 'Student updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 404);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $student = Student::findOrFail($id);
            if ($student->profile_image) {
                $this->imageService->deleteStudentProfile($student->profile_image);
            }
            $student->delete();
            DB::commit();
            return $this->successResponse(null, 'Student deleted successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage() . " - Student not found", 404);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage() . " - Error deleting student", 500);
        }
    }

    public function generateApplicationForm(int $id, ApplicationFormGenerator $pdfGenerator)
    {
        try {
            $student = Student::findOrFail($id);
            $pdfContent = $pdfGenerator->generate($student);
            return response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="application-form.pdf"',
            ]);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
}
