window.fbAsyncInit = function() {
       FB.init({
         appId      : '',
         xfbml      : true,
         version    : 'v2.5'
       });
     };


(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


var lat,long;
navigator.geolocation.getCurrentPosition(function (position) {
    lat=position.coords.latitude;
    long=position.coords.longitude;
});

var app=angular.module("myapp", ['ngRoute', 'ngAnimate']);

app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'ini.html',
            controller: 'MyController'
      })
      .when('/details', {
        templateUrl: 'details.html',
            controller: 'MyController'
      });

});






app.controller("MyController", function($scope, $http, $sce)
{

  $scope.getUser = function(nxt,prev)
  {
      $(document).ready($('#Error').css({"display": "none"}));
      if($('#srch-term').val())
      {
        // console.log($('#srch-term').val());
      }
      else
      {
        $(document).ready($('#Error').css({"display": ""}));
        $scope.fromServer="";
        $scope.$apply();
            return false;
      }

    var $newTable=['<br/> <br/> <br/> <br/> <br/><br/><br/><br/><br/><br/><br/><br/><br/><div class="progress" id="loading_text" ><div class="progress-bar progress-bar-info progress-bar-striped progbar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>'];
                   $scope.fromServer = [{'data': $sce.trustAsHtml($newTable.join("\n"))}];
                   $scope.$apply();

    url = $('#searchform').attr('action');
    params={};
    params['type'] = $('.nav-pills  .active').attr("id");
    if(params['type']=='fav')
    {
      $scope.get_fav();
      return
    }
    // console.log (params['type']);
    params['keyword']=$('#srch-term').val();

    // var $nxt=$('.pagelink  .active').attr("target");
    // var $prev=$('.pagelink  .active').attr("target");
    // console.log(nxt,prev);
    if (typeof nxt !== 'undefined')
    {
      params['pageurl']=nxt;
    }
    if (typeof prev !== 'undefined')
    {
      params['pageurl']=prev;
    }


    params['lat']=lat;
    params['long']=long;
    
$.ajax(
         {
            xhr: function()
            {
             var xhr = $.ajaxSettings.xhr();
             xhr.upload.onprogress = function(e)
             {
              var percentComplete= Math.floor(e.loaded / e.total *100);
              // console.log(percentComplete);
              $scope.progress=percentComplete;
              $(document).ready($("div.progress > div.progress-bar").css({ "width": percentComplete-50 + "%" }));
              $(document).ready($("div.progress > div.progress-bar").css({ "width": percentComplete-20 + "%" }));
              $(document).ready($("div.progress > div.progress-bar").css({ "width": percentComplete + "%" }));
              $scope.$apply();

             };
       return xhr;
   },
           url:url,
           type:'post',
           data:params,

           success:function(response)
           {

                // responsePromise.success(function(data, status, headers, config) {

                  // console.log(data);
                  // response=data;
                  response=jQuery.parseJSON(response);
                  responsebody=response['data'];

              var $newTable =
                ['<table class="table table-responsive">','<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Favorite</th><th>Details</th></tr></thead>','<tbody>'];
                  count=1;

              for (id in responsebody)
              {
                  var element=responsebody[id];
                  $newTable.push('<tr id="'+element['id']+'">');
                  $newTable.push('<td>'+count+'</td>');count++;
                  $newTable.push('<td> <img src="'+element['picture']['data']['url']+'" class="img-circle" alt="Profile photo" width="60" height="60"></td>');
                  $newTable.push('<td>'+element['name']+'</td>');
                  saved_data=JSON.parse(localStorage.getItem('fblocaldata'));
                  if (saved_data != null)
                  {

                    if(saved_data[element['id']]!= undefined)
                    {
                      $newTable.push('<td><button class="btn btn-default fav" style="color:gold"><i class="glyphicon glyphicon-star"></i></button></td>');
                    }
                    else
                    {
                      $newTable.push('<td><button class="btn btn-default fav" ><i class="glyphicon glyphicon-star-empty"></i></button></td>');
                    }
                  }
                  else
                  {
                      $newTable.push('<td><button class="btn btn-default fav" ><i class="glyphicon glyphicon-star-empty"></i></button></td>');
                  }
                  $newTable.push('<td><a href="#/details"></a><button  class="btn btn-default details"> <i class="glyphicon glyphicon-chevron-right"></i></button></td>');
                  $newTable.push('</tr>');
              }
              $newTable.push('</tbody>');
              $newTable.push('</table>')
              if (response['paging'] != undefined)
              {
                $newTable.push('<div class="text-center">')

                if(response['paging']['previous'])
                {
                  $newTable.push('<div id="pagelink" class="btn-group pagelink"> <input name="prev" type="button"  value="Previous" class ="btn btn-default prevlink" target="'+response['paging']['previous']+'"></div>');
                }
                if(response['paging']['next'])
                {
                  $newTable.push('<div id="pagelink" class="btn-group pagelink"> <input name="nxt" type="button"  value="Next" class ="btn btn-default nextlink" target="'+response['paging']['next']+'"></div>');
                }
                  $newTable.push('</div><br/><br/>');
              }

                   $scope.fromServer = [{'data': $sce.trustAsHtml($newTable.join("\n"))}];
                   $scope.$apply();
                // });
                // responsePromise.error(function(data, status, headers, config) {
                //     alert("AJAX failed!");
                // }
            }});}

$scope.reset=function(){
  $scope.fromServer="";
  }

  $scope.refreshFavs=function(){

  // console.log($sce.getTrustedHtml($scope.fromServer[0]['data']));
  raw=$sce.getTrustedHtml($scope.fromServer[0]['data']);

    saved_data=JSON.parse(localStorage.getItem('fblocaldata'));

 var cache = $('<div />').html(raw);
cache.find(".fav i").attr('class', function (idx, classval) {
    // return href + '#ref=' + Num
    console.log($(this).closest("tr").attr("id"));
    id=$(this).closest("tr").attr("id");

                  if (saved_data != null)
                  {

                    if(saved_data[id]!= undefined)
                    {
                      $(this).closest("button").css("color","gold");

                      return "glyphicon glyphicon-star";
                    }
                    else
                    {
                      $(this).closest("button").css("color","");

                      return "glyphicon glyphicon-star-empty";
                    }
                  }
});

                   $scope.fromServer = [{'data': $sce.trustAsHtml(cache.html())}];
                   $scope.$apply();
  }


  $scope.getHighResImg=function(photo_id)
  {
    $scope.highres_image="";
    url='process.php';
    params={'photo_id':photo_id,'type':'image'};
    url=url+'?photo_id='+photo_id+'&type=image';
    return $http({method:"GET", url:url}).then(function(response){
              var alb_picID = response['data']['images'][0]["source"];
              $(document).ready($('#'+photo_id).attr('src',alb_picID));
              return alb_picID['source'];
          });
  }

$scope.getDetails = function(user_id)
  {

    url = $('#searchform').attr('action');
    params={};
      params['type']="details";
      params['user_id']=user_id;

    params=Object.keys(params).map(function(x){return x+'='+params[x];}).join('&');
    url=url+"?"+params;
// console.log(url);

    var responsePromise = $http.get(url);
    responsePromise.success(function(data, status, headers, config)
    {
      responsebody=data;
      var $newTable=[];
      var user_id=responsebody["id"];
      

$newTable.push(['<div class="row>']);
$newTable.push(['<div class="col-xs-12 col-sm-12 col-lg-12">']);



     
      $newTable.push(['<div id = "back"><a href="#/"><button id="'+user_id+'"type="button"  class="btn btn-default back"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>Back</button></a></div>']);
      $newTable.push(['<div id="username" value="'+responsebody['name']+'"></div>']);
$newTable.push(['<div id="userimg" value="'+responsebody['picture']['data']['url']+'"></div>']);

                  saved_data=JSON.parse(localStorage.getItem('fblocaldata'));
                  if (saved_data != null)
                  {

                    if(saved_data[user_id]!= undefined)
                    {
                      $newTable.push(['<div id = "star"><button id="'+user_id+'" style="color:gold" class="btn btn-default details-fav" ><i class="glyphicon glyphicon-star"></i></button></div>']);
                    }
                    else
                    {
                      $newTable.push(['<div id = "star"><button id="'+user_id+'" class="btn btn-default details-fav" ><i class="glyphicon glyphicon-star-empty"> </i></button></div>']);
                    }
                  }
                  else
                  {
                      $newTable.push(['<div id = "star"><button id="'+user_id+'" class="btn btn-default details-fav" ><i class="glyphicon glyphicon-star-empty"> </i></button></div>']);
                  }

$newTable.push(['<div id="fb_bt"><button id="fb_button" target="'+user_id+'" class="btn btn-default" style="border:none">  <i class="glyphicon"><img src="http://cs-server.usc.edu:45678/hw/hw8/images/facebook.png" style="height: 30px; width: 30px"></i></button></div> </div><br/><br/>']);
$newTable.push(['</div><br/><br/>']);

$newTable.push(['<div class="row" id = "second_page">']);


// var post = responsebody['posts']['data'];
// var albums = responsebody['albums']['data'];



if (responsebody['albums'] != null)
{
  var albums = responsebody['albums']['data'];

  if(albums != undefined)
  {

  $newTable.push(['  <div class="col-xs-12 col-lg-6 left-block">']);
  $newTable.push(['    <div class="panel panel-default">']);
  $newTable.push(['      <div class="panel-heading" role="tab" id="headingOne">']);
  $newTable.push(['        <h4 class="panel-title">Albums</h4>']);
  $newTable.push(['      </div>']);
  $newTable.push(['          <div class="panel-body">']);
  $newTable.push(['    </div>']);
  $newTable.push(['    <div class="panel-group" id="accordion">']);
  open_flag = 1;
  for (var i in  albums) {
  $newTable.push(['      <div class="panel panel-default accord-panel">']);
  $newTable.push(['        <div class="panel-heading role="tab" id="heading'+id+'">']);
  $newTable.push(['          <h4 class="panel-title">']);
  $newTable.push(['          <a data-toggle="collapse" id="acc_parent" data-parent="#accordion" href="#details">'+albums[i]['name']+'</a>']);


  $newTable.push(['          </h4>']);
  $newTable.push(['        </div>']);
  if(open_flag == 1)
  {
    $newTable.push(['        <div id="collapseOne" class="panel-collapse collapse in">']);

  }
  else{
    $newTable.push(['        <div id="collapseOne" class="panel-collapse collapse">']);

  }
  open_flag++;
  $newTable.push(['          <div class="panel-body">']);
  count=0;
  if(albums[i]['photos']!=null)
  {  
    var albpic=albums[i]['photos']['data'];
    for( var y in albpic)
    {

     var album_ID = albpic[y]['id'];
     // console.log(album_ID);

     var myPromise = $scope.getHighResImg(album_ID,count);
// myPromise.then(function(response) {
// // console.log(response);

// // this is only run after getData() resolves
// });
    $newTable.push(['            <div>']);
    $newTable.push(['              <img class="img-responsive img-rounded" style="max-width: 100%;min-width: 100%;" id="'+album_ID+'" src="">']);
    $newTable.push(['            </div><br/>']);
    }
    $newTable.push(['          </div>']);
  $newTable.push(['          </div>']);
  $newTable.push(['          </div>']);
  }}
  $newTable.push(['          </div>']);
  $newTable.push(['          </div>']);
  $newTable.push(['          </div>']);
}
else{
$newTable.push(['<div class="col-xs-12 col-lg-6 left-block">']);
$newTable.push(['<div class="panel panel-default">']);
 $newTable.push(['<div class="panel-heading">']);
   $newTable.push(['<h3 class="panel-title">Albums</h3>']);
 $newTable.push(['</div>']);
 $newTable.push(['<div class="panel-body">No Albums']);
 $newTable.push(['</div>']);
 $newTable.push(['</div>']);
 $newTable.push(['</div>']);
}}

else{
$newTable.push(['<div class="col-xs-12 col-lg-6 left-block">']);
$newTable.push(['<div class="panel panel-default">']);
 $newTable.push(['<div class="panel-heading">']);
   $newTable.push(['<h3 class="panel-title">Albums</h3>']);
 $newTable.push(['</div>']);
 $newTable.push(['<div class="panel-body">No Albums']);
 $newTable.push(['</div>']);
 $newTable.push(['</div>']);
 $newTable.push(['</div>']);;
}
if (responsebody['posts'] != null)
{
 var post = responsebody['posts']['data'];
if(post != undefined)
 {
  $newTable.push(['<div class="col-xs-12 col-lg-6">']);
  $newTable.push(['<div class="panel panel-default">']);
  $newTable.push(['<div class="panel-heading" role="tab" id="headingOne">']);
  $newTable.push(['<h4 class="panel-title">'+"Posts"+'</h4>'])

  $newTable.push(['</div>']);
  $newTable.push(['<div class="panel-body">']);

  for(var x in post)
  {
 $newTable.push(['<div class="panel panel-default">']);
 $newTable.push(['<div class="panel-heading" role="tab" id="headingOne">']);
 $newTable.push(['<h4 class="panel-title">']);
 timestr = post[x]['created_time'];
 timestr=timestr.replace(/[a-zA-Z]+/, " ");
 timestr=timestr.replace(/\+.*/, "");
 $newTable.push(['<div><span><img src="'+responsebody['picture']['data']['url']+'" class="img-circle"  width="50" height="50"></span>&nbsp<span><b>'+responsebody['name']+'</b><br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<i>'+timestr+'</i></span></div>']);
   $newTable.push(['</h4>']);
   $newTable.push(['</div>']);
 $newTable.push(['<div class="panel-body">']);
 $newTable.push(['<div id="postmsg">'+post[x]['message']+'></div>']);
   $newTable.push(['</div>']);
   $newTable.push(['</div>']);

  }

  $newTable.push(['</div>']);
  $newTable.push(['</div>']);
$newTable.push('</div>');
    $newTable.push(['</div>']);
 // entire
}
else{
$newTable.push(['<div class="col-xs-12 col-lg-6 left-block">']);
$newTable.push(['<div class="panel panel-default">']);
 $newTable.push(['<div class="panel-heading">']);
   $newTable.push(['<h3 class="panel-title">Posts</h3>']);
 $newTable.push(['</div>']);
 $newTable.push(['<div class="panel-body">No Posts']);
 $newTable.push(['</div>']);
 $newTable.push(['</div>']);
 $newTable.push(['</div>']);
}}
else{
$newTable.push(['<div class="col-xs-12 col-lg-6 left-block">']);
$newTable.push(['<div class="panel panel-default">']);
 $newTable.push(['<div class="panel-heading">']);
   $newTable.push(['<h3 class="panel-title">Posts</h3>']);
 $newTable.push(['</div>']);
 $newTable.push(['<div class="panel-body">No Posts']);
 $newTable.push(['</div>']);
 $newTable.push(['</div>']);
 $newTable.push(['</div>']);
}


     $scope.fromDetails = [{'data': $sce.trustAsHtml($newTable.join("\n"))}];
    });




                responsePromise.error(function(data, status, headers, config) {
                    alert("AJAX failed!");
                });
  }

$scope.get_fav=function()
{
  saved_data=JSON.parse(localStorage.getItem('fblocaldata'));
  $(".dyn-data").html('');
  var count=1;
  var $newTable =
                ['<table class="table table-responsive">','<thead><tr><th>#</th><th>Profile photo</th><th>Name</th><th>Type</th><th>Favorite</th><th>Details</th></tr></thead>','<tbody>'];
  if (saved_data != null)
  {

      for (id in saved_data)
      {
        // console.log(saved_data[id]);
        $newTable.push('<tr id="'+id+'">');
        $newTable.push('<td>'+count+'</td>');count++;
        $newTable.push('<td>'+saved_data[id]['imgtag']+'</td>');
        $newTable.push('<td>'+saved_data[id]['uname']+'</td>');
        $newTable.push('<td>'+saved_data[id]['type']+'</td>');
        $newTable.push('<td><button class="btn btn-default del-fav" ><i class="glyphicon glyphicon-trash"></i></button></td>');
        $newTable.push('<td><a href="#/details"></a><button  class="btn btn-default details"> <i class="glyphicon glyphicon-chevron-right"></i></button></td>');
        $newTable.push('</tr>');
      }
      $newTable.push('</tbody>');
      $newTable.push('</table>')
      $newTable.push('<br/><br/>');
  }
    $scope.fromServer = [{'data': $sce.trustAsHtml($newTable.join("\n"))}];
    $scope.$apply();
}


        } );




