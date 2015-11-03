/**
 * Created by Aitem on 21.03.2015.
 */
(function(e) {
    // Нечеткое множество
    // Функция принадлежности класса s
    e._m_s = function (x, a, b, c) {
        if (x <= a) {
            return 0;
        } else if (x <= b) {
            return 2 * (Math.pow((x - a) / (c - a), 2));
        } else if (x <= c) {
            return 1 - 2 * (Math.pow((x - c) / (c - a), 2));
        } else {
            return 1;
        }
    }

    // Функция принадлежности класса t
    e._m_t = function (x, a, b, c) {
        if (x <= a) {
            return 0;
        } else if (x <= b) {
            return (x - a) / (b - a);
        } else if (x <= c) {
            return (c - x) / (c - b);
        } else {
            return 0;
        }
    }

    // Функция принадлежности класса t с 1 параметром
    e._m_t_1 = function (x, b) {
        // Радиус
        //var d = Math.PI/180*15,
        var d = 0.2,
            a = b - d,
            c = b + d;

        if (x <= a) {
            return 0;
        } else if (x <= b) {
            return (x - a) / (b - a);
        } else if (x <= c) {
            return (c - x) / (c - b);
        } else {
            return 0;
        }
    };

    // Функция принадлежности класса p
    e._m_p = function (x, m, d) {
        d = (d < 0.7)? 0.7 : d;
        return Math.exp(-(Math.pow(x - m, 2)/(2*d)));
    };

    e.fs = function (x, m, c, d) {
        var a = 0,
            _m = e._m_p;
        switch(m){
            case '_m_t_1':
                var _m = e._m_t_1;
                break;
            case '_m_s':
                var _m = e._m_s;
                break;
            case '_m_t':
                var _m = e._m_t;
                break;
            case '_m_p':
                var _m = e._m_p;
                break;
        }

        for (var i = 0; i < x.length; i++) {
            a += _m(x[i] , c[i], d[i]);
        }
        return a/ x.length;
    };

})(typeof exports === 'undefined'? this['FuzzySet']={}: exports);

