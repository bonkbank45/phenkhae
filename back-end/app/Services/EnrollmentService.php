<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\CourseGroup;
use Carbon\Carbon;
use App\Exceptions\EnrollmentException;

class enrollmentService
{
    public function storeEnrollment(int $courseGroupId, array $studentIds)
    {
        $courseGroup = $this->getCourseGroupWithValidation($courseGroupId);
        $this->validateEnrollments($courseGroup, $studentIds);

        return $this->prepareEnrollments($courseGroup, $studentIds);
    }

    private function getCourseGroupWithValidation(int $courseGroupId)
    {
        $courseGroup = CourseGroup::with(['course.latest_course_price'])
            ->findOrFail($courseGroupId);

        if (!$courseGroup->course->latest_course_price) {
            throw new EnrollmentException('Course price not found');
        }
        return $courseGroup;
    }

    private function validateEnrollments(CourseGroup $courseGroup, array $studentIds)
    {
        // ตรวจสอบจำนวนนักเรียน
        $currentEnrollments = Enrollment::where('course_group_id', $courseGroup->id)->count();
        if ($currentEnrollments + count($studentIds) > $courseGroup->max_students) {
            throw new EnrollmentException('Course group is full');
        }

        //ตรวจสอบการลงทะเบียนซ้ำ
        $existingEnrollments = Enrollment::where('course_group_id', $courseGroup->id)
            ->whereIn('student_id', $studentIds)
            ->exists();
        if ($existingEnrollments) {
            throw new EnrollmentException('Student already enrolled in this course group');
        }
    }

    private function prepareEnrollments(CourseGroup $courseGroup, array $studentIds): array
    {
        $now = now();
        $enrollments = [];

        foreach ($studentIds as $studentId) {
            $enrollments[] = [
                'course_group_id' => $courseGroup->id,
                'student_id' => $studentId,
                'activity_case_status' => 0,
                'enrollment_date' => $now,
                'date_start' => $courseGroup->date_start,
                'date_end' => null,
                'course_price_id' => $courseGroup->course->latest_course_price->id,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        return $enrollments;
    }
}