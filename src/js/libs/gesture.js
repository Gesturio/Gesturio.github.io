/**
 * Created by Aitem on 30.03.2015.
 */

/**
 * Модель руки
 * Palm
 *  [N N] [D D]
 * Fingers
 *  T
 *   IP [MCP MCP] [TM TM]
 *  I
 *   PIP [MCP MCP] DIP
 *  M
 *   PIP [MCP MCP] DIP
 *  R
 *   PIP [MCP MCP] DIP
 *  L
 *   PIP [MCP MCP] DIP
 */

(function(e){
    e._m  = '_m_p';
    e.cur_lang = e.cur_lang || 'ru';
    e.GesturesSet = GesturesSets[e.cur_lang];

    // Объект параметров руки
    e.gestureParams = {};
    // Развернутый в массив объект
    e.gestureParamsArray = [];

    /**
     * Расчет вероятностей
     */
    e.getMetrics = function(){
      e.metrics = []
      e.GesturesSet.forEach(function(g){
        if (g.params.M.length) {
          e.metrics.push(Metrics.fs(e.gestureParamsArray, e._m, g.params.M, g.params.D));
        } else {
          e.metrics.push(0)
        }
      });
    };

    /**
     * Приниятие решения
     */
    e.makeDecision = function(){
      return e.GesturesSet[e.max(e.metrics)]
    };
    e.max = function(arr){
      return arr.indexOf(Math.max.apply(Math, arr));
    };

    /**
     * Разворачивание объекта в массив
     */
    e.getParamsArray  = function(){
        e.gestureParamsArray = [];
        e.obj2array(e.gestureParams);
        return e.gestureParamsArray;
    };
    e.obj2array = function (obj) {
        for(var i in obj){
            if (typeof obj[i] == "object" || typeof obj[i] == "array"){
                e.obj2array(obj[i]);
            } else {
                e.gestureParamsArray.push(obj[i]);
            }
        }
    };

    /**
     * Получение параметров руки
     */
    e.getGestureParams = function(hand){
        // Параметры ладони
        // Нормаль и направление
        e.gestureParams = {
            'Palm'    : e.getPalmParams(hand),
            'Fingers' : e.getFingersParams(hand)
        };
        return e.gestureParams;

    };

    /**
     * Параметры ладони
     */
    e.getPalmParams = function(hand){
        return {
            'N' : e.getPalmNormalParams(hand),
            'D' : e.getPalmDirectionParams(hand)
        };
    };
    e.getPalmNormalParams = function(hand){
        return Linear.cartesian2spherical(hand.palmNormal);
    };
    e.getPalmDirectionParams = function(hand){
        var a = Linear.getVector(
            hand.fingers[2].bones[0].prevJoint,
            hand.fingers[2].bones[0].nextJoint
        );
        return Linear.cartesian2spherical(a);
    };

    /**
     *  Параметры пальцев
     */
    e.getFingersParams = function(hand){
        return {
            'T' : e.getFingerParams(hand, 0),
            'I' : e.getFingerParams(hand, 1),
            'M' : e.getFingerParams(hand, 2),
            'R' : e.getFingerParams(hand, 3),
            'L' : e.getFingerParams(hand, 4)
        }
    };
    e.getFingerParams = function(hand, fingerId){
        var finger = hand.fingers[fingerId];
        if(fingerId != 0){
            return [
                e.getPIPAngle(finger),
                e.getMCPAngle(hand, finger),
                e.getDIPAngle(finger)
            ]
        } else {
            return [
                e.getTfingerIPangle(finger),
                e.getTfingerMCPangle(hand, finger)
            ];
        }

    };
    e.getTfingerIPangle = function(finger){
        return e.getJointAngle(finger.bones[2], finger.bones[3]);
    };
    e.getTfingerMCPangle = function(hand, finger){
        var // Первый вектор базиса
            palmAxis = Linear.getVector(
                hand.fingers[1].bones[0].nextJoint,
                hand.fingers[4].bones[0].nextJoint
            ),
            // Второй вектор базиса
            f = Linear.getVector(
                hand.fingers[2].bones[1].prevJoint,
                hand.fingers[2].bones[1].nextJoint
            ),
            // Вектор кости
            a = Linear.getVector(finger.bones[2].prevJoint, finger.bones[2].nextJoint);

        return [
            Linear.getAngle(palmAxis, a),
            Linear.getAngle(f, a)
        ];
    };

    // угол в DIP суставе
    e.getDIPAngle = function(finger){
        return e.getJointAngle(finger.bones[2], finger.bones[3])
    };
    // угол в PIP суставе
    e.getPIPAngle = function(finger){
        return e.getJointAngle(finger.bones[1], finger.bones[2])
    };
    // угол в MCP суставе
    e.getMCPAngle = function(hand, finger){
        var palmAxis = Linear.getVector(
                hand.fingers[1].bones[0].nextJoint,
                hand.fingers[4].bones[0].nextJoint
            ),
        // Вектор второй кости пальца
        f = Linear.getVector(finger.bones[1].prevJoint, finger.bones[1].nextJoint);
        return [
            Linear.getAngle(palmAxis, f),
            e.getJointAngle(finger.bones[0], finger.bones[1]),
        ];
    };
    // Косинус угла в суставе
    e.getJointAngle = function(bone_1, bone_2){
        var _v_b1 = Linear.getVector(bone_1.prevJoint, bone_1.nextJoint);
        var _v_b2 = Linear.getVector(bone_2.prevJoint, bone_2.nextJoint);
        return  Linear.getAngle(_v_b1, _v_b2);
    }

})(typeof exports === 'undefined'? this['Gesture']={}: exports);
