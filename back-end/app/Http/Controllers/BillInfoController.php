<?php

namespace App\Http\Controllers;

use App\Traits\JsonResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\Models\BillInfo;
use App\Http\Requests\StoreBillInfoRequest;
use App\Http\Requests\UpdateBillInfoRequest;
class BillInfoController extends Controller
{
    use JsonResponseTrait;

    public function index(): JsonResponse
    {
        $billInfos = BillInfo::all();
        return $this->successResponse($billInfos, 'Get bill info success', 200);
    }

    public function store(StoreBillInfoRequest $request): JsonResponse
    {
        $data = $request->all();
        $billInfo = BillInfo::create($data);
        return $this->successResponse($billInfo, 'Add bill info success', 200);
    }

    public function getBillInfo(Request $request, $courseBatchId): JsonResponse
    {
        $data = DB::table('courses')
            ->rightJoin('course_prices', 'courses.id', '=', 'course_prices.course_id')
            ->join('course_groups', 'courses.id', '=', 'course_groups.course_id')
            ->join('enrollments as en', 'course_groups.id', '=', 'en.course_group_id')
            ->leftJoin('bill_infos', function ($join) {
                $join->on('en.student_id', '=', 'bill_infos.student_id')
                    ->on('en.course_group_id', '=', 'bill_infos.course_group_id');
            })
            ->join('students', 'en.student_id', '=', 'students.id')
            ->where('en.course_group_id', $courseBatchId)
            ->select([
                'en.course_group_id',
                'en.student_id',
                'students.firstname_tha',
                'students.lastname_tha',
                'en.activity_case_status',
                'en.enrollment_date as enrollment_date',
                'en.date_start as enrollment_date_start',
                'en.date_end as enrollment_date_end',
                'en.created_at as enrollments_created_at',
                'en.updated_at as enrollments_updated_at',
                'bill_infos.vol as bill_infos_vol',
                'bill_infos.no as bill_infos_no',
                'bill_infos.date_submit',
                'bill_infos.created_at as bill_infos_create_at',
                'bill_infos.updated_at as bill_infos_updated_at',
                'course_prices.price as course_price',
            ])
            ->paginate(10);
        return $this->successResponse($data, 'Get bill info success', 200);
    }

    public function getLatestBillVol(): JsonResponse
    {
        $billInfo = BillInfo::select('vol', 'no')
            ->orderBy('vol', 'desc')
            ->orderBy('no', 'desc')
            ->first();
        return $this->successResponse($billInfo, 'Get latest bill vol and no success', 200);
    }
}
