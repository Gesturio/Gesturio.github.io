
/*
 * Created by Aitem on 01.11.2015.
 */
var app, decision, dictionary, init, l, m;

m = 0;

l = '_';

decision = '_';

init = function($scope) {
  var visualizeHand;
  Leap.loop(function(frame) {
    var _throttle_apply, hand;
    _throttle_apply = _.throttle(function() {
      var name;
      name = decision.name;
      if (l === name) {
        m++;
        if (m === 10) {
          $scope.recognized = name;
          $scope.$apply();
          return console.log('apply ', name);
        }
      } else {
        l = name;
        return m = 0;
      }
    }, 20);
    if (frame.hands[0]) {
      hand = frame.hands[0];
      Gesture.getGestureParams(hand);
      Gesture.getMetrics(Gesture.getParamsArray());
      decision = Gesture.makeDecision();
      return _throttle_apply();
    }
  });
  visualizeHand = function(controller) {
    var camera, overlay;
    controller.use("playback", {
      recording: "pinch-bones-3-57fps.json.lz",
      timeBetweenLoops: 1000,
      pauseOnHand: true
    }).on("riggedHand.meshAdded", function(handMesh, leapHand) {
      return handMesh.material.opacity = 0.7;
    });
    overlay = controller.plugins.playback.player.overlay;
    overlay.style.left = 0;
    overlay.style.top = "auto";
    overlay.style.padding = 0;
    overlay.style.bottom = "13px";
    overlay.style.width = "180px";
    controller.use("riggedHand", {
      scale: 1.3
    });
    camera = controller.plugins.riggedHand.camera;
    camera.position.set(0, 10, -30);
    return camera.lookAt(new THREE.Vector3(5, 5, 0));
  };
  visualizeHand(Leap.loopController);
  return document.getElementById("visualizer").appendChild(document.getElementsByTagName("canvas")[0]);
};

dictionary = {
  ru: ["МАМА", "ТЕСТ", "ПРИВЕТ"],
  en: ["ABC", "FKL", "WAC"]
};

app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
  var rp;
  rp = $routeProvider;
  rp.when('/', {
    templateUrl: 'views/front.html',
    controller: 'IndexCtrl'
  });
  rp.when('/main', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  });
  return rp.when('/sandbox', {
    templateUrl: 'views/sandbox.html',
    controller: 'SandboxCtrl'
  });
});

app.directive('keypressEvents', function($document, $rootScope) {
  return {
    restrict: 'A',
    link: function() {
      console.log('linked');
      return $document.bind('keypress', function(e) {
        return $rootScope.$broadcast('keypress', e, String.fromCharCode(e.which));
      });
    }
  };
});

app.controller("SandboxCtrl", function($rootScope, $scope, $location, $document) {
  init($scope);
  $rootScope.$on('keypress', function(e, a, key) {
    return console.log('dfdfdfdf');
  });
  $scope.keyup = function($event) {
    return console.log('dfdfdfdfdfdf');
  };
  $scope.add = function() {
    return console.log('added');
  };
  return $rootScope.loaded = 'loaded';
});

app.controller("IndexCtrl", function($rootScope, $scope, $location) {
  init($scope);
  $scope.ctrlname = 'index';
  $scope.recognized = '_';
  $scope.$watch('recognized', function(x) {
    if (x !== '_') {
      return $location.path("main");
    }
  });
  $rootScope.done = true;
  return $rootScope.loaded = 'loaded';
});

app.controller("MainCtrl", function($rootScope, $scope) {
  var i;
  init($scope);
  $scope.languages = [
    {
      label: 'English',
      dictionary: 'en'
    }, {
      label: 'Russian',
      dictionary: 'ru'
    }
  ];
  $scope.score = 0;
  $scope.cur_lang = $scope.languages[0];
  $scope.alphabet = GesturesSets.en;
  Gesture.GesturesSet = $scope.alphabet;
  $scope.progress = 100;
  $scope.set_lang = function(lang) {
    $scope.cur_lang = lang;
    $scope.alphabet = GesturesSets[$scope.cur_lang.dictionary];
    Gesture.GesturesSet = $scope.alphabet;
    return $scope.new_word();
  };
  i = 0;
  $scope.new_word = function() {
    $scope.word = dictionary[$scope.cur_lang.dictionary][Math.floor(Math.random() * dictionary[$scope.cur_lang.dictionary].length)].split('').map(function(x) {
      return {
        name: x,
        status: ''
      };
    });
    $scope.word[0].status = 'current';
    return i = 0;
  };
  $scope.new_word();
  $scope.$watch('recognized', function(x) {
    $scope.word = $scope.word || [];
    if (x === $scope.word[i].name) {
      $scope.word[i].status = 'correct';
      i++;
      $scope.score++;
      if (i === $scope.word.length) {
        return setTimeout(function() {
          $scope.new_word();
          return $scope.$apply();
        }, 1000);
      }
    } else {
      return $scope.word[i].status = 'wrong';
    }
  });
  return $rootScope.loaded = 'loaded';
});

angular.bootstrap(document, ['app']);
