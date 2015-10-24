/**
 * Created by Aitem on 21.03.2015.
 */

// Установка контроллера
Leap.loop();

// Визуализация
visualizeHand = function(controller){
    controller.use('playback', {
        recording: 'pinch-bones-3-57fps.json.lz',
        timeBetweenLoops: 1000,
        pauseOnHand: true
    }).on('riggedHand.meshAdded', function(handMesh, leapHand){
        handMesh.material.opacity = 0.7;
    });

    var overlay = controller.plugins.playback.player.overlay;
    overlay.style.left = 0;
    overlay.style.top = 'auto';
    overlay.style.padding = 0;
    overlay.style.bottom = '13px';
    overlay.style.width = '180px';

    controller.use('riggedHand', {
        scale : 1.3
    });

    var camera = controller.plugins.riggedHand.camera;
    camera.position.set(0, 10, -30);
    camera.lookAt(new THREE.Vector3(5, 5,0));
};
visualizeHand(Leap.loopController);


(function($){ $(document).ready(function(){
    $('#visualizer').append($('canvas'));
    rezizeCanvas();
    $(window).resize(function(){
        rezizeCanvas();
    });

    function rezizeCanvas () {
        var canvas_width = $('.visualizer-container').width();
        $('canvas').width(canvas_width);
        $('canvas').height(canvas_width*0.8);
    }


    var gestureParams = { Gesture : { } },
        gesture  = '_', i = 1;

    console.log(gesture);

    var queue = [];
    function meanGesture(gesture){
        queue.push(gesture);
        if(queue.length == 20){
            for(var i in queue){
                if(queue[i] != gesture){
                    gesture = '?';
                    break;
                }
            }
            queue.shift();
            return gesture;
        }
    }

    function sendData(url, data){
        $.ajax({
            url: url,
            data: {
                data    : data,
                gesture : gesture
            },
            success: function(){
                if((i++)% 20 == 0){
                    console.log((i)+ ' Ok "'+gesture+'"');
                }
            }
        });
    };
    function capture(data){
        sendData('/node/store', data)
    };
    function stat(input){
        var data = [gesture];
        for(var i in input){
            data.push(input[i])
        }
        sendData('/node/statistic', data)
    };


    $(document).on('keyup', (function(e){
        if(e.keyCode == 18){ // alt
            capture(Gesture.getParamsArray());
        }
    })).on('keyup', (function(e){
        if(e.keyCode == 32){ // space
            stat(Gesture.getParamsArray());
        }
    }));
    var  cooloff = 15;

    var _deb_senddata = _.debounce(function(data) {
        stat(data);
    }, cooloff);

    var $gestureParams = $('.gesture_params');
    Leap.loop(function (frame) {
        if(frame.hands[0]){
            var hand = frame.hands[0];

            Gesture.getGestureParams(hand);
            Gesture.getMetrics(Gesture.getParamsArray());
 //*
            var decision =  Gesture.makeDecision();
            for(var i in decision){
                gestureParams.Gesture[i] = decision[i].name;
            }
            for(var i in decision){
                if(decision[i].name == gesture){
                    _deb_senddata(gestureParams.Gesture);
                    break;
                }
            }
            //console.log(meanGesture(Gesture.makeDecision().name));
            //gestureParams['Gesture'] = Gesture.recognizedGesture.name;
            //gestureParams['Probability'] = Gesture.recognizedProbability;
            $gestureParams.html(JsonHuman.format(gestureParams));
 // */

        };
    });
})})(jQuery);
