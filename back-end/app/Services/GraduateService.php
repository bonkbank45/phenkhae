<?php

namespace App\Services;

use App\Models\CourseGroup;
use App\Models\Enrollment;
use App\Exceptions\ValidationException;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GraduateService
{
    public function prepareGraduationStatement(int $courseGroupId, int $studentId, string $completionDate): array
    {
        $courseGroup = $this->getCourseGroup($courseGroupId);
        $graduationStatus = $this->checkGraduationStatus($courseGroup, $studentId);

        if (!$graduationStatus['is_graduated']) {
            $errors = $this->getFailureReasons($graduationStatus['details']);
            throw new ValidationException('ไม่สามารถจบการศึกษาได้', $errors);
        }

        return $this->prepareStatement($courseGroup, $studentId, $completionDate);
    }

    public function checkGraduationStatus(CourseGroup $courseGroup, int $studentId): array
    {
        $enrollment = $this->getEnrollment($courseGroup->id, $studentId);
        $attendance = $this->getAttendanceData($courseGroup->id, $studentId);

        $isGraduated = $enrollment->theoretical_score >= $courseGroup->theoretical_score_criteria
            && $enrollment->practical_score >= $courseGroup->practical_score_criteria
            && ($attendance->present_count / $attendance->total_classes * 100) >= 80;

        return [
            'is_graduated' => $isGraduated,
            'details' => [
                'theoretical' => [
                    'score' => $enrollment->theoretical_score,
                    'criteria' => $courseGroup->theoretical_score_criteria,
                    'passed' => $enrollment->theoretical_score >= $courseGroup->theoretical_score_criteria
                ],
                'practical' => [
                    'score' => $enrollment->practical_score,
                    'criteria' => $courseGroup->practical_score_criteria,
                    'passed' => $enrollment->practical_score >= $courseGroup->practical_score_criteria
                ],
                'attendance' => [
                    'percentage' => ($attendance->present_count / $attendance->total_classes * 100),
                    'passed' => ($attendance->present_count / $attendance->total_classes * 100) >= 80
                ]
            ]
        ];
    }

    private function getCourseGroup(int $courseGroupId): CourseGroup
    {
        return CourseGroup::findOrFail($courseGroupId);
    }

    private function getEnrollment(int $courseGroupId, int $studentId): Enrollment
    {
        return Enrollment::where('course_group_id', $courseGroupId)
            ->where('student_id', $studentId)
            ->firstOrFail();
    }

    private function getAttendanceData(int $courseGroupId, int $studentId): object
    {
        $attendance = DB::select("
            SELECT 
                enrollments.student_id,
                COUNT(course_attendences.id) as total_classes,
                SUM(CASE WHEN COALESCE(student_attendences.status,0) = 1 THEN 1 ELSE 0 END) AS present_count,
                SUM(CASE WHEN COALESCE(student_attendences.status,0) = 0 THEN 1 ELSE 0 END) as absent_count
            FROM enrollments
            LEFT JOIN course_attendences 
                ON enrollments.course_group_id = course_attendences.course_group_id
            LEFT JOIN student_attendences
                ON course_attendences.id = student_attendences.course_attendence_id 
                AND enrollments.student_id = student_attendences.student_id
            WHERE course_attendences.course_group_id = ?
            AND enrollments.student_id = ?
            GROUP BY student_id
        ", [$courseGroupId, $studentId]);

        if (empty($attendance)) {
            throw new ValidationException('ไม่พบข้อมูลการเข้าเรียน');
        }

        return $attendance[0];
    }

    private function calculateGraduationDetails(
        CourseGroup $courseGroup,
        Enrollment $enrollment,
        object $attendance
    ): array {
        $theoreticalDetails = $this->checkTheoreticalScore($courseGroup, $enrollment);
        $practicalDetails = $this->checkPracticalScore($courseGroup, $enrollment);
        $attendanceDetails = $this->checkAttendance($attendance);

        return [
            'theoretical' => $theoreticalDetails,
            'practical' => $practicalDetails,
            'attendance' => $attendanceDetails
        ];
    }

    private function checkTheoreticalScore(CourseGroup $courseGroup, Enrollment $enrollment): array
    {
        return [
            'score' => $enrollment->theoretical_score,
            'criteria' => $courseGroup->theoretical_score_criteria,
            'passed' => $enrollment->theoretical_score >= $courseGroup->theoretical_score_criteria
        ];
    }

    private function checkPracticalScore(CourseGroup $courseGroup, Enrollment $enrollment): array
    {
        return [
            'score' => $enrollment->practical_score,
            'criteria' => $courseGroup->practical_score_criteria,
            'passed' => $enrollment->practical_score >= $courseGroup->practical_score_criteria
        ];
    }

    private function checkAttendance(object $attendance): array
    {
        $attendancePercentage = $attendance->total_classes > 0
            ? ($attendance->present_count / $attendance->total_classes) * 100
            : 0;

        return [
            'percentage' => round($attendancePercentage, 2),
            'present' => $attendance->present_count,
            'total' => $attendance->total_classes,
            'absent' => $attendance->absent_count,
            'passed' => $attendancePercentage >= 80
        ];
    }

    private function isGraduated(array $details): bool
    {
        return $details['theoretical']['passed']
            && $details['practical']['passed']
            && $details['attendance']['passed'];
    }

    private function getFailureReasons(array $details): array
    {
        $reasons = [];

        if (!$details['theoretical']['passed']) {
            $reasons[] = sprintf(
                'คะแนนภาคทฤษฎีไม่ผ่านเกณฑ์ (ได้ %.2f ต้องการ %.2f)',
                $details['theoretical']['score'],
                $details['theoretical']['criteria']
            );
        }

        if (!$details['practical']['passed']) {
            $reasons[] = sprintf(
                'คะแนนภาคปฏิบัติไม่ผ่านเกณฑ์ (ได้ %.2f ต้องการ %.2f)',
                $details['practical']['score'],
                $details['practical']['criteria']
            );
        }

        if (!$details['attendance']['passed']) {
            $reasons[] = sprintf(
                'การเข้าเรียนไม่ผ่านเกณฑ์ (%.2f%% จากที่ต้องการ 80%%)',
                $details['attendance']['percentage']
            );
        }

        return $reasons;
    }

    private function prepareStatement(CourseGroup $courseGroup, int $studentId, string $completionDate): array
    {
        return [
            'student_id' => $studentId,
            'course_group_id' => $courseGroup->id,
            'date_start' => $courseGroup->date_start,
            'date_end' => $courseGroup->date_end,
            'completion_date' => Carbon::createFromFormat('d/m/Y', $completionDate)->format('Y-m-d'),
        ];
    }
}

