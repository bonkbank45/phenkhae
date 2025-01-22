<?php

return [
    'mode' => 'utf-8',
    'format' => 'A4',
    'default_font' => 'sarabun',
    // 'default_font_size' => 16,
    // 'margin_left' => 10,
    // 'margin_right' => 10,
    // 'margin_top' => 10,
    // 'margin_bottom' => 10,
    // 'margin_header' => 0,
    // 'margin_footer' => 0,
    'orientation' => 'P',
    'fontDir' => [
        storage_path('fonts/THSarabunNew'),
    ],
    'fontdata' => [
        'sarabun' => [
            'R' => 'THSarabunNew.ttf',
            'B' => 'THSarabunNew Bold.ttf',
            'I' => 'THSarabunNew Italic.ttf',
            'BI' => 'THSarabunNew BoldItalic.ttf'
        ]
    ],
];