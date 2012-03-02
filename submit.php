<?php 

error_reporting(E_ALL | E_STRICT);

function __autoload($class_name) {
  require_once('./classes/' . $class_name . '.php');
}

/**
 *  This script expects one argument:
 *    1) $_POST['png_data'] - a VALID rendered PNG
 *
 *  @todo If [these are] not present this script crash with an exception
 */

function base64decodeFix($encoded) {
  $decoded = '';
  for ($i=0; $i < ceil(strlen($encoded)/256); $i++)
    $decoded = $decoded . base64_decode(substr($encoded,$i*256,256));
  return $decoded;
}

function isBase64Encoded($encodedString) {
  $length = strlen($encodedString);
  for ($i = 0; $i < $length; ++$i) {
    $c = $encodedString[$i];
    if (($c < '0' || $c > '9') && 
        ($c < 'a' || $c > 'z') && 
        ($c < 'A' || $c > 'Z') && 
        ($c != '+') && ($c != '/') && ($c != '=')) return false;
  }
  return true;
}


function getNewShortCode() {
  $c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  $insertStatement = DB::PDO()->prepare('INSERT INTO Painting(shortCode, booleanIsPublic) VALUES (?,1)');
  
  debug_backtrace();
  
  do {
    for($_sc='';strlen($_sc)<6;$_sc.=$c[rand(0,61)]) continue; #a potentially new random short code
    debug_backtrace();
    try {
      $status = $insertStatement->execute(array($_sc));
      if($insertStatement->rowCount() == 1) return $_sc;
    } catch (PDOException $e) {
      die($e);
    }
    unset($_sc);
  } while (in_array($status, array(0, 1062))); #duplicate key (ShortCode)
}

if(isset($_POST['png_data'])) {  
  #clean up the argument
  $inputPNGBase64 = str_replace('data:image/png;base64,','', $_POST['png_data']);

  if(isBase64Encoded($inputPNGBase64)) {
    #create a temporary file first (outside of web directory)
    $tmpName = '/tmp/'.uniqid('paintbin_'); //@todo make this an ini setting
    $fileData = base64decodeFix($inputPNGBase64);
    $fileByteSize = file_put_contents($tmpName, $fileData);

    if($fileByteSize) { #can not be empty
      
      $imageMetaData = getimagesize($tmpName);
      if(is_array($imageMetaData) && $imageMetaData['mime'] == 'image/png') {
        
        $shortCode = getNewShortCode();
        rename($tmpName, "uploads/$shortCode");
        die("<a href=\"uploads/{$shortCode}\"> Here </a>");        
      }
    } else {
      die('the png data was empty, thus invalid');
    }
  } else {
    die('the png data was not encoded (as base64) correctly');
  }
} else {
  die('png_data was not set');
}

$newShortCode = insert_and_get_short_code();
move_uploaded_file($_FILES['newpng']['tmp_name'], "images/{$newShortCode}.png");
header("Location: paintb.in/$newShortCode"); exit;








