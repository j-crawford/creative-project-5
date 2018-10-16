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
    }]);
  
  function stickCtrl ($scope) {
      $scope.players=makePlayers(2);
      $scope.updatePlayer = function(playerInfo,player){
          if(playerInfo.name !== '' && playerInfo.name !== ' '){
              player.name=playerInfo.name;
          }
          if(playerInfo.color !== '' && playerInfo.color !== ' '){
              player.color=playerInfo.color;
          }
      }
  }
  
  function fightCtrl ($scope) {
      
  }
  
  function winCtrl ($scope) {
      
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