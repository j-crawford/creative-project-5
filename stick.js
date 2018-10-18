angular.module('stick', ['ui.router'])
  .controller('stickCtrl', stickCtrl)
  .controller('fightCtrl',fightCtrl)
  .controller('winCtrl',winCtrl)
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
    .directive('loadscript', function() {
      return {
    scope: {
    },
    restrict: 'E', /* [2] */
    replace: 'true',
    template: ('<div><canvas id="canvas" width="400px" height="400px" >'+
                    'Your browser does not support HTML5 Canvas element'+
                  '</canvas><script>var canvas = document.getElementById("canvas");'+
                          'context = canvas.getContext("2d");'+
                          'let timestamp = Date.now();'+
                          'let wave = false;'+
                          
                          
                          'draw();'+
                          'function draw() {'+
                                'if(Date.now() < (timestamp+900)) return requestAnimationFrame(draw);'+
                                
                                'context.clearRect(0, 0, window.innerWidth, window.innerHeight);'+
                                'context.beginPath();'+
                                'context.fillStyle = "black"; /* #000000*/'+
                                'context.arc(200, 50, 30, 0, Math.PI * 2, true);'+
                                'context.fill();'+
                                
                                'context.beginPath(); '+
                                'context.lineWidth = 6;'+
                                'context.stroke();'+
                                
                                '/*body*/'+
                                'context.beginPath();'+
                                'context.moveTo(200, 80);'+
                                'context.lineTo(200, 180);'+
                                'context.strokeStyle = "black";'+
                                'context.stroke();'+
                                
                                '/*arms*/'+
                                'context.beginPath();'+
                                'context.strokeStyle = "black";'+
                                'context.moveTo(200, 100);'+
                                'context.lineTo(150, 130);'+
                                'if(wave) { '+
                                'context.moveTo(200, 100);'+
                                'context.lineTo(250, 130);'+
                                'wave = false;'+
                                '}'+
                                'else {'+
                                'context.moveTo(200, 100);'+
                                'context.lineTo(250, 70);'+
                                'wave = true;'+
                                '}'+
                                'context.stroke();'+
                                
                                '/*legs*/'+
                                'context.beginPath();'+
                                'context.strokeStyle = "black";'+
                                'context.moveTo(200, 180);'+
                                'context.lineTo(150, 280);'+
                                'context.moveTo(200, 180);'+
                                'context.lineTo(250, 280);'+
                                'context.stroke();'+
                                'timestamp = Date.now();'+
                                'requestAnimationFrame(draw);'+
                        '}; console.log("yeah!")'+
                      '</script></div>')
      };
    });
    
       // $('#fightPage').append();
 

  
  function stickCtrl ($scope) {
      $scope.players=makePlayers(2);
      $scope.updatePlayer = function(playerInfo,player){
          if(notEmpty(playerInfo.name)){
              player.name=playerInfo.name;
          }
          if(notEmpty(playerInfo.color)){
              player.color=playerInfo.color;
          }
      }
  }
  
  
  
  function fightCtrl ($scope) {
      $scope.runDraw = function(){
        setup();
        draw();
      }
      
  }
  
  var canvas;
  let timestamp;
  let wave;
  
  function setup(){
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    timestamp = Date.now();
    wave = false;
  }
  
  function draw() {
    if(Date.now() < (timestamp+900)) return requestAnimationFrame(draw);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.beginPath();
    context.fillStyle = "black"; /* #000000*/
    context.arc(200, 50, 30, 0, Math.PI * 2, true);
    context.fill();
    context.beginPath();
    context.lineWidth = 6;
    context.stroke();
    /*body*/
    context.beginPath();
    context.moveTo(200, 80);
    context.lineTo(200, 180);
    context.strokeStyle = "black";
    context.stroke();
    /*arms*/context.beginPath();
    context.strokeStyle = "black";
    context.moveTo(200, 100);
    context.lineTo(150, 130);
    if(wave) { 
      context.moveTo(200, 100);
      context.lineTo(250, 130);
      wave = false;
    }else {
      context.moveTo(200, 100);
      context.lineTo(250, 70);
      wave = true;
    }
    context.stroke();
    /*legs*/
    context.beginPath();
    context.strokeStyle = "black";
    context.moveTo(200, 180);
    context.lineTo(150, 280);
    context.moveTo(200, 180);
    context.lineTo(250, 280);
    context.stroke();
    timestamp = Date.now();
    requestAnimationFrame(draw);
  }; console.log("yeah!")
  
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
              id: i
          });
      }
      return o;
  }