<?php

namespace App\PDF\Generators\Templates;

use App\Models\Student;
use App\Presenters\StudentApplicationFormPresenter;
use App\PDF\Contracts\PDFGenInterface;
use Mpdf\Mpdf;

class ApplicationFormGenerator implements PDFGenInterface
{
    private Mpdf $pdf;

    public function __construct()
    {
        $this->pdf = new Mpdf(config('pdf'));
        $this->pdf->useSubstitutions = true;
    }

    public function generate(object $data): string
    {
        if (!$data instanceof Student) {
            throw new \InvalidArgumentException('Data must be instance of Student');
        }

        $this->setupPage();
        $this->writeContent($data);
        $this->pdf->Line(30, 53, 53, 53);
        $this->pdf->Line(46, 60, 65, 60);
        return $this->pdf->Output();
    }

    private function setupPage(): void
    {
        $this->pdf->AddPage();
        $pagecount = $this->pdf->SetSourceFile(resource_path('views/pdfs/application-form.pdf'));
        $tplId = $this->pdf->ImportPage($pagecount);
        $this->pdf->UseTemplate($tplId);
    }

    private function writeContent(Student $student): void
    {
        $presenter = new StudentApplicationFormPresenter($student);
        $html = $presenter->getFormattedContent();
        $this->pdf->WriteHTML($html);
    }
}