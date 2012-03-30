<?php 
/**
 * @author new2net
 * 
 *  This script expects one argument:
 *    1) $_POST['png_data'] - a VALID rendered PNG
 *
 *  @todo If [these are] not present this script crash with an exception
 *  @todo reassert this is secure
 */
error_reporting(E_ALL | E_STRICT);

DEFINE('UPLOADS_PER_MINUTE',5);
DEFINE('UPLOAD_RUNNING_AVERAGE_LENGTH_MINUTES',20);

function __autoload($class_name) { require_once('./classes/' . $class_name . '.php'); }
?><!DOCTYPE html>
<html>
  <head>
  <title><?php echo $_GET['shortLink']; ?> - paintb.in</title>
  </head>
  <body>
    
  </body>
</html>