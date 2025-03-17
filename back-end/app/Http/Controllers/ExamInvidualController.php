<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExamInvidual;
use App\Models\Exam;
use App\Traits\JsonResponseTrait;
use Mpdf\Mpdf;
use Carbon\Carbon;
use Exception;

class ExamInvidualController extends Controller
{
    use JsonResponseTrait;

    public function addBulk(Request $request)
    {
        $request->validate([
            'score' => 'integer|min:0',
        ]);
        try {
            $examId = $request->input('id');
            $exam = Exam::findOrFail($examId);
            $students = collect($request->except('id'));
            $scoreFull = $exam->score_full;
            $errors = [];

            foreach ($students as $studentId => $item) {
                if ($item['selected'] === true && $item['score'] > $scoreFull) {
                    $errors[] = "คะแนนของนักเรียนรหัส " . strval($studentId) . " เกินคะแนนเต็ม ({$scoreFull} คะแนน)";
                }
            }

            if (!empty($errors)) {
                return $this->errorResponse(implode(', ', $errors), 400);
            }

            $bulkData = $students->map(function ($item, $studentId) use ($examId) {
                if ($item['selected'] !== true) {
                    return null;
                }
                return [
                    'exam_id' => $examId,
                    'student_id' => $studentId,
                    'score_get' => $item['score'],
                    'date_exam' => Carbon::now(),
                ];
            })->filter()->values()->all();

            ExamInvidual::insert($bulkData);
            return $this->successResponse('บันทึกคะแนนสำเร็จ', 200);

        } catch (\Exception $e) {
            return $this->errorResponse('เกิดข้อผิดพลาด: ' . $e->getMessage(), 500);
        }
    }

    public function update(Request $request, ExamInvidual $examInvidual)
    {
        $request->validate([
            'score' => 'integer|min:0',
        ]);
        $examInvidual->update($request->all());
        return $this->successResponse('บันทึกคะแนนสำเร็จ', 200);
    }

    public function destroy(int $id)
    {
        $examInvidual = ExamInvidual::find($id);
        $examInvidual->delete();
        return $this->successResponse('ลบคะแนนสำเร็จ', 200);
    }

    public function generatePdfScore(int $examId)
    {
        try {
            $exam = Exam::with('exam_type', 'course_group', 'course_group.course')->findOrFail($examId);
            $examInviduals = ExamInvidual::with('student')->where('exam_id', $examId)->get();
            $html = view('pdfs.score_new', [
                'examInviduals' => $examInviduals,
                'exam' => $exam,
            ])->render();

            $mpdf = new Mpdf(config('pdf'));
            $mpdf->WriteHTML($html);
            return response($mpdf->Output('score.pdf', 'S'), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="score.pdf"',
            ]);
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
