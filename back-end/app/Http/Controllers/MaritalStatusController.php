<?php

namespace App\Http\Controllers;

use App\Traits\JsonResponseTrait;
use Illuminate\Http\Request;
use App\Models\MaritalStatus;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreMaritalStatusRequest;
use App\Http\Requests\UpdateMaritalStatusRequest;

class MaritalStatusController extends Controller
{
    use JsonResponseTrait;

    public function index()
    {
        $maritalStatuses = MaritalStatus::all();
        return $this->successResponse($maritalStatuses);
    }

    public function table(Request $request)
    {
        $search = $request->input('search');
        $maritalStatuses = MaritalStatus::where('marital_name', 'like', '%' . $search . '%')
            ->orWhere('id', 'like', '%' . $search . '%')->paginate(10);
        return $this->successResponse($maritalStatuses);
    }

    public function store(StoreMaritalStatusRequest $request)
    {
        $maritalStatus = MaritalStatus::create($request->all());
        return $this->successResponse($maritalStatus, 'Marital status created successfully', 200);
    }

    public function update(UpdateMaritalStatusRequest $request)
    {
        try {
            $maritalStatus = MaritalStatus::find($request->id);
            $maritalStatus->update($request->all());
            return $this->successResponse($maritalStatus, 'Marital status updated successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Marital status not found', 404);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    public function destroy(MaritalStatus $maritalStatus)
    {
        $maritalStatus->delete();
        return $this->successResponse('Marital status deleted successfully');
    }
}
