<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\JsonResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\ImageService;
use Illuminate\Support\Facades\DB;
class UserController extends Controller
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
    public function index()
    {
        //
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    public function table(Request $request): JsonResponse
    {
        $search = $request->input('search');
        $users = User::where('role_id', '!=', 1)
            ->where('firstname', 'like', '%' . $search . '%')
            ->orWhere('lastname', 'like', '%' . $search . '%')
            ->orWhere('email', 'like', '%' . $search . '%')
            ->select('id', 'firstname', 'lastname', 'email', 'role_id', 'profile_img', 'created_at', 'updated_at')
            ->paginate(10);
        return $this->successResponse($users, 'Users retrieved successfully', 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        \Log::info($request->all());
        try {
            DB::beginTransaction();
            if ($request->has(key: 'is_remove_image') && ($request->is_remove_image === 'true' || $request->is_remove_image === true)) {
                if ($user->profile_img) {
                    $this->imageService->deleteUserProfile($user->profile_img);
                    $user->profile_img = null;
                    $user->save();
                }
            } else if ($request->hasFile('profile_image')) {
                if ($user->profile_img) {
                    $this->imageService->deleteUserProfile($user->profile_img);
                }
                $fileName = $this->imageService->uploadUserProfileImage(
                    $request->file('profile_image'),
                    $user->id
                );
                $user->profile_img = $fileName;
                $user->save();
            }
            $user->update($request->except(['profile_image']));
            DB::commit();
            return $this->successResponse($user, 'User updated successfully', 200);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return $this->successResponse($user, 'User deleted successfully', 200);
    }
}
