<?php

namespace App\PDF\Generators\Templates;

use Illuminate\Support\Collection;
use App\Models\Student;
use App\Models\Prename;
use App\Presenters\StudentApplicationFormPresenter;
use App\PDF\Contracts\PDFGenInterface;
use Mpdf\Mpdf;

class ApplicationFormGenerator implements PDFGenInterface
{
    private Mpdf $pdf;
    private Student $student;

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

        $this->student = $data;

        $this->setupPage();
        $this->writeContent($data);

        /*-- Strikethrough Prename PDF --*/
        $prenames = Prename::where('prename_tha', 'นาย')
            ->orWhere('prename_tha', 'นางสาว')
            ->orWhere('prename_tha', 'นาง')
            ->orderBy('id', 'asc')
            ->get();

        $this->handlePrenameStrikethrough($prenames);
        /*-- Strikethrough Prename PDF --*/
        return $this->pdf->Output('application-form.pdf', 'D');
    }

    private function setupPage(): void
    {
        $this->pdf->AddPage();
        $pagecount = $this->pdf->SetSourceFile(
            storage_path('app/private/templates/application-form.pdf')
        );
        $tplId = $this->pdf->ImportPage($pagecount);
        $this->pdf->UseTemplate($tplId);
    }

    private function writeContent(Student $student): void
    {
        $presenter = new StudentApplicationFormPresenter($student);
        $html = $presenter->getFormattedContent();
        $this->pdf->WriteHTML($html);
    }

    private function isNestedArray(array $array): bool
    {
        return isset($array[0]) && is_array($array[0]);
    }

    private function handlePrenameStrikethrough(Collection $prenames): bool
    {
        if ($prenames->isEmpty()) {
            return false;
        }

        $foundMatch = false;
        foreach ($prenames as $index => $prename) {
            if ($this->student->prename_id == $prename->id) {
                $strikethrough = $this->strikethroughPrenamePosition($index);

                if ($this->isNestedArray($strikethrough['strikethrough_tha'])) {
                    foreach ($strikethrough['strikethrough_tha'] as $line_tha) {
                        $this->pdf->Line(
                            $line_tha['x1'],
                            $line_tha['y1'],
                            $line_tha['x2'],
                            $line_tha['y2']
                        );
                    }
                } else {
                    $this->pdf->Line(
                        $strikethrough['strikethrough_tha']['x1'],
                        $strikethrough['strikethrough_tha']['y1'],
                        $strikethrough['strikethrough_tha']['x2'],
                        $strikethrough['strikethrough_tha']['y2']
                    );
                }

                if ($this->isNestedArray($strikethrough['strikethrough_eng'])) {
                    foreach ($strikethrough['strikethrough_eng'] as $line_eng) {
                        $this->pdf->Line(
                            $line_eng['x1'],
                            $line_eng['y1'],
                            $line_eng['x2'],
                            $line_eng['y2']
                        );
                    }
                } else {
                    $this->pdf->Line(
                        $strikethrough['strikethrough_eng']['x1'],
                        $strikethrough['strikethrough_eng']['y1'],
                        $strikethrough['strikethrough_eng']['x2'],
                        $strikethrough['strikethrough_eng']['y2']
                    );
                }

                $foundMatch = true;
            }
        }
        if (!$foundMatch) {
            $this->pdf->Line(30, 53, 53, 53);
            $this->pdf->Line(46, 60, 65, 60);
        }
        return true;
    }

    private function strikethroughPrenamePosition(int $index): array
    {
        $prenamesMap = [
            0 => [
                'name' => 'นาย',
                'strikethrough_tha' => ['x1' => 35.5, 'y1' => 53, 'x2' => 53, 'y2' => 53],
                'strikethrough_eng' => ['x1' => 51, 'y1' => 60, 'x2' => 65, 'y2' => 60],
            ],
            1 => [
                'name' => 'นาง',
                'strikethrough_tha' => [
                    ['x1' => 30, 'y1' => 53, 'x2' => 36, 'y2' => 53],
                    ['x1' => 42.5, 'y1' => 53, 'x2' => 53, 'y2' => 53]
                ],
                'strikethrough_eng' => [
                    ['x1' => 46, 'y1' => 60, 'x2' => 51, 'y2' => 60],
                    ['x1' => 58.5, 'y1' => 60, 'x2' => 65, 'y2' => 60]
                ],
            ],
            2 => [
                'name' => 'นางสาว',
                'strikethrough_tha' => ['x1' => 30, 'y1' => 53, 'x2' => 42, 'y2' => 53],
                'strikethrough_eng' => ['x1' => 46, 'y1' => 60, 'x2' => 57.5, 'y2' => 60],
            ]
        ];
        return $prenamesMap[$index];
    }
}