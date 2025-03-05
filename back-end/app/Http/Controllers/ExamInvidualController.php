<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExamInvidual;
use App\Traits\JsonResponseTrait;

use Carbon\Carbon;


class ExamInvidualController extends Controller
{
    use JsonResponseTrait;

    public function addBulk(Request $request)
    {
        try {
            $examId = $request->input('id');
            $students = collect($request->except('id'));

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
        $examInvidual->update($request->all());
        return $this->successResponse('บันทึกคะแนนสำเร็จ', 200);
    }

    public function destroy(int $id)
    {
        $examInvidual = ExamInvidual::find($id);
        $examInvidual->delete();
        return $this->successResponse('ลบคะแนนสำเร็จ', 200);
    }
}
