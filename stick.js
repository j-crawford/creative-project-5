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
    
    
 

  
  function stickCtrl ($scope) {
      $scope.players=makePlayers(2);
      setkeys($scope,0);
      setkeys($scope,1);
      $scope.updatePlayer = function(playerInfo,player){
          if(notEmpty(playerInfo.name)){
              player.name=playerInfo.name;
              
              $scope.players[player.id-1]=player;
              playerInfo.name="";
          }
          if(notEmpty(playerInfo.color)){
              player.color=playerInfo.color;
              console.log(player.id);
              $scope.players[player.id-1].color=playerInfo.color;
              
              playerInfo.color="";
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
                  player.y-=5;
                  break;
                case 1: //down
                  player.y+=5;
                  break;
                case 2: //left
                  player.x-=5;
                  break;
                case 3: //right
                  player.x+=5;
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
  
  function setup(){
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    timestamp = Date.now();
    wave = false;
  }
  
  function draw($scope) {
    if(Date.now() < (timestamp+300)) return requestAnimationFrame(function(timestamp){draw($scope)});
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawPlayer($scope,0);
    drawPlayer($scope,1);
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
    context.lineTo(basex-50, basey+30);
    if(!player.punch) { 
      context.moveTo(basex, basey);
      context.lineTo(basex+50, basey+30);
    }else {
      context.moveTo(basex, basey);
      context.lineTo(basex+50, basey-30);
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