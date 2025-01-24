<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Traits\JsonResponseTrait;
use Illuminate\Http\Request;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\PDF\Generators\Templates\ApplicationFormGenerator;
use App\Services\ImageService;
use Exception;

class StudentController extends Controller
{
    use JsonResponseTrait;
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $students = Student::all();
        return $this->successResponse($students, 'Students fetched successfully', 200);
    }

    public function table(Request $request)
    {
        $query = Student::search($request->search);

        if ($request->has('age_range')) {
            $query->filterAgeRange($request->age_range);
        }

        if ($request->has('experience')) {
            $query->filterExperience($request->experience);
        }

        if ($request->has('recently_added')) {
            $query->filterRecentlyAdded($request->recently_added);
        }

        if ($request->has('education')) {
            $query->filterEducation($request->education);
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
                'medical_condition',
                'enrollments',
                'enrollments.course_group'
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
            if ($request->hasFile('profile_image')) {
                $this->imageService->deleteStudentProfile($student->profile_image);
                $fileName = $this->imageService->uploadStudentProfileImage(
                    $request->file('profile_image'),
                    $student->id
                );
                $student->profile_image = $fileName;
                $student->save();
            }

            $student->update($request->all());
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
        DB::beginTransaction();
        try {
            $student = Student::findOrFail($id);
            $student->delete();
            DB::commit();
            return $this->successResponse(null, 'Student deleted successfully', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    public function generateApplicationForm(int $id, ApplicationFormGenerator $pdfGenerator)
    {
        try {
            $student = Student::findOrFail($id);
            $pdfGenerator->generate($student);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }

        // $mpdf = new Mpdf(config('pdf'));
        // $html = View::make('pdfs.application-form')->render();
        // $mpdf->WriteHTML($html);
        // $mpdf->Output('application-form.pdf', 'D');
    }
}
