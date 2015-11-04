
/*
 * Created by Aitem on 01.11.2015.
 */
var app, dictionary, init;

init = function($scope) {
  var visualizeHand;
  Leap.loop();
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
  return (function($) {
    var _deb_senddata, _throttle_apply, capture, cooloff, gesture, gestureParams, i, l, m, meanGesture, queue, rezizeCanvas, sendData, stat;
    rezizeCanvas = function() {
      var canvas_width;
      canvas_width = $(".visualizer-container").width();
      $("canvas").width(canvas_width);
      return $("canvas").height(canvas_width * 0.8);
    };
    queue = [];
    meanGesture = function(gesture) {
      var i;
      queue.push(gesture);
      if (queue.length === 20) {
        for (i in queue) {
          if (queue[i] !== gesture) {
            gesture = "?";
            break;
          }
        }
        queue.shift();
        return gesture;
      }
    };
    sendData = function(url, data) {
      return $.ajax({
        url: url,
        data: {
          data: data,
          gesture: gesture
        },
        success: function() {
          if (i++ % 20 === 0) {
            return console.log(i + " Ok \"" + gesture + "\"");
          }
        }
      });
    };
    capture = function(data) {
      return sendData("/node/store", data);
    };
    stat = function(input) {
      var data, i;
      data = void 0;
      i = void 0;
      data = [gesture];
      for (i in input) {
        data.push(input[i]);
      }
      return sendData("/node/statistic", data);
    };
    $("#visualizer").append($("canvas"));
    rezizeCanvas();
    $(window).resize(function() {
      return rezizeCanvas();
    });
    gestureParams = {
      Gesture: {}
    };
    gesture = "_";
    i = 1;
    console.log(gesture);
    queue = [];
    $(document).on("keyup", function(e) {
      if (e.keyCode === 18) {
        return capture(Gesture.getParamsArray());
      }
    }).on("keyup", function(e) {
      if (e.keyCode === 32) {
        return stat(Gesture.getParamsArray());
      }
    });
    cooloff = 15;
    _deb_senddata = _.debounce((function(data) {
      return stat(data);
    }), cooloff);
    m = 0;
    l = '_';
    _throttle_apply = _.throttle(function() {
      if (l === gestureParams.Gesture.fuzzy) {
        m++;
        if (m === 5) {
          $scope.recognized = gestureParams.Gesture.fuzzy;
          $scope.$apply();
          return console.log('apply ', gestureParams.Gesture.fuzzy);
        }
      } else {
        l = gestureParams.Gesture.fuzzy;
        return m = 0;
      }
    }, 50);
    return Leap.loop(function(frame) {
      var decision, hand;
      if (frame.hands[0]) {
        hand = frame.hands[0];
        Gesture.getGestureParams(hand);
        Gesture.getMetrics(Gesture.getParamsArray());
        decision = Gesture.makeDecision();
        for (i in decision) {
          gestureParams.Gesture[i] = decision[i].name;
        }
        return _throttle_apply();
      }
    });
  })(jQuery);
};

dictionary = ["МАМА", "ТЕСТ", "ПРИВЕТ"];

app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
  var rp;
  rp = $routeProvider;
  rp.when('/', {
    name: 'index',
    templateUrl: 'views/front.html',
    controller: 'IndexCtrl'
  });
  return rp.when('/main', {
    name: 'index',
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  });
});

app.controller("IndexCtrl", function($rootScope, $scope, $location) {
  init($scope);
  $scope.ctrlname = 'index';
  $scope.recognized = '_';
  $scope.$watch('recognized', function(x) {
    $location.path('main');
    if (x !== '_') {
      return setTimeout(function() {
        return $location.path("main");
      }, 1000);
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
    }, {
      label: 'Compilation',
      dictionary: 'comp'
    }
  ];
  $scope.score = 0;
  $scope.score.total = 214;
  $scope.alphabet = GesturesSets.ru;
  $scope.cur_lang = $scope.languages[0];
  $scope.set_lang = function(lang) {
    $scope.cur_lang = lang;
    return $scope.alphabet = GesturesSets[$scope.cur_lang.dictionary];
  };
  i = 0;
  $scope.new_word = function() {
    $scope.word = dictionary[Math.floor(Math.random() * dictionary.length)].split('').map(function(x) {
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
  return setTimeout(function() {
    $rootScope.loaded = 'loaded';
    return $rootScope.$apply();
  }, 500);
});

angular.bootstrap(document, ['app']);
