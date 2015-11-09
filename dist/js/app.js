
/*
 * Created by Aitem on 01.11.2015.
 */
var app, dictionary, init, params;

dictionary = {
  ru: ["МАМА", "ТЕСТ", "ПРИВЕТ", "АВГУСТ", "АВОСЬ", "АЗОТ", "АВЕНЮ", "АНГЕЛ", "ВЕРСТА", "ВЕСЫ", "ВОЛЬЕР", "ВОКАЛ", "ВОКЗАЛ", "ВОЛНА", "ВОР", "ВОПЛЬ", "ВОСЕМЬ", "АВТО", "АМПЕР", "ВЕНЧАТЬ", "ВЕРТУШКА", "ВЗМЫТЬ", "ВЖАТЬСЯ", "КАШЕЛЬ", "КАРУСЕЛЬ", "КАРТОН", "КАПЕРСЫ", "ЗРАЧОК", "ЗАНЯТО", "ЗАНЯТЬ", "ЗАГНУТЬ", "КАМЗОЛ", "КАЛЬЯН", "ГОСТЬЯ", "ОКРУГ", "ОМЛЕТ", "НУТРО", "ОКУЛЯР", "МЯСКО", "МЕШОК", "МЕТРО", "ЛЕСТЬ", "КОНЮХ", "ЗРЕЛОСТЬ", "МОНСТР", "МОЛЧУН", "ПОЛЫМЯ", "ПОЧЕТ", "ШНУРОВКА", "ПЛАСТЫРЬ", "СУМОЧКА", "ЧОКАНЬЕ", "ПЛАНШЕТ", "ЖУРНАЛ", "УТЕЧКА", "ЗАТВОР", "ПЛАМЯ", "ЛОМКА", "ПОЧТА", "ХОЛСТ", "ШАЛУНЬЯ", "ЭКЗАМЕН", "ПОВЕСТКА", "СВЕТОМУЗЫКА", "СТУПЕНЬКА", "ЛЕСОПАРК", "КОМПЬЮТЕР"],
  en: ["BACKLIGHT", "BLACKOUT", "DAYLIGHT", "COBALT", "COW", "GOTHIC", "HOBBY", "HICKUP", "POLICY", "PUBLIC", "QUOTA", "AUDIO", "AUDIT", "HOLIDAY", "DOUGHTY", "DIABLO", "DIALOG", "QUAHOG", "QUICKY", "QUEUE", "BLACK", "BLOCK", "POLYACID", "TABLOID", "BACKLOG", "CAPITOL", "JAIL", "GLIB", "YOGA", "AGO", "GABY", "PATY", "FOCAL", "FLIGHT", "FLYBACK", "PUBLICA", "TOPIC", "OPTIC"],
  _sandbox: []
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
  rp.when('/sandbox', {
    templateUrl: 'views/sandbox.html',
    controller: 'SandboxCtrl'
  });
  return rp.when('/dev', {
    templateUrl: 'views/dev.html',
    controller: 'DevCtrl'
  });
}).directive('keypressEvents', function($document, $rootScope) {
  return {
    restrict: 'A',
    link: function() {
      return $document.bind('keyup', function(e) {
        return $rootScope.$broadcast('keyup', e, String.fromCharCode(e.which));
      });
    }
  };
}).controller("IndexCtrl", function($rootScope, $scope, $location) {
  init($scope);
  $scope.recognized = '_';
  $scope.$watch('recognized', function(x) {
    if (x !== '_') {
      return $location.path("main");
    }
  });
  return $rootScope.loaded = 'loaded';
}).controller("DevCtrl", function($rootScope, $scope, $location) {
  var _round;
  init($scope);
  $scope.set = [];
  $scope.$on('keyup', function(e, a, key) {
    if (key === ' ') {
      $scope.set.push(params);
      $scope.$apply();
      return console.log(params);
    }
  });
  $scope.g = {
    params: {
      M: [],
      D: []
    }
  };
  _round = function(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  };
  $scope.add = function() {
    console.log($scope.set.length);
    $scope.g.params.M = $scope.set[0].map(function(x, i) {
      var t;
      t = $scope.set.reduce(function(acc, v) {
        return acc + v[i];
      }, 0);
      t /= $scope.set.length;
      return _round(t, 5);
    });
    $scope.g.params.D = $scope.set[0].map(function(x, i) {
      var t;
      t = $scope.set.reduce(function(acc, v) {
        return Math.pow(v[i] - $scope.g.params.M[i], 2);
      }, 0);
      t /= $scope.set.length;
      if (t >= 1) {
        t / 100;
      }
      if (t < 0.001) {
        while (t < 0.001) {
          t *= 10;
        }
      }
      return _round(t, 5);
    });
    GesturesSets.en.unshift($scope.g);
    $scope.set = [];
    console.log(JSON.stringify($scope.g.params));
    return $location.path('/main');
  };
  return $rootScope.loaded = 'loaded';
}).controller("SandboxCtrl", function($rootScope, $scope, $location) {
  init($scope);
  $scope.alphabet = GesturesSets._sandbox;
  Gesture.GesturesSet = $scope.alphabet;
  $scope.$watch('recognized', function(x) {
    return console.log(x);
  });
  return $rootScope.loaded = 'loaded';
}).controller("MainCtrl", function($rootScope, $scope, $location) {
  init($scope);
  $scope.languages = [
    {
      label: 'American',
      dictionary: 'en'
    }, {
      label: 'Russian',
      dictionary: 'ru'
    }, {
      label: 'Sandbox (dev mode)',
      dictionary: '_sandbox'
    }
  ];
  $scope.score = 0;
  $scope.cur_lang = $scope.languages[0];
  $scope.alphabet = GesturesSets.en;
  Gesture.GesturesSet = $scope.alphabet;
  $scope.$watch('cur_lang', function(lang) {
    if (lang.dictionary === '_sandbox') {
      $location.path("sandbox");
    }
    $scope.alphabet = GesturesSets[lang.dictionary];
    Gesture.GesturesSet = $scope.alphabet;
    return $scope.new_word();
  });
  $scope.new_word = function() {
    var nw;
    $scope.i = 0;
    $scope.word = nw = dictionary[$scope.cur_lang.dictionary][Math.floor(Math.random() * dictionary[$scope.cur_lang.dictionary].length)].split('').map(function(x) {
      return {
        name: x,
        status: ''
      };
    });
    while (nw !== $scope.word) {
      nw = dictionary[$scope.cur_lang.dictionary][Math.floor(Math.random() * dictionary[$scope.cur_lang.dictionary].length)].split('').map(function(x) {
        return {
          name: x,
          status: ''
        };
      });
    }
    $scope.word = nw;
    return $scope.word[0].status = 'current';
  };
  $scope.new_word();
  $scope.$watch('recognized', function(x) {
    $scope.word = $scope.word || [];
    if (x === $scope.word[$scope.i].name) {
      $scope.word[$scope.i].status = 'correct';
      $scope.score++;
      $scope.i++;
      if ($scope.i >= $scope.word.length) {
        return setTimeout(function() {
          $scope.new_word();
          return $scope.$apply();
        }, 1000);
      } else {
        return $scope.word[$scope.i].status = 'current';
      }
    }
  });
  return $rootScope.loaded = 'loaded';
});

params = [];

init = function($scope) {
  var l, m;
  m = 0;
  l = '_';
  $scope.set = [];
  Leap.loop(function(frame) {
    var _throttle_apply, decision;
    _throttle_apply = _.throttle(function(name) {
      if (l === name) {
        m++;
        if (m === 9) {
          $scope.recognized = name;
          $scope.$apply();
          return console.log('Recognize: ', name);
        }
      } else {
        l = name;
        return m = 0;
      }
    }, 20);
    if (frame.hands[0]) {
      Gesture.getGestureParams(frame.hands[0]);
      params = Gesture.getParamsArray();
      Gesture.getMetrics(params);
      decision = Gesture.makeDecision();
      return _throttle_apply(decision.name);
    }
  });
  return (function(controller) {
    var camera, canvas, overlay, visualizer;
    controller.use("playback", {
      timeBetweenLoops: 10000,
      pauseOnHand: true
    }).on("riggedHand.meshAdded", function(handMesh, leapHand) {
      return handMesh.material.opacity = 0.9;
    });
    overlay = controller.plugins.playback.player.overlay;
    overlay.style.left = 0;
    overlay.style.top = "auto";
    overlay.style.padding = 0;
    overlay.style.bottom = "13px";
    overlay.style.width = "180px";
    controller.use("riggedHand", {
      scale: 1.5
    });
    camera = controller.plugins.riggedHand.camera;
    camera.position.set(7, 10, -30);
    camera.lookAt(new THREE.Vector3(7, 10, 0));
    canvas = document.getElementsByTagName('canvas')[0];
    visualizer = document.getElementById('visualizer');
    if (visualizer) {
      canvas.style.width = visualizer.clientWidth + "px";
      canvas.style.height = visualizer.clientHeight + "px";
      canvas.style.top = visualizer.offsetTop + "px";
      return canvas.style.left = visualizer.offsetLeft + "px";
    } else {
      canvas.style.width = 0;
      return canvas.style.height = 0;
    }
  })(Leap.loopController);
};

angular.bootstrap(document, ['app']);
