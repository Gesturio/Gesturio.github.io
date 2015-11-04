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

      queue = []
      meanGesture = (gesture) ->
        queue.push gesture
        if queue.length is 20
          for i of queue
            if queue[i] isnt gesture
              gesture = "?"
              break
          queue.shift()
          gesture

      sendData = (url, data) ->
        $.ajax
          url: url
          data:
            data: data
            gesture: gesture

          success: ->
            console.log i + " Ok \"" + gesture + "\""  if i++ % 20 is 0

      capture = (data) ->
        sendData "/node/store", data

      stat = (input) ->
        data = undefined
        i = undefined
        data = [ gesture ]
        for i of input
          data.push input[i]
        sendData "/node/statistic", data

      $("#visualizer").append $("canvas")
      rezizeCanvas()
      $(window).resize ->
        rezizeCanvas()

      gestureParams = Gesture: {}
      gesture = "_"
      i = 1
      console.log gesture
      queue = []
      $(document).on("keyup", (e) ->
        capture Gesture.getParamsArray()  if e.keyCode is 18
      ).on "keyup", (e) ->
        stat Gesture.getParamsArray()  if e.keyCode is 32

      cooloff = 15
      _deb_senddata = _.debounce(((data) ->
        stat data
      ), cooloff)

      m = 0
      l = '_'

      _throttle_apply = _.throttle ()->
        if (l == gestureParams.Gesture.fuzzy)
          m++
          if m == 5
            $scope.recognized = gestureParams.Gesture.fuzzy
            $scope.$apply()
            console.log 'apply ', gestureParams.Gesture.fuzzy
        else
          l = gestureParams.Gesture.fuzzy
          m = 0
      , 50

      Leap.loop (frame) ->
        if frame.hands[0]
          hand = frame.hands[0]
          Gesture.getGestureParams hand
          Gesture.getMetrics Gesture.getParamsArray()
          decision = Gesture.makeDecision()
          for i of decision
            gestureParams.Gesture[i] = decision[i].name

          _throttle_apply()

  ) jQuery


dictionary = [
  "МАМА", "ТЕСТ", "ПРИВЕТ"
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
    $location.path('main')
    if x != '_'
      setTimeout ()->
        $location.path "main"
      , 1000

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

  $scope.set_lang = (lang)->
    $scope.cur_lang = lang
    $scope.alphabet = GesturesSets[$scope.cur_lang.dictionary]
    Gesture.GesturesSet = $scope.alphabet

  i = 0
  $scope.new_word = ()->
    $scope.word = dictionary[Math.floor(Math.random()*dictionary.length)].split('').map (x)->
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
