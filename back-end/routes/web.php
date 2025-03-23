<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
// Route::get('/', function () {
//     return ['Laravel' => app()->version()];
// });
Route::get('/{any}', function () {
    $path = public_path('index.html');

    if (!File::exists($path)) {
        abort(404);
    }

    return Response::file($path);
})->where('any', '.*');

require __DIR__ . '/auth.php';