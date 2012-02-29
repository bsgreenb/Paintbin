<?php

/**
 *
 *  This script expects one argument:
 *    1) $_FILES['newpng'] - a VALID rendered PNG
 *
 *  If these are not present this script will handle the exception
 *  @todo What error do we want to show?
 */

//@todo max upload size = ??? if we can say the max upload size we can stop some stupid DoS attacks
//@todo test this?
if(!isset($_FILES['newpng'])) throw new RuntimeException('the PNG was not passed as an argument');
if(!getimagesize($_FILES['newpng']['tmp_name'])) throw new RuntimeException('The file was not a PNG');


/*
 * get a new sequence #
 */

$d = mysql_connect('localhost','root','task_4rce') or die(mysql_error());

function insert_and_get_short_code() {
  $c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  for($c='';strlen($c<=6);$c.=$seqChar[rand(0,61)]) continue;
  
  $result = mysql_query(
      sprintf("INSERT INTO pastebin.Painting(shortCode, booleanIsPublic) VALUES ('%s',1)", $c));
      return mysql_errno() == 1062 ? insert_and_get_short_code() : $c;
}

$newShortCode = insert_and_get_short_code();

header("Location: paintb.in/$newShortCode"); exit;









