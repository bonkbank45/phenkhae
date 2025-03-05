<?php

namespace App\Http\Controllers;

use App\Traits\JsonResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\Models\BillInfo;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreBillInfoRequest;
use App\Http\Requests\UpdateBillInfoRequest;
use Mpdf\Mpdf;
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

    public function update(UpdateBillInfoRequest $request, $vol, $no, $courseGroupId): JsonResponse
    {
        DB::beginTransaction();
        try {
            $billInfo = BillInfo::where('vol', $vol)
                ->where('no', $no)
                ->where('course_group_id', $courseGroupId)
                ->firstOrFail();

            // Can't use Model->update() directly because this table has composite key (ORM not support)
            BillInfo::where('vol', $vol)
                ->where('no', $no)
                ->where('course_group_id', $courseGroupId)
                ->update($request->validated());

            $billInfo = BillInfo::where('vol', $vol)
                ->where('no', $no)
                ->where('course_group_id', $courseGroupId)
                ->first();

            DB::commit();
            return $this->successResponse($billInfo, 'Update bill info success', 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return $this->errorResponse('Bill info not found', 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function delete($vol, $no): JsonResponse
    {
        try {
            DB::beginTransaction();

            BillInfo::where('vol', $vol)
                ->where('no', $no)
                ->delete();

            DB::commit();
            return $this->successResponse([], 'Delete bill info success', 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function getBillInfo(Request $request, $courseBatchId): JsonResponse
    {
        $data = DB::table('courses')
            ->rightJoin('course_prices', 'courses.id', '=', 'course_prices.course_id')
            ->join('course_category_bills', 'courses.course_category_bill_id', '=', 'course_category_bills.id')
            ->join('course_groups', 'courses.id', '=', 'course_groups.course_id')
            ->join('enrollments as en', function ($join) {
                $join->on('course_groups.id', '=', 'en.course_group_id')
                    ->on('course_prices.id', '=', 'en.course_price_id');
            })
            ->leftJoin('bill_infos', function ($join) {
                $join->on('en.student_id', '=', 'bill_infos.student_id')
                    ->on('en.course_group_id', '=', 'bill_infos.course_group_id');
            })
            ->join('students', 'en.student_id', '=', 'students.id')
            ->where('en.course_group_id', $courseBatchId) // Use dynamic parameter
            ->select([
                'courses.id as course_id',
                'courses.course_name',
                'course_category_bills.id as course_category_bill_id',
                'course_category_bills.category_bill_name as course_category_bill_name',
                'en.course_group_id',
                'en.student_id',
                'students.firstname_tha',
                'students.lastname_tha',
                'en.activity_case_status',
                'en.enrollment_date as enrollment_date',
                'en.date_start as enrollment_date_start',
                'en.date_end as enrollment_date_end',
                'en.course_group_id',
                'en.created_at as enrollments_created_at',
                'en.updated_at as enrollments_updated_at',
                'bill_infos.vol as bill_infos_vol',
                'bill_infos.no as bill_infos_no',
                'bill_infos.bill_receiver as bill_infos_receiver',
                'bill_infos.note as bill_infos_note',
                'bill_infos.date_submit as bill_infos_date',
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

        if (!$billInfo) {
            return $this->successResponse(['vol' => 1, 'no' => 0], 'Get latest bill vol and no success', 200);
        }
        return $this->successResponse($billInfo, 'Get latest bill vol and no success', 200);
    }

    public function getBillInfoPaid(int $courseBatchId): JsonResponse
    {
        $bills = DB::table('bill_infos')
            ->where('course_group_id', $courseBatchId)
            ->orWhere(function ($query) use ($courseBatchId) {
                $query->whereIn(DB::raw('(vol, no)'), function ($subQuery) use ($courseBatchId) {
                    $subQuery->selectRaw('vol, no')
                        ->from('bill_infos')
                        ->where('course_group_id', $courseBatchId);
                });
            })
            ->get();
        return $this->successResponse($bills, 'Get bill info paid success', 200);
    }

    public function generatePdfBill(Request $request)
    {
        $mpdf = new Mpdf(config('pdf'));
        $html = view('pdfs.bill', [
            'vol' => $request->vol,
            'no' => $request->no,
        ])->render();
        $mpdf->WriteHTML($html);
        $mpdf->Output('bill.pdf', 'S');
        return response($mpdf->Output('bill.pdf', 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="bill.pdf"',
        ]);
    }
}
