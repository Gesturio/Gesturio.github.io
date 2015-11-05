###
# Created by Aitem on 01.11.2015.
###
# Init
init = ($scope)->
  Leap.loop()

  visualizeHand = (controller) ->
    controller.use("playback",
      recording: "pinch-bones-3-57fps.json.lz"
      timeBetweenLoops: 1000
      pauseOnHand: true
    ).on "riggedHand.meshAdded", (handMesh, leapHand) ->
      handMesh.material.opacity = 0.7

    overlay = controller.plugins.playback.player.overlay
    overlay.style.left = 0
    overlay.style.top = "auto"
    overlay.style.padding = 0
    overlay.style.bottom = "13px"
    overlay.style.width = "180px"
    controller.use "riggedHand", scale: 1.3

    camera = controller.plugins.riggedHand.camera
    camera.position.set 0, 10, -30
    camera.lookAt new THREE.Vector3(5, 5, 0)
  visualizeHand Leap.loopController

  ( ($) ->
      rezizeCanvas = ->
        canvas_width = $(".visualizer-container").width()
        $("canvas").width canvas_width
        $("canvas").height canvas_width * 0.8
      $("#visualizer").append $("canvas")
      rezizeCanvas()
      $(window).resize -> rezizeCanvas()

      m = 0
      l = '_'
      decision = '_'

      _throttle_apply = _.throttle ()->
        name = decision.name
        if (l == name)
          m++
          if m == 10
            $scope.recognized = name
            $scope.$apply()
            console.log 'apply ', name
        else
          l = name
          m = 0
      , 20

      Leap.loop (frame) ->
        if frame.hands[0]
          hand = frame.hands[0]
          Gesture.getGestureParams hand
          Gesture.getMetrics Gesture.getParamsArray()
          decision = Gesture.makeDecision()
          _throttle_apply()
  ) jQuery


dictionary =
  ru: [
    "МАМА", "ТЕСТ", "ПРИВЕТ"
  ]
  en: [
    "ABC", "FKL", "WAC"
  ]

app = angular.module('app', ['ngRoute'])
app.config ($routeProvider) ->
  rp = $routeProvider
  rp.when '/',
    name: 'index'
    templateUrl: 'views/front.html'
    controller: 'IndexCtrl'
  rp.when '/main',
    name: 'index'
    templateUrl: 'views/main.html'
    controller: 'MainCtrl'

app.controller "IndexCtrl", ($rootScope, $scope, $location)->
  init($scope)
  $scope.ctrlname = 'index'
  $scope.recognized = '_'
  $scope.$watch 'recognized', (x)->
    if x != '_'
      $location.path "main"


  $rootScope.done = true
  $rootScope.loaded = 'loaded'


app.controller "MainCtrl", ($rootScope, $scope)->
  init($scope)
  $scope.languages = [
    {
      label: 'English'
      dictionary: 'en'
    }, {
      label: 'Russian'
      dictionary: 'ru'
    }
  ]
  $scope.score = 0
  $scope.cur_lang = $scope.languages[0]
  $scope.alphabet = GesturesSets.en
  Gesture.GesturesSet = $scope.alphabet

  $scope.progress = 100

  $scope.set_lang = (lang)->
    $scope.cur_lang = lang
    $scope.alphabet = GesturesSets[$scope.cur_lang.dictionary]
    Gesture.GesturesSet = $scope.alphabet
    $scope.new_word()

  i = 0
  $scope.new_word = ()->
    $scope.word = dictionary[$scope.cur_lang.dictionary][Math.floor(Math.random()*dictionary[$scope.cur_lang.dictionary].length)].split('').map (x)->
      name: x
      status: ''
    $scope.word[0].status = 'current'
    i = 0

  $scope.new_word()

  $scope.$watch 'recognized', (x)->
    $scope.word = $scope.word || []
    if x == $scope.word[i].name
      $scope.word[i].status = 'correct'
      i++
      $scope.score++
      if (i == $scope.word.length)
        setTimeout ()->
          $scope.new_word()
          $scope.$apply()
        , 1000
    else
      $scope.word[i].status = 'wrong'

  $rootScope.loaded = 'loaded'

angular.bootstrap(document, ['app'])
