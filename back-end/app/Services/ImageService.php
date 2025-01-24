<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageService
{
    public function uploadStudentProfileImage(UploadedFile $image, string $studentId)
    {
        $fileName = 'student_profile_image_' . $studentId;
        $path = storage_path('app/public/profiles/students/' . $fileName);

        // create image manager with desired driver
        $manager = new ImageManager(new Driver());

        // read image from uploaded file
        $imageContent = $manager->read(file_get_contents($image));

        // resize image proportionally to 800px width
        $imageContent->scale(width: 800);

        // save resized image directly to storage
        $imageContent->toJpeg(80)->save($path);

        return $fileName;
    }

    public function deleteStudentProfile(?string $fileName): void
    {
        if ($fileName) {
            Storage::delete('public/profiles/students/' . $fileName);
        }
    }
}




