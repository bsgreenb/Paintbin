<?php

/**
 * A simple wrapper to make PDO accessible from multiple scopes, NOTE that this
* class is more of a singleton wrapper, you should never have an instance of DB()
* stored in a variable.
*
* @author new2net
*/
class DB {
  /**
   * A singleton instance of PDO
   * @var PDO
   */
  private static $pdo = NULL;
  
  private function __construct() {
    $ini = parse_ini_file('.ini/db.ini');
    if($ini['dbuser'] && (bool) $ini['dbpass'] && $ini['dbhost'] && $ini['dbport'] && $ini['dbcharset'] && $ini['dbname']) {
      $db_args = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $ini['dbhost'],$ini['dbport'],$ini['dbname'],$ini['dbcharset']);
    } else {
      trigger_error('The database ini file was not correctly set',E_USER_WARNING); 
      exit;        
    }
    
    try {
      self::$pdo = new PDO($db_args,$ini['dbuser'],$ini['dbpass']);
      self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      self::$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    } catch (PDOException $e) {

      die("<pre>
          An exception was raised when trying to connect to the database.

          PLEASE NOTE:
          ---------------
          As with any server, there are weekly server restarts and a
          reserved maintenance window. For paintb.in those times are:

          Weekly Restart: Every Sunday, 6:00am - 7:00am
          Reserved Maintenance Window: Every Sunday, 12:00am - 9:00am
          ---------------

          The details of the exception are supressed for security reasons.
          $e
          
          </pre>");
    }
  }
  
  /**
   * Used to get the singleton instance of PDO.
   * @return PDO
   */
  public static function PDO() {
    if(self::$pdo === NULL) new DB();
    return self::$pdo;
  }

  public function __clone() {
    throw new BadFunctionCallException('Cloning Database or PDO is not supported in this script');
  }


}

?>