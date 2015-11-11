<?php

define('DEBUG', false);
if (DEBUG) print "In DEBUG mode";

$templatefile = '../private/projectcaffeine.html';
$loginlocation = 'projectlogin.html';
$errorlocation = 'projectlogin.html#error';

session_start();

// md5 of 'caffeine'
$username = 'e724f8b8a8349afb5beaeaa300323933';
// md5 of '5F?-wpd%uH'
$password = '3b8d70bfe8befbfd58e1346ebff0d8e4';


if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
	if (DEBUG) print "Running Post";
	if(!empty($_POST["username"]) && !empty($_POST["password"]))
	{
		$u = $_POST["username"];
		$p = $_POST["password"];

		if (DEBUG) print "Running md5";
		$md5u = md5($u);
		$md5p = md5($p);
		
		if($username == $md5u && $password == $md5p)
		{
			if (DEBUG) print "Username/password matches";
			$_SESSION["authenticated"] = 'true';
			showPage();
		}
		else
		{
			if (DEBUG) print "Username/password do not match";
			showError();
		}
	}
	else
	{
		if (DEBUG) print "Empty post values";
		showError();
	}
}
else if ($_SERVER['REQUEST_METHOD'] == 'GET')
{
	if (DEBUG) print "Running Get";
	if (!empty($_GET["logout"]))
	{
		if (DEBUG) print "Running logout";
		$_SESSION["authenticated"] = 'false';
		showLogin();
	}

	if(empty($_SESSION["authenticated"]) || $_SESSION["authenticated"] != 'true')
	{
		if (DEBUG) print "Not authenticated";
		showError();
	}
	else
	{
		if (DEBUG) print "Authenticated showing page";
		showPage();
	}
}

function showPage()
{
	global $templatefile;
	$content = file_get_contents($templatefile);
	print $content;
	exit;
}

function showLogin()
{
	global $loginlocation;
	header('Location: '.$loginlocation);
	exit;
}

function showError()
{
	global $errorlocation;
	header('Location: '.$errorlocation);
	exit;
}