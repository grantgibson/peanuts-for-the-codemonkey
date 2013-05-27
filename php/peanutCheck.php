<?php

// This script is designed to be run from a cron / scheduled task every few minutes

require_once('lastAdditions.php');

$owner = "grantgibson"; // Change this to the owner of your GitHub repo
$repo = "ir-switch"; // Change this to the repo you want to get rewarded for
$target = 50; // Number of added lines required before a peanut is issued
$comPort = "com5"; // COM / serial port the Arduino is connected to

$apiURL = "https://api.github.com/repos/" . $owner . "/" . $repo . "/stats/code_frequency";

$githubResponse = getAdditions($apiURL);

// Check response
$array = json_decode($githubResponse, true);
if(sizeof($array)) {
  $additions = $array[0][1];
	
	if($additions >= ($lastIssuedAt + $target)) {
		// Enough new lines added - issue peanuts
		exec('echo "X" > ' . $comPort);
		
		// Update lastIssuedAt
		updateLastIssued($additions);
	}
	
	if($additions < $lastIssuedAt) {
		// Stats are lower than last issued figure - we're onto a new week
		$lastIssuedAt = 0;
	}
	
} 

/*--------------------------------------*/

function getAdditions($url) {
	echo "URL: " . $url;
	$ch = curl_init(); 
	curl_setopt($ch, CURLOPT_URL, $url); 
	//curl_setopt($ch, CURLOPT_HEADER, true); // Display headers
	//curl_setopt($ch, CURLOPT_VERBOSE, true); // Display communication with server
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_USERAGENT,'Peanuts for the codemonkey - An experiment by grant@grantgibson.co.uk');

	$output = curl_exec($ch); 
 	curl_close($ch);  
	return $output; 
}

function updateLastIssued($num) {
  $myFile = "lastAdditions.php";
  $fh = fopen($myFile, 'w') or die("can't open file");
  $stringData = '<?php $lastIssuedAt = "' . $num . '"; ?>';
  fwrite($fh, $stringData);
  fclose($fh);
}

?>
