requirejs.config({
    baseUrl: "js/libs",
    paths: {
        app   : '../app',
        three : 'three.min',
        leap  : 'leap-0.6.4',
        gesture  : 'gesture',
        metrics  : 'metrics',
        jquery   : 'jquery-2.1.3.min',
        bootstrap    : 'bootstrap.min',
        fuzzyset     : 'fuzzyset',
        linear       : 'linear',
        d3js         : 'd3.min',
        underscore   : 'underscore-min',
        jsonhuman    : 'json.human',
        transform    : 'leap.transform',
        leap_plugins : 'leap-plugins-0.1.6.1',
        gestures_sets   : 'gestures_sets',
        leap_rigged     : 'leap.rigged-hand-0.1.4.min'
    },
    shim: {
        'app' : {
            deps : [
                'leap', 'three',
                'leap_plugins', 'leap_rigged',
                'd3js',
                'jquery', 'jsonhuman',  'fuzzyset', 'linear', 'underscore', 'gesture'
            ]
        },
        'gesture' : {
            deps : ['gestures_sets', 'linear', 'fuzzyset', 'metrics']
        },
        'transform'  : {
            deps : ['leap']
        },
        'leap_plugins'  : {
            deps : ['leap']
        },
        'leap_plugins_10'  : {
            deps : ['leap']
        },
        'leap_rigged' : {
            deps : ['leap_plugins', 'transform']
        }
    }
});

requirejs(['app']);
