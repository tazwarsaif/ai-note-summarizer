<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

// Validate input
if (empty($_POST['content'])) {
    http_response_code(400);
    exit('Content is required');
}
require __DIR__.'/../vendor/autoload.php';
use Dompdf\Dompdf;

// Get POST data
$title = $_POST['title'] ?? 'Untitled Note';
$content = $_POST['content'] ?? '';
$summary = $_POST['summary'] ?? '';

// Create PDF
$dompdf = new Dompdf();

$html = '
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
        .content { margin: 20px 0; }
        .summary { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>'.htmlspecialchars($title).'</h1>

    <div class="content">
        '.nl2br(htmlspecialchars($content)).'
    </div>

    <div class="summary">
        <h3>Summary</h3>
        '.nl2br(htmlspecialchars($summary)).'
    </div>
</body>
</html>';

$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

// Output the PDF
header('Content-Type: application/pdf');
$filename = preg_replace('/[^A-Za-z0-9_\-]/', '_', $title) . '.pdf';
header('Content-Disposition: attachment; filename="' . $filename . '"');
echo $dompdf->output();
exit;
