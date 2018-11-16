angular.module('cats', ['ui.router'])
  .controller('catCtrl', ['$scope', 'user', function($scope,user){catCtrl($scope,user)}])
  .controller('fightCtrl',['$scope', '$document', 'user', function($scope, $document, user){fightCtrl($scope, $document, user)}])
  .factory("user",function(){
        return {};
  })
  .config([
      '$stateProvider',
      '$urlRouterProvider',
      function($stateProvider, $urlRouterProvider) {
        $stateProvider
          .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'catCtrl'
          })
          .state('fight', {
            url: '/fight',
            templateUrl: '/fight.html',
            controller: 'fightCtrl'
          });
        $urlRouterProvider.otherwise('home');
    }])
    
    
 var validateCssColour = function(colour){
    var rgb = $('<div style="color:#28e32a">');     // Use a non standard dummy colour to ease checking for edge cases
    var valid_rgb = "rgb(40, 227, 42)";
    rgb.css("color", colour);
    if(rgb.css('color') == valid_rgb && colour != ':#28e32a' && colour.replace(/ /g,"") != valid_rgb.replace(/ /g,""))
        return false;
    else
        return true;
};

  
  function catCtrl ($scope,user) {
      $scope.main=user;
      $scope.main.user="bob";
      $scope.main.userimg="images/cat_5.png";
      $scope.updatePlayer = function(playerInfo){
          if(notEmpty(playerInfo.name)){
              $scope.main.user=playerInfo.name;
          }
          if(notEmpty(playerInfo.avatar)){
              $scope.main.userimg=playerInfo.avatar;
          }
      };
      
  }
  
  
  
  function fightCtrl ($scope, $document, user) {
    $scope.main=user;
    getEverything();
    $scope.addImage = function(playerInfo){
      console.log("happened");
          if(notEmpty(playerInfo.avatar)){
              var myobj = {Name:$scope.main.user,UserImage:$scope.main.userimg,Image:playerInfo.avatar};
              var jobj = JSON.stringify(myobj);
              var url = "image";
              $.ajax({
                url: url,
                type: "POST",
                data: jobj,
                contentType: "application/json; charset=utf-8",
                success: function(data, textStatus) {
                  console.log(textStatus);
                  getEverything();
                }
              });
          }
      };
  }
  
  
  function getEverything(){
    
    $.getJSON('image', function(data) {
      console.log(data);
      var everything = "<ul>";
      for(var comment in data) {
        var com = data[comment];
        everything += "<li>" + com.Name + "<img src='" +com.UserImage + "' style='width:40px; height:40px;' onerror=\"this.src='images/meh.png'\"/> posted:"
        + "<br/>"+"<img src='" +com.Image + "' style='width:100px; height:100px;' onerror=\"this.src='images/meh.png'\"/>"+"</li>";
      }
      everything += "</ul>";
      if(everything==="<ul></ul>"){
        everything="No Comments :(";
        
      }
      $("#comments").html(everything);
    });
  }
  
  var canvas;
  let timestamp;
  
  
  // no need to use save and restore between calls as it sets the transform rather 
  // than multiply it like ctx.rotate ctx.translate ctx.scale and ctx.transform
  // Also combining the scale and origin into the one call makes it quicker
  // x,y position of image center
  // scale scale of image
  // rotation in radians.
  function drawImage(image, x, y, scale, rotation){
      context.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
      context.rotate(rotation);
      context.drawImage(image, -image.width / 2, -image.height / 2);
  } 
  
  function setup(){
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    timestamp = Date.now();
    
  }
  
  
  
  
  function draw($scope) {
    if(Date.now() < (timestamp+50)) return requestAnimationFrame(function(timestamp){draw($scope)});
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    
    timestamp = Date.now();
    requestAnimationFrame(function(timestamp){draw($scope)});
  }; console.log("yeah!");
  
  
  
  function notEmpty(str){
    return str != null && str != "" && str != " ";
  }
  
  