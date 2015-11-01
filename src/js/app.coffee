###
# Created by Aitem on 01.11.2015.
###

dictionary = [
  "ТЕСТ", "ПРИВЕТ"
]

app = angular.module('app', [])
app.controller "IndexCtrl", ($scope)->
  $scope.score = {}
  $scope.score.total = 214
  $scope.alphabet = GesturesSets.ru
  $scope.word = dictionary[Math.floor(Math.random()*dictionary.length)].split('')
  $scope.recognized = "A"

angular.bootstrap(document, ['app'])

# Init
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
  controller.use "riggedHand",
    scale: 1.3

  camera = controller.plugins.riggedHand.camera
  camera.position.set 0, 10, -30
  camera.lookAt new THREE.Vector3(5, 5, 0)

visualizeHand Leap.loopController
(($) ->
  $(document).ready ->
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
        $gestureParams.html JsonHuman.format(gestureParams)

) jQuery


