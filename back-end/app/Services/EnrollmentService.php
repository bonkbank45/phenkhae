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

    public function removeEnrollment(int $courseGroupId, array $studentIds)
    {
        $courseGroup = $this->getCourseGroupWithValidation($courseGroupId);
        $this->validateRemoveEnrollments($courseGroup, $studentIds);

        return Enrollment::where('course_group_id', $courseGroupId)
            ->whereIn('student_id', $studentIds);
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

    private function validateRemoveEnrollments(CourseGroup $courseGroup, array $studentIds)
    {
        $existingEnrollments = Enrollment::where('course_group_id', $courseGroup->id)
            ->whereIn('student_id', $studentIds)
            ->exists();
        if (!$existingEnrollments) {
            throw new EnrollmentException('Student not enrolled in this course group');
        }
    }

    private function prepareEnrollments(CourseGroup $courseGroup, array $studentIds): array
    {
        $now = now();
        $enrollments = [];
        $courseIdsWithNoReg = [7, 8, 9, 10];
        $currentNoReg = null;

        if (in_array($courseGroup->course_id, $courseIdsWithNoReg)) {
            $dateStart = CourseGroup::where('id', $courseGroup->id)
                ->value('date_start');

            $currentNoReg = Enrollment::whereYear('date_start', Carbon::parse($dateStart)->year)
                ->count();
        }

        foreach ($studentIds as $index => $studentId) {
            $enrollments[] = [
                'course_group_id' => $courseGroup->id,
                'student_id' => $studentId,
                'no_reg' => $currentNoReg !== null ? ($currentNoReg + $index + 1) : null,
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
