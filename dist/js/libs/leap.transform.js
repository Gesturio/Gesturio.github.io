(function(){var __slice=[].slice;Leap.plugin("transform",function(scope){var noop,transformDirections,transformMat4Implicit0,transformPositions,_matrix;return null==scope&&(scope={}),noop=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],_matrix=new THREE.Matrix4,scope.transform||scope.position||scope.quaternion||scope.scale?(scope.getMatrix=function(hand){var matrix;return scope.transform?(matrix="function"==typeof scope.transform?scope.transform(hand):scope.transform,window.THREE&&matrix instanceof THREE.Matrix4?matrix.elements:matrix):scope.position||scope.quaternion||scope.scale?(_matrix.set.apply(_matrix,noop),scope.quaternion&&_matrix.makeRotationFromQuaternion("function"==typeof scope.quaternion?scope.quaternion(hand):scope.quaternion),scope.scale&&_matrix.scale("function"==typeof scope.scale?scope.scale(hand):scope.scale),scope.position&&_matrix.setPosition("function"==typeof scope.position?scope.position(hand):scope.position),_matrix.elements):noop},transformPositions=function(){var matrix,vec3,vec3s,_i,_len,_results;for(matrix=arguments[0],vec3s=2<=arguments.length?__slice.call(arguments,1):[],_results=[],_i=0,_len=vec3s.length;_len>_i;_i++)vec3=vec3s[_i],vec3?_results.push(Leap.vec3.transformMat4(vec3,vec3,matrix)):_results.push(void 0);return _results},transformMat4Implicit0=function(out,a,m){var x,y,z;return x=a[0],y=a[1],z=a[2],out[0]=m[0]*x+m[4]*y+m[8]*z,out[1]=m[1]*x+m[5]*y+m[9]*z,out[2]=m[2]*x+m[6]*y+m[10]*z,out},transformDirections=function(){var matrix,vec3,vec3s,_i,_len,_results;for(matrix=arguments[0],vec3s=2<=arguments.length?__slice.call(arguments,1):[],_results=[],_i=0,_len=vec3s.length;_len>_i;_i++)vec3=vec3s[_i],vec3?_results.push(transformMat4Implicit0(vec3,vec3,matrix)):_results.push(void 0);return _results},{hand:function(hand){var finger,matrix,_i,_len,_ref,_results;for(matrix=scope.getMatrix(hand),transformPositions(matrix,hand.palmPosition,hand.stabilizedPalmPosition,hand.sphereCenter),transformDirections(matrix,hand.direction,hand.palmNormal,hand.palmVelocity),_ref=hand.fingers,_results=[],_i=0,_len=_ref.length;_len>_i;_i++)finger=_ref[_i],transformPositions(matrix,finger.carpPosition,finger.mcpPosition,finger.pipPosition,finger.dipPosition,finger.tipPosition),_results.push(transformDirections(matrix,finger.direction));return _results}}):{}})}).call(this);