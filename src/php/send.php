<?php
error_reporting(0);
date_default_timezone_set('EST/UTC');
header('Access-Control-Allow-Origin: http://localhost:4200', false);
header('Access-Control-Allow-Headers: origin, x-requested-with, content-type, x-xsrf-token');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header('Content-type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	require 'PHPMailer/PHPMailerAutoload.php';

	$req = json_decode(file_get_contents('php://input'), true);

	$error = false;

	//Create a new PHPMailer instance
	$mail = new PHPMailer;
	//Tell PHPMailer to use SMTP
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
	$mail->setFrom('donotreply@ontariotechu.ca', 'Do not reply - Ontario Tech University signature mailer');
	//Set an alternative reply-to address
	$mail->addReplyTo('webteam@ontariotechu.ca', 'Ontario Tech University Webteam');

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
		$result = array('success' => false, 'data' => $error);
		http_response_code(400);
		echo json_encode($result, true);
		exit();
	} else {
		$result = array('success' => true, 'data' => 'Message sent successfully!');
		http_response_code(200);
		echo json_encode($result, true);
		exit();
	}
}
