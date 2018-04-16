<?php
require_once __DIR__ . '/facebook-sdk-v5/autoload.php';
define("APP_TOKEN", "EAAa8yw0ScnABAPvVLq1wLgNjSC9CSBo8dkZCMHuguNiMxPpOnd7B4j8ShiCtUapWigkuPwNZCbt60TAsIZAfJphZBJIAiyejRfMNPGKEohLKZBoRJrRGfzbhxcGUxGr4hznAQ2Rc2a4ILMkRSQuk1NGsJcsZAZCZAewZD");
define("Google_Key","AIzaSyD8G-WMqjWqBaa-2x-CS-ZfJLICDfDy3Lk");

date_default_timezone_set("America/Los_Angeles");

$fb = new Facebook\Facebook([
  'app_id' => '1896430143959664',
  'app_secret' => 'a98248d3cecd03deaa96b44de6c7a525',
  'default_graph_version' => 'v2.5',
]);

$fb->setDefaultAccessToken(APP_TOKEN);
if ($_SERVER['REQUEST_METHOD'] == 'GET' && empty($_GET))
    $_GET = array_merge($_GET,json_decode(file_get_contents('php://input'), true));

if(isset($_GET['type']) && !empty($_GET['type'])) {
    $type1=$_GET['type'];
    gettypedata($fb,$type1);
    // switch($type1) {
    //     // case 'page' : gnextprev($fb);break;
    //     case 'user' : gettypedata($fb,$type1);break;
    // }
}

if(isset($_POST['type']) && !empty($_POST['type'])) {
    $type1=$_POST['type'];
    getposttypedata($fb,$type1);
    // switch($type1) {
    //     // case 'page' : gnextprev($fb);break;
    //     case 'user' : gettypedata($fb,$type1);break;
    // }
}



function gettypedata($fb,$type1)
{
// if(isset($_GET['submit'])){
  $keyword1 = $_GET["keyword"];

  if($type1=='place')
  {
    $lat=$_GET['lat'];
    $long=$_GET['long'];
    $url = "search?q=".$keyword1."&type=".$type1."&fields=id,name,picture.width(700).height(700)";
  }
  else
  {
   $url = "search?q=".$keyword1."&type=".$type1."&fields=id,name,picture.width(700).height(700)";
  }

  if(isset($_GET['pageurl']))
  {

    $url=$_GET['pageurl'];
    $url='search?'.$url;
  }

 if($type1=='details')
  {
    $user_id =$_GET["user_id"];
    $url = $user_id."?fields=id,name,picture.width(700).height(700),albums.limit(5){name,photos.limit(2){name, picture.width(700).height(700)}},posts.limit(5)";
  }
  if($type1=='image')
     {
       $photo_id =$_GET["photo_id"];
       $url = $photo_id."?fields=images";
     }


      $response = $fb->get($url);
      $requestStatus = $response->getHttpStatusCode();
      $responseObj = $response->getBody();
  if($type1!='details' && $type1!='image')
  {
      $responseObj=strip_creds($responseObj);
  }
      echo $responseObj;
    // echo  serialize($responseObj);
  }


function getposttypedata($fb,$type1)
{
// if(isset($_POST['submit'])){
  $keyword1 = $_POST["keyword"];

  if($type1=='place')
  {
    $lat=$_POST['lat'];
    $long=$_POST['long'];
    $url = "search?q=".$keyword1."&type=".$type1."&fields=id,name,picture.width(700).height(700)";
  }
  else
  {
   $url = "search?q=".$keyword1."&type=".$type1."&fields=id,name,picture.width(700).height(700)";
  }

  if(isset($_POST['pageurl']))
  {

    $url=$_POST['pageurl'];
    $url='search?'.$url;
  }

 if($type1=='details')
  {
    $user_id =$_POST["user_id"];
    $url = $user_id."?fields=id,name,picture.width(700).height(700),albums.limit(5){name,photos.limit(2){name, picture.width(700).height(700)}},posts.limit(5)";
  }


      $response = $fb->get($url);
      $requestStatus = $response->getHttpStatusCode();
      $responseObj = $response->getBody();

  if($type1!='details')
  {
      $responseObj=strip_creds($responseObj);
  }
      echo $responseObj;
    // echo  serialize($responseObj);
  }

function strip_creds($responseObj)
{

  $raw_data = (array) json_decode($responseObj,true);
  if(isset($raw_data['paging']['next']) && !empty($raw_data['paging']['next']))
      {
        $nxturl=$raw_data['paging']['next'];
        $nxturl=preg_replace("/^.*?\?/", "", $nxturl);
        $nxturl=preg_replace("/access_token=.*?&/", "", $nxturl);
        $raw_data['paging']['next']=$nxturl;

        $prevurl=$raw_data['paging']['previous'];
        $prevurl=preg_replace("/^.*?\?/", "", $prevurl);
        $prevurl=preg_replace("/access_token=.*?&/", "", $prevurl);
        $raw_data['paging']['previous']=$prevurl;


        $raw_data=json_encode($raw_data);
      }
      return $raw_data;
}

?>
