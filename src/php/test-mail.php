<?php
// Test script to check if server can send emails via local mail service
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('America/Toronto');

header('Content-type: text/plain; charset=utf-8');

echo "=== Mail Server Configuration Test ===\n\n";

// Test 1: Check if PHPMailer is available
echo "1. Checking PHPMailer...\n";
$phpmailerPath = __DIR__ . '/PHPMailer/PHPMailerAutoload.php';
if (file_exists($phpmailerPath)) {
    echo "   ✓ PHPMailer found at: $phpmailerPath\n";
    require $phpmailerPath;
} else {
    echo "   ✗ PHPMailer NOT found at: $phpmailerPath\n";
    exit(1);
}

// Test 2: Try creating PHPMailer instance
echo "\n2. Creating PHPMailer instance...\n";
try {
    // Manually require the PHPMailer class to avoid autoload issues
    require_once __DIR__ . '/PHPMailer/class.phpmailer.php';
    require_once __DIR__ . '/PHPMailer/class.smtp.php';
    $mail = new PHPMailer;
    echo "   ✓ PHPMailer instance created\n";
} catch (Exception $e) {
    echo "   ✗ Error creating PHPMailer: " . $e->getMessage() . "\n";
    exit(1);
} catch (Error $e) {
    echo "   ✗ Fatal error creating PHPMailer: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 3: Check default SMTP settings
echo "\n3. Default SMTP settings:\n";
$mail->isSMTP();
echo "   Host (default): " . ($mail->Host ?: 'localhost') . "\n";
echo "   Port (default): " . ($mail->Port ?: '25') . "\n";
echo "   SMTPAuth: " . ($mail->SMTPAuth ? 'true' : 'false') . "\n";
echo "   SMTPSecure: " . ($mail->SMTPSecure ?: 'none') . "\n";

// Test 4: Try connecting to localhost SMTP
echo "\n4. Testing connection to localhost:25...\n";
$mail->Host = 'localhost';
$mail->Port = 25;
$mail->SMTPAuth = false;
$mail->SMTPDebug = 2; // Enable debugging
$mail->Debugoutput = function ($str, $level) {
    echo "   DEBUG: $str\n";
};

$mail->setFrom('test@ontariotechu.ca', 'Test Sender');
$mail->addAddress('test@example.com'); // This won't actually send, just test connection
$mail->Subject = 'Test Email';
$mail->Body = 'This is a test';

echo "   Attempting connection...\n";
$mail->SMTPDebug = 2;

// Test the connection (this will show debug output)
$connected = false;
try {
    // Try to connect - smtpConnect() returns true on success
    if ($mail->smtpConnect()) {
        $connected = true;
        echo "   ✓ Successfully connected to localhost:25\n";
        $mail->smtpClose();
    } else {
        echo "   ✗ Failed to connect to localhost:25\n";
        echo "   Error: " . $mail->ErrorInfo . "\n";
    }
} catch (Exception $e) {
    echo "   ✗ Connection error: " . $e->getMessage() . "\n";
}

// Test 5: Check if PHP mail() function is available
echo "\n5. Checking PHP mail() function...\n";
if (function_exists('mail')) {
    echo "   ✓ PHP mail() function is available\n";
} else {
    echo "   ✗ PHP mail() function is NOT available\n";
}

// Test 6: Check sendmail path (if available)
echo "\n6. Checking sendmail configuration...\n";
$sendmailPath = ini_get('sendmail_path');
if ($sendmailPath) {
    echo "   Sendmail path: $sendmailPath\n";
} else {
    echo "   Sendmail path: Not configured\n";
}

echo "\n=== Test Complete ===\n";
echo "\nIf localhost:25 connection failed, you may need to use external SMTP.\n";
