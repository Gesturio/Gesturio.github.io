requirejs.config({
  baseUrl: "js/libs",
  paths: {
    app: "../app",
    ang: "../ang",
    three: "three.min",
    leap: "leap-0.6.4",
    gesture: "gesture",
    angular: "angular.min",
    route: "angular-route",
    metrics: "metrics",
    bootstrap: "bootstrap.min",
    d3js: "d3.min",
    underscore: "underscore-min",
    transform: "leap.transform",
    leap_plugins: "leap-plugins-0.1.6.1",
    leap_rigged: "leap.rigged-hand-0.1.4.min"
  },
  shim: {
    app: {
      deps: ["angular", "route", "leap", "three", "leap_plugins", "leap_rigged", "d3js", "underscore", "gesture"]
    },
    transform: {
      deps: ["leap"]
    },
    angular: {
      exports: 'angular'
    },
    route: {
      deps: ['angular']
    },
    leap_plugins: {
      deps: ["leap"]
    },
    leap_plugins_10: {
      deps: ["leap"]
    },
    leap_rigged: {
      deps: ["leap_plugins", "transform"]
    }
  }
});

requirejs(["app"]);
