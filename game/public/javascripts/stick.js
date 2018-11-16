angular.module('stick', ['ui.router'])
  .controller('stickCtrl', ['$scope', function($scope){stickCtrl($scope)}])
  .controller('fightCtrl',['$scope', '$document', function($scope, $document){fightCtrl($scope, $document)}])
  .controller('winCtrl',['$scope', function($scope){winCtrl($scope)}])
  .config([
      '$stateProvider',
      '$urlRouterProvider',
      function($stateProvider, $urlRouterProvider) {
        $stateProvider
          .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'stickCtrl'
          })
          .state('fight', {
            url: '/fight',
            templateUrl: '/fight.html',
            controller: 'fightCtrl'
          })
          .state('win', {
              url: '/win',
              templateUrl: '/win.html',
              controler: 'winCtrl'
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

  
  function stickCtrl ($scope) {
      $scope.players=makePlayers(2);
      setkeys($scope,0);
      setkeys($scope,1);
      $scope.winner="";
      $scope.updatePlayer = function(playerInfo,player){
          if(notEmpty(playerInfo.name)){
              player.name=playerInfo.name;
              
              $scope.players[player.id-1]=player;
              playerInfo.name="";
          }
          if(notEmpty(playerInfo.color)){
              if(validateCssColour(playerInfo.color)){
                player.color=playerInfo.color;
                console.log(player.id);
                $scope.players[player.id-1].color=playerInfo.color;
                
                playerInfo.color="";
              }else{
                playerInfo.color="invalid";
              }
          }
      };
      
  }
  
  function setkeys($scope,index){
    var player=$scope.players[index];
    if(index==0){
      player.keys=['w','s','a','d','v'];
    }else{
      player.keys=['i','k','j','l','b'];
    }
  }
  
  
  function fightCtrl ($scope, $document) {
    var galleryCtrl = this;
      $scope.runDraw = function(){
        setup();
        console.log("setup"+color1);
        color1=$scope.players[0].color;
        color2=$scope.players[1].color;
        draw($scope);
      }
      
      function keyupHandler(keyEvent) {
        galleryCtrl.keyUp(keyEvent);
    
        $scope.$apply(); // remove this line if not need
      }
      
      function keydownHandler(keyEvent) {
        galleryCtrl.keyDown(keyEvent);
    
        $scope.$apply(); // remove this line if not need
      }
    
      $document.on('keyup', keyupHandler);
      $document.on('keydown', keydownHandler);
      $scope.$on('$destroy', function () {
        $document.off('keyup', keyupHandler);
        $document.off('keydown', keydownHandler);
        $scope.players[0].x=0;
        $scope.players[1].x=1000;
        $scope.players[0].y=0;
        $scope.players[1].y=0;
        $scope.players[0].health=100;
        $scope.players[1].health=100;
      });
      
      galleryCtrl.keyUp = function(keyevent){
        console.log('keyup Yeah ',keyevent.key);
        galleryCtrl.checkkey(keyevent.key);
      };
      
      galleryCtrl.keyDown = function(keyevent){
        
      }
      
      galleryCtrl.checkkey = function(key){
        var len=$scope.players.length;
        for(var i=0;i<len;i++){
          var player=$scope.players[i];
          for(var j=0;j<5;j++){
            if(key==player.keys[j]){
              switch(j){
                case 0: //up
                  player.y-=10;
                  break;
                case 1: //down
                  player.y+=10;
                  break;
                case 2: //left
                  player.x-=10;
                  break;
                case 3: //right
                  player.x+=10;
                  break;
                case 4: //punch
                  player.punch=true;
              }
            }
          }
        }
      }
      
  }
  
  var canvas;
  let timestamp;
  let wave;
  var color1="black";
  var color2="black";
  var winner="nobody";
  
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
  
  function declareWinner(){
    $('#wintag').html(winner);
  }
  
  function setup(){
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    timestamp = Date.now();
    wave = false;
  }
  
  function draw($scope) {
    if(Date.now() < (timestamp+50)) return requestAnimationFrame(function(timestamp){draw($scope)});
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawPlayer($scope,0);
    drawPlayer($scope,1);// no need to use save and restore between calls as it sets the transform rather 
// than multiply it like ctx.rotate ctx.translate ctx.scale and ctx.transform
// Also combining the scale and origin into the one call makes it quicker
// x,y position of image center
// scale scale of image
// rotation in radians.
function drawImage(image, x, y, scale, rotation){
    ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
    ctx.rotate(rotation);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
} 
    wave= !wave;
    timestamp = Date.now();
    requestAnimationFrame(function(timestamp){draw($scope)});
  }; console.log("yeah!");
  
  function drawPlayer($scope,index){
    var player = $scope.players[index];
    var basex= 200+player.x;
    var basey= 100+player.y;
    
    context.beginPath();
    context.fillStyle = player.color; /* #000000*/
    context.arc(basex, basey-50, 30, 0, Math.PI * 2, true);
    context.fill();
    context.beginPath();
    context.lineWidth = 6;
    context.stroke();
    /*body*/
    context.beginPath();
    context.moveTo(basex, basey-20);
    context.lineTo(basex, basey+80);
    context.strokeStyle = player.color;
    context.stroke();
    /*arms*/context.beginPath();
    context.strokeStyle = player.color;
    context.moveTo(basex, basey);
    var sign=-1;
    if($scope.players[1-index].x>player.x){
      sign=1;
    }
    context.lineTo(basex-sign*50, basey+30);
    if(!player.punch) { 
      context.moveTo(basex, basey);
      context.lineTo(basex+sign*50, basey+30);
    }else {
      context.moveTo(basex, basey);
      context.lineTo(basex+sign*50, basey-30);
      if(Math.abs($scope.players[1-index].x-player.x)<80 && $scope.players[1-index].y-player.y<101 && $scope.players[1-index].y-player.y>-10){
        $scope.players[1-index].health-=1;
        if($scope.players[1-index].health<=0){
          winner=player.name;
          console.log(player.name);
          $('#winButton').click();
        }
        //console.log($scope.players[1-index].health);
      }
      player.punch=false;
    }
    context.stroke();
    /*legs*/
    context.beginPath();
    context.strokeStyle = player.color;
    context.moveTo(basex, basey+80);
    context.lineTo(basex-50, basey+180);
    context.moveTo(basex, basey+80);
    context.lineTo(basex+50, basey+180);
    context.stroke();
  }
  
  function winCtrl ($scope) {
      $scope.winner=winner;
  }
  
  function notEmpty(str){
    return str != null && str != "" && str != " ";
  }
  
  function makePlayers(num){
      var o=[];
      for(var i=1;i<num+1;i++){
          var name="player";
          name+=i;
          o.push({
              name: name,
              color: "black",
              id: i,
              x: 1000*(i-1),
              y: 0,
              keys: [],
              punch: false,
              health: 100
          });
      }
      return o;
  }