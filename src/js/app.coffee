###
# Created by Aitem on 01.11.2015.
###

params = []
init = ($scope)->
  m = 0
  l = '_'
  $scope.set = []

  Leap.loop (frame) ->
    _throttle_apply = _.throttle (name)->
      if l == name
        m++
        if m == 9
          $scope.recognized = name
          $scope.$apply()
          console.log 'Recognize: ', name
      else
        l = name
        m = 0
    , 20

    if frame.hands[0]
      Gesture.getGestureParams frame.hands[0]
      params = Gesture.getParamsArray()
      Gesture.getMetrics params
      decision = Gesture.makeDecision()
      _throttle_apply(decision.name)

  ((controller) ->
    controller.use("playback",
      timeBetweenLoops: 10000
      pauseOnHand: true
    ).on "riggedHand.meshAdded", (handMesh, leapHand) ->
      handMesh.material.opacity = 0.9

    overlay = controller.plugins.playback.player.overlay
    overlay.style.left = 0
    overlay.style.top = "auto"
    overlay.style.padding = 0
    overlay.style.bottom = "13px"
    overlay.style.width = "180px"
    controller.use "riggedHand", scale: 1.5

    camera = controller.plugins.riggedHand.camera
    camera.position.set 7, 10, -30
    camera.lookAt new THREE.Vector3(7, 10, 0)

    # fix canvas position
    canvas = document.getElementsByTagName('canvas')[0]
    visualizer = document.getElementById('visualizer')
    if visualizer
      canvas.style.width = visualizer.clientWidth+"px"
      canvas.style.height = visualizer.clientHeight+"px"
      canvas.style.top = visualizer.offsetTop+"px"
      canvas.style.left = visualizer.offsetLeft+"px"
    else
      canvas.style.width = 0
      canvas.style.height = 0
  )(Leap.loopController)

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
    templateUrl: 'views/front.html'
    controller: 'IndexCtrl'
  rp.when '/main',
    templateUrl: 'views/main.html'
    controller: 'MainCtrl'
  rp.when '/sandbox',
    templateUrl: 'views/sandbox.html'
    controller: 'SandboxCtrl'

app.directive 'keypressEvents', ($document, $rootScope) ->
  restrict: 'A'
  link: ->
    $document.bind 'keyup', (e) ->
      $rootScope.$broadcast 'keyup', e, String.fromCharCode(e.which)

app.controller "SandboxCtrl", ($rootScope, $scope, $location)->

  init($scope)

  $scope.$on 'keyup', (e, a, key)->
    if key == ' '
      $scope.set.push params
      $scope.$apply()
      console.log $scope.set

  $scope.set = []
  $scope.g =
    params:
      M: []
      D: []

  _round = (value, decimals)->
    Number(Math.round(value+'e'+decimals)+'e-'+decimals)

  $scope.add = ()->
    console.log $scope.set.length
    $scope.g.params.M = $scope.set[0].map (x,i)->
      t = $scope.set.reduce((acc, v)->
        acc + v[i]
      , 0)
      t /= $scope.set.length
      _round(t, 5)

    $scope.g.params.D = $scope.set[0]
      .map (x,i)->
        t = $scope.set.reduce((acc, v)->
          Math.pow(v[i] - $scope.g.params.M[i], 2)
        , 0)
        t /= $scope.set.length
        if t >= 1
          t / 100
        if  t < 0.001
          t *= 10 while t < 0.001
        _round(t, 5)

    GesturesSets.en.unshift $scope.g
    $scope.set = []
    console.log JSON.stringify($scope.g.params)
    $location.path '/main'

  $rootScope.loaded = 'loaded'

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

  $scope.new_word()

  $scope.$watch 'recognized', (x)->
    $scope.word = $scope.word || []
    if x == $scope.word[i].name
      $scope.word[i].status = 'correct'
      $scope.score++
      i++
      if (i == $scope.word.length)
        i = 0
        setTimeout ()->
          $scope.new_word()
          $scope.$apply()
        , 1000
    else
      $scope.word[i].status = 'wrong'

  $rootScope.loaded = 'loaded'

angular.bootstrap(document, ['app'])
