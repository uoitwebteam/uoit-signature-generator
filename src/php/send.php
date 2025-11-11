<?php
// Start output buffering to catch all output
ob_start();

// Set up error handling first
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
date_default_timezone_set('America/Toronto');

// Set CORS headers early
// Allow both localhost (for development) and production domain
$request_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowed_origins = [
	'http://localhost:4200',
	'https://brand.ontariotechu.ca'
];

// If the request origin is in our allowed list, use it; otherwise default to production
$allowed_origin = in_array($request_origin, $allowed_origins) ? $request_origin : 'https://brand.ontariotechu.ca';
header('Access-Control-Allow-Origin: ' . $allowed_origin, false);
header('Access-Control-Allow-Headers: origin, x-requested-with, content-type, x-xsrf-token');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header('Content-type: application/json; charset=utf-8');

// Function to output error as JSON
function outputError($message, $code = 500)
{
	ob_clean(); // Clear any previous output
	http_response_code($code);
	echo json_encode(array('success' => false, 'data' => $message), true);
	ob_end_flush();
	exit();
}

// Catch fatal errors
register_shutdown_function(function () {
	$error = error_get_last();
	if ($error !== NULL && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
		outputError('Fatal Error: ' . $error['message'] . ' in ' . basename($error['file']) . ' on line ' . $error['line'], 500);
	}
});

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	ob_clean();
	http_response_code(200);
	echo json_encode(array('success' => true, 'data' => 'OK'), true);
	ob_end_flush();
	exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	try {
		// Manually require PHPMailer classes to avoid __autoload() issues in PHP 7.2+
		$phpmailerDir = __DIR__ . '/PHPMailer/';
		$phpmailerClass = $phpmailerDir . 'class.phpmailer.php';
		$smtpClass = $phpmailerDir . 'class.smtp.php';

		if (!file_exists($phpmailerClass)) {
			throw new Exception('PHPMailer class file not found at: ' . $phpmailerClass);
		}
		if (!file_exists($smtpClass)) {
			throw new Exception('PHPMailer SMTP class file not found at: ' . $smtpClass);
		}

		require_once $phpmailerClass;
		require_once $smtpClass;

		$req = json_decode(file_get_contents('php://input'), true);

		if (!$req || !isset($req['html']) || !isset($req['addressee'])) {
			throw new Exception('Invalid request data: html and addressee are required');
		}

		$error = false;

		//Create a new PHPMailer instance
		$mail = new PHPMailer;
		//Tell PHPMailer to use SMTP (uses local server's mail service)
		$mail->isSMTP();
		//Enable SMTP debugging
		// 0 = off (for production use)
		// 1 = client messages
		// 2 = client and server messages
		$mail->SMTPDebug = 0;
		//Ask for HTML-friendly debug output
		$mail->Debugoutput = 'html';
		//Useful character encoding
		$mail->CharSet = 'UTF-8';
		//Set who the message is to be sent from
		$mail->setFrom('donotreply@uoit.ca', 'Do not reply - Ontario Tech University signature mailer');
		//Set an alternative reply-to address
		$mail->addReplyTo('webteam@uoit.ca', 'Ontario Tech University Webteam');

		// $mail->isHTML(true);
		//Set who the message is to be sent to
		// $addressees = explode(',', trim($_POST['to']));//, 'John Doe');
		//Set the subject line
		$mail->Subject = 'Your Ontario Tech University email signature';
		//Read an HTML message body from an external file, convert referenced images to embedded,
		//convert HTML into a basic plain-text alternative body
		//Replace the plain text body with one created manually
		$mail->Body = preg_replace('/\s+/S', ' ', $req['html']);
		$mail->AltBody = preg_replace('/\s+/', '', strip_tags($req['html']));
		//Attach an image file
		//$mail->addAttachment('images/phpmailer_mini.png');
		// foreach ($addressees as $a) {
		$mail->addAddress($req['addressee']);
		if (!$mail->send()) {
			$error = $mail->ErrorInfo;
		}
		$mail->clearAddresses();
		// }

		//send the message, check for errors
		if ($error) {
			outputError($error, 400);
		} else {
			ob_clean(); // Clear any previous output
			$result = array('success' => true, 'data' => 'Message sent successfully!');
			http_response_code(200);
			echo json_encode($result, true);
			ob_end_flush();
			exit();
		}
	} catch (Exception $e) {
		$errorMessage = $e->getMessage();
		$errorFile = $e->getFile();
		$errorLine = $e->getLine();
		outputError('Error: ' . $errorMessage . ' (File: ' . basename($errorFile) . ', Line: ' . $errorLine . ')', 500);
	} catch (Error $e) {
		// Catch fatal errors (PHP 7+)
		$errorMessage = $e->getMessage();
		$errorFile = $e->getFile();
		$errorLine = $e->getLine();
		outputError('Fatal Error: ' . $errorMessage . ' (File: ' . basename($errorFile) . ', Line: ' . $errorLine . ')', 500);
	}
} else {
	// Not a POST request
	outputError('Only POST requests are allowed', 405);
}
