###
# Created by Aitem on 01.11.2015.
###

dictionary =
  ru: ["МАМА", "ТЕСТ", "ПРИВЕТ", "АВГУСТ", "АВОСЬ", "АЗОТ", "АВЕНЮ", "АНГЕЛ", "ВЕРСТА", "ВЕСЫ", "ВОЛЬЕР", "ВОКАЛ", "ВОКЗАЛ", "ВОЛНА", "ВОР", "ВОПЛЬ", "ВОСЕМЬ", "АВТО", "АМПЕР", "ВЕНЧАТЬ", "ВЕРТУШКА", "ВЗМЫТЬ", "ВЖАТЬСЯ", "КАШЕЛЬ", "КАРУСЕЛЬ", "КАРТОН", "КАПЕРСЫ", "ЗРАЧОК", "ЗАНЯТО", "ЗАНЯТЬ", "ЗАГНУТЬ", "КАМЗОЛ", "КАЛЬЯН", "ГОСТЬЯ", "ОКРУГ", "ОМЛЕТ", "НУТРО", "ОКУЛЯР", "МЯСКО", "МЕШОК", "МЕТРО", "ЛЕСТЬ", "КОНЮХ", "ЗРЕЛОСТЬ", "МОНСТР", "МОЛЧУН", "ПОЛЫМЯ", "ПОЧЕТ", "ШНУРОВКА", "ПЛАСТЫРЬ", "СУМОЧКА", "ЧОКАНЬЕ", "ПЛАНШЕТ", "ЖУРНАЛ", "УТЕЧКА", "ЗАТВОР", "ПЛАМЯ", "ЛОМКА", "ПОЧТА", "ХОЛСТ", "ШАЛУНЬЯ", "ЭКЗАМЕН", "ПОВЕСТКА", "СВЕТОМУЗЫКА", "СТУПЕНЬКА", "ЛЕСОПАРК", "КОМПЬЮТЕР"]
  en: ["BACKLIGHT", "BLACKOUT", "DAYLIGHT", "COBALT", "COW", "GOTHIC", "HOBBY", "HICKUP", "POLICY", "PUBLIC", "QUOTA", "AUDIO", "AUDIT", "HOLIDAY", "DOUGHTY", "DIABLO", "DIALOG", "QUAHOG", "QUICKY", "QUEUE", "BLACK", "BLOCK", "POLYACID", "TABLOID", "BACKLOG", "CAPITOL", "JAIL", "GLIB", "YOGA", "AGO", "GABY", "PATY", "FOCAL", "FLIGHT", "FLYBACK", "PUBLICA", "TOPIC", "OPTIC"]
  _sandbox: []

app = angular.module('app', ['ngRoute'])
app
  .config ($routeProvider) ->
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
    rp.when '/dev',
      templateUrl: 'views/dev.html'
      controller: 'DevCtrl'

  .directive 'keypressEvents', ($document, $rootScope) ->
    restrict: 'A'
    link: ->
      $document.bind 'keyup', (e) ->
        $rootScope.$broadcast 'keyup', e, String.fromCharCode(e.which)

  .controller "IndexCtrl", ($rootScope, $scope, $location)->
    init($scope)
    $scope.recognized = '_'
    $scope.$watch 'recognized', (x)->
      $location.path "main" if x != '_'
    $rootScope.loaded = 'loaded'

  .controller "DevCtrl", ($rootScope, $scope, $location)->
    init($scope)

    $scope.set = []
    $scope.$on 'keyup', (e, a, key)->
      if key == ' '
        $scope.set.push params
        $scope.$apply()
        console.log params

    $scope.g =
      params:
        M: []
        D: []

    _round = (value, decimals)-> Number(Math.round(value+'e'+decimals)+'e-'+decimals)

    $scope.add = ()->
      console.log $scope.set.length
      $scope.g.params.M = $scope.set[0].map (x,i)->
        t = $scope.set.reduce((acc, v)->
          acc + v[i]
        , 0)
        t /= $scope.set.length
        _round(t, 5)

      $scope.g.params.D = $scope.set[0].map (x,i)->
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

  .controller "SandboxCtrl", ($rootScope, $scope, $location)->
    init($scope)
    $scope.alphabet = GesturesSets._sandbox
    Gesture.GesturesSet = $scope.alphabet

    $scope.$watch 'recognized', (x)->
      console.log x

    $rootScope.loaded = 'loaded'

  .controller "MainCtrl", ($rootScope, $scope, $location)->
    init($scope)
    $scope.languages = [
      {
        label: 'American'
        dictionary: 'en'
      }, {
        label: 'Russian'
        dictionary: 'ru'
      }, {
        label: 'Sandbox (dev mode)'
        dictionary: '_sandbox'
      }
    ]
    $scope.score = 0
    # By default - English alphabet
    $scope.cur_lang = $scope.languages[0]
    $scope.alphabet = GesturesSets.en
    Gesture.GesturesSet = $scope.alphabet

    $scope.$watch 'cur_lang', (lang)->
      $location.path "sandbox" if lang.dictionary == '_sandbox'
      $scope.alphabet = GesturesSets[lang.dictionary]
      Gesture.GesturesSet = $scope.alphabet
      $scope.new_word()

    $scope.new_word = ()->
      $scope.i = 0
      $scope.word = dictionary[$scope.cur_lang.dictionary][Math.floor(Math.random()*dictionary[$scope.cur_lang.dictionary].length)].split('').map (x)->
        name: x
        status: ''
      $scope.word[0].status = 'current'
    $scope.new_word()

    $scope.$watch 'recognized', (x)->
      $scope.word = $scope.word || []
      if x == $scope.word[$scope.i].name
        $scope.word[$scope.i].status = 'correct'
        $scope.score++
        $scope.i++
        if ($scope.i >= $scope.word.length)
          setTimeout ()->
            $scope.new_word()
            $scope.$apply()
          , 1000
        else
          $scope.word[$scope.i].status = 'current'

    $rootScope.loaded = 'loaded'

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

angular.bootstrap(document, ['app'])
