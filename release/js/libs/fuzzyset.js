!function(t){t._m_s=function(t,_,r,e){return _>=t?0:r>=t?2*Math.pow((t-_)/(e-_),2):e>=t?1-2*Math.pow((t-e)/(e-_),2):1},t._m_t=function(t,_,r,e){return _>=t?0:r>=t?(t-_)/(r-_):e>=t?(e-t)/(e-r):0},t._m_t_1=function(t,_){var r=.2,e=_-r,n=_+r;return e>=t?0:_>=t?(t-e)/(_-e):n>=t?(n-t)/(n-_):0},t._m_p=function(t,_,r){return r=.08>r?.07:r,Math.exp(-(Math.pow(t-_,2)/(2*r)))},t.fs=function(_,r,e,n){var a=0,m=t._m_p;switch(r){case"_m_t_1":var m=t._m_t_1;break;case"_m_s":var m=t._m_s;break;case"_m_t":var m=t._m_t;break;case"_m_p":var m=t._m_p}for(var o=0;o<_.length;o++)a+=m(_[o],e[o],n[o]);return a/_.length}}("undefined"==typeof exports?this.FuzzySet={}:exports);