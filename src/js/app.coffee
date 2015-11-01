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

      meanGesture = (gesture) ->
        i = undefined
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
      $gestureParams = $(".gesture_params")

      Leap.loop (frame) ->
        if frame.hands[0]
          hand = frame.hands[0]
          Gesture.getGestureParams hand
          Gesture.getMetrics Gesture.getParamsArray()
          decision = Gesture.makeDecision()
          for i of decision
            gestureParams.Gesture[i] = decision[i].name
          for i of decision
            if decision[i].name is gesture
              _deb_senddata gestureParams.Gesture
              break
          $scope.recognized = gestureParams.Gesture.fuzzy
          $scope.$apply()

  ) jQuery


dictionary = [
  "АААААААААААААА", "ТЕСТ", "ПРИВЕТ"
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

app.controller "IndexCtrl", ($scope)->
  console.log('dfdfd')

app.controller "MainCtrl", ($scope)->
  init($scope)
  $scope.score = 0
  $scope.score.total = 214
  $scope.alphabet = GesturesSets.ru

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
      console.log x
      if (i == $scope.word.length-1)
        $scope.new_word()
    else
      $scope.word[i].status = 'wrong'


angular.bootstrap(document, ['app'])

