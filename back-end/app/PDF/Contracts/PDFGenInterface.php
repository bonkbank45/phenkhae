<?php

namespace App\PDF\Contracts;

interface PDFGenInterface
{
    public function generate(object $data): string;
}