Object.extend = function(target, /*optional*/source, /*optional*/deep) { 
    target = target || {}; 
    var sType = typeof source, i = 1, options; 
    if( sType === 'undefined' || sType === 'boolean' ) { 
            deep = sType === 'boolean' ? source : false; 
            source = target; 
            target = this; 
        } 
        if( typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]' ) 
            source = {}; 
            while(i <= 2) { 
            options = i === 1 ? target : source; 
            if( options != null ) { 
                for( var name in options ) { 
                    var src = target[name], copy = options[name]; 
                    if(target === copy) 
                        continue; 
                    if(deep && copy && typeof copy === 'object' && !copy.nodeType) 
                        target[name] = this.extend(src || (copy.length != null ? [] : {}), copy, deep); 
                    else if(copy !== undefined) 
                        target[name] = copy; 
                } 
        } 
        i++; 
    } 
    return target; 
};
var EventTarget = function() {
    this._listener = {};
};

EventTarget.prototype = {
    constructor: this,
    addEvent: function(type, fn) {
        if (typeof type === "string" && typeof fn === "function") {
            if (typeof this._listener[type] === "undefined") {
                this._listener[type] = [fn];
            } else {
                this._listener[type].push(fn);    
            }
        }
        return this;
    },
    addEvents: function(obj) {
        obj = typeof obj === "object"? obj : {};
        var type;
        for (type in obj) {
            if ( type && typeof obj[type] === "function") {
                this.addEvent(type, obj[type]);    
            }
        }
        return this;
    },
    fireEvent: function(type) {
        if (type && this._listener[type]) {
            var events = {
                type: type,
                target: this    
            };
            
            for (var length = this._listener[type].length, start=0; start<length; start+=1) {
                this._listener[type][start].call(this, events);
            }
        }
        return this;
    },
    fireEvents: function(array) {
        if (array instanceof Array) {
            for (var i=0, length = array.length; i<length; i+=1) {
                this.fireEvent(array[i]);
            }
        }
        return this;
    },
    removeEvent: function(type, key) {
        var listeners = this._listener[type];
        if (listeners instanceof Array) {
            if (typeof key === "function") {
                for (var i=0, length=listeners.length; i<length; i+=1){
                    if (listeners[i] === key){
                        listeners.splice(i, 1);
                        break;
                    }
                }
            } else if (key instanceof Array) {
                for (var lis=0, lenkey = key.length; lis<lenkey; lis+=1) {
                    this.removeEvent(type, key[lenkey]);
                }
            } else {
                delete this._listener[type];
            }
        }
        return this;
    },
    removeEvents: function(params) {
        if (params instanceof Array) {
            for (var i=0, length = params.length; i<length; i+=1) {
                this.removeEvent(params[i]);
            }    
        } else if (typeof params === "object") {
            for (var type in params) {
                this.removeEvent(type, params[type]);    
            }
        }
        return this;    
    }
};
var dobot = function() {
    this.jsApi = null;
    this.socket = null;
    this.showLine = 0;
    this.totalLine = 100;
    this.port = 12345;
    this.event = new EventTarget();
};
var dobot = Object.extend({
    init:function(){
        this.initSocket();
    },
    initSocket: function(){
        var $this = this;
        var baseUrl = "ws://localhost:12345";
        if (location.search != ""){
            var regPort  = /[?&]port=([0-9]+)/.exec(location.search);
            if(regPort){
                baseUrl = "ws://localhost:" + regPort[1];
                $this.port = regPort[1];
            }
        }

        this.output("Start dobot blockly at " + baseUrl + ".");
        this.socket = new WebSocket(baseUrl);

        this.socket.onclose = function()
        {
            $this.output("web channel closed");
            $this.jsApi = null;
        };
        this.socket.onerror = function(error)
        {
            $this.output("web channel error: " + error);
            $this.jsApi = null;
        };
        this.socket.onopen = function()
        {
            $this.output("Dobot blockly initialize already, going to prepare param.");
            new QWebChannel(dobot.socket, function(channel) {
                // make dialog object accessible globally
                $this.jsApi = channel.objects.jsApi;
                $this.initJsApi();
                $this.output("Dobot prepare already, can to edit!");
            });
        }
    },
    initJsApi:function(){
        var $this = this;
        this.jsApi.onSendLog.connect(function(message) {
            $this.output(message);
        });
    },
    isConnectted:function(){
        return this.jsApi != null;
    },
    output:function(message){
        var output = document.getElementById("log_area");
        if(this.showLine++ > this.totalLine){
            this.showLine = 0;
            output.innerHTML = "";
        }
        output.innerHTML = message + "<br />" + output.innerHTML;
    },
    addEvent: function(type, fn) {
        this.event.addEvent(type, fn);
    },
    addEvents: function(obj) {
        this.event.addEvents(obj);
    },
    removeEvent: function(type, key) {
        this.event.removeEvent(type, key);
    },
    removeEvents: function(params) {
        this.event.removeEvents(params);
    }
},dobot)
var dobot = Object.extend({
    loadUrl:function(url){
        var search = window.location.search;
        if (search.length <= 1) {
            search = '?port=' + this.port;
        } else if (search.match(/[?&]port=[^&]*/)) {
            search = search.replace(/([?&]port=)[^&]*/, '$1' + this.port);
        } else {
            search = search.replace(/\?/, '?port=' + this.port + '&');
        }
        this.jsApi.loadUrl(window.location.protocol + '//' + window.location.host + window.location.pathname + search);
    },
    dSleep:function(ms){
        this.jsApi.dSleep(ms);
    },
    SetCmdTimeout:function(times){
        this.jsApi.SetCmdTimeout(times);
    },
    GetQueuedCmdCurrentIndex:function(callback){
        callback = callback || function(){}
        this.jsApi.GetQueuedCmdCurrentIndex(callback);
    },
    SetQueuedCmdStartExec:function(){
        this.jsApi.SetQueuedCmdStartExec();
    },
    SetQueuedCmdForceStopExec:function(){
        this.jsApi.SetQueuedCmdForceStopExec();
    },
    SetQueuedCmdStartDownload:function(totalLoop, linePerLoop){
        this.jsApi.SetQueuedCmdStartDownload(totalLoop, linePerLoop);
    },
    SetQueuedCmdStopDownload:function(){
        this.jsApi.SetQueuedCmdStopDownload();
    },
    SetQueuedCmdClear:function(){
        this.jsApi.SetQueuedCmdClear();
    },
    SetDeviceSN:function(str){
        this.jsApi.SetDeviceSN(str);
    },
    GetDeviceSN:function(callback){
        callback = callback || function(){}
        this.jsApi.GetDeviceSN(callback);
    },
    SetDeviceName:function(str){
        this.jsApi.SetDeviceName(str);
    },
    GetDeviceName:function(callback){
        callback = callback || function(){}
        this.jsApi.GetDeviceName(callback);
    },
    GetDeviceVersion:function(callback){
        callback = callback || function(){}
        this.jsApi.GetDeviceVersion(callback);
    },
    SetEndTypeParams:function(endType, xBias, yBias, zBias){
        this.jsApi.SetEndTypeParams(endType, xBias, yBias, zBias);
    },
    GetEndTypeParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetEndTypeParams(callback);
    },
    ResetPose:function(manual, rearArmAngle, frontArmAngle){
        this.jsApi.ResetPose(manual, rearArmAngle, frontArmAngle);
    },
    GetPose:function(callback){
        callback = callback || function(){}
        this.jsApi.GetPose(callback);
    },
    GetKinematics:function(){
        callback = callback || function(){}
        this.jsApi.GetKinematics(callback);
    },
    GetAlarmsState:function(maxLen, callback){
        callback = callback || function(){}
        this.jsApi.GetAlarmsState(maxLen, callback);
    },
    ClearAllAlarmsState:function(){
        this.jsApi.ClearAllAlarmsState();
    },
    GetUserParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetUserParams(callback);
    },
    SetHOMEParams:function(){
        this.jsApi.SetHOMEParams();
    },
    GetHOMEParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetHOMEParams(callback);
    },
    SetHOMECmd:function(temp, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetHOMECmd(temp, isQueued, callback);
    },
    SetArmOrientation:function(armOrientation, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetArmOrientation(armOrientation, isQueued, callback);
    },
    GetArmOrientation:function(callback){
        callback = callback || function(){}
        this.jsApi.GetArmOrientation(callback);
    },
    SetHHTTrigMode:function(hhtTrigMode){
        this.jsApi.SetHHTTrigMode(hhtTrigMode);
    },
    GetHHTTrigMode:function(callback){
        callback = callback || function(){}
        this.jsApi.GetHHTTrigMode(callback);
    },
    SetHHTTrigOutputEnabled:function(isEnabled, callback){
        callback = callback || function(){}
        this.jsApi.SetHHTTrigOutputEnabled(isEnabled, callback);
    },
    GetHHTTrigOutputEnabled:function(callback){
        callback = callback || function(){}
        this.jsApi.GetHHTTrigOutputEnabled(callback);
    },
    GetHHTTrigOutput:function(callback){
        callback = callback || function(){}
        this.jsApi.GetHHTTrigOutput(callback);
    },
    SetEndEffectorParams:function(xBias, yBias, zBias, callback){
        callback = callback || function(){}
        this.jsApi.SetEndEffectorParams(xBias, yBias, zBias, callback)
    },
    GetEndEffectorParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetEndEffectorParams(callback)
    },
    SetEndEffectorLaser:function(enableCtrl, on,  isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetEndEffectorLaser(enableCtrl, on,  isQueued, callback)
    },
    GetEndEffectorLaser:function(callback){
        callback = callback || function(){}
        this.jsApi.GetEndEffectorLaser(callback)
    },
    SetEndEffectorSuctionCup:function(enableCtrl, on,  isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetEndEffectorSuctionCup(enableCtrl, on,  isQueued, callback)
    },
    GetEndEffectorSuctionCup:function(callback){
        callback = callback || function(){}
        this.jsApi.GetEndEffectorSuctionCup(callback)
    },
    SetEndEffectorGripper:function(enableCtrl, on,  isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetEndEffectorGripper(enableCtrl, on,  isQueued, callback)
    },
    GetEndEffectorGripper:function(callback){
        callback = callback || function(){}
        this.jsApi.GetEndEffectorGripper(callback)
    },
    SetJOGJointParams:function(j1Velocity, j1Acceleration, j2Velocity, j2Acceleration, j3Velocity, j3Acceleration, j4Velocity, j4Acceleration, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetJOGJointParams(j1Velocity, j1Acceleration, j2Velocity, j2Acceleration, j3Velocity, j3Acceleration, j4Velocity, j4Acceleration, isQueued, callback);
    },
    GetJOGJointParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetJOGJointParams(callback);
    },
    SetJOGCoordinateParams:function(xVelocity, xAcceleration, yVelocity, yAcceleration, zVelocity, zAcceleration, rVelocity, rAcceleration, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetJOGCoordinateParams(xVelocity, xAcceleration, yVelocity, yAcceleration, zVelocity, zAcceleration, rVelocity, rAcceleration, isQueued, callback);
    },
    GetJOGCoordinateParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetJOGCoordinateParams(callback);
    },
    SetJOGCommonParams:function(velocityratio, accelerationratio, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetJOGCommonParams(velocityratio, accelerationratio, isQueued, callback);
    },
    GetJOGCommonParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetJOGCommonParams(callback);
    },
    SetJOGCmd:function(isJoint, cmd, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetJOGCmd(isJoint, cmd, isQueued, callback);
    },
    SetPTPJointParams:function(j1Velocity, j1Acceleration, j2Velocity, j2Acceleration, j3Velocity, j3Acceleration, j4Velocity, j4Acceleration, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetPTPJointParams(j1Velocity, j1Acceleration, j2Velocity, j2Acceleration, j3Velocity, j3Acceleration, j4Velocity, j4Acceleration, isQueued, callback);
    },
    GetPTPJointParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetPTPJointParams(callback);
    },
    SetPTPCoordinateParams:function(xyzVelocity, rVelocity, xyzAcceleration,  rAcceleration,  isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetPTPCoordinateParams(xyzVelocity, rVelocity, xyzAcceleration,  rAcceleration,  isQueued, callback);
    },
    GetPTPCoordinateParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetPTPCoordinateParams(callback);
    },
    SetPTPJumpParams:function(jumpHeight, maxJumpHeight, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetPTPJumpParams(jumpHeight, maxJumpHeight, isQueued, callback);
    },
    GetPTPJumpParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetPTPJumpParams(callback);
    },
    SetPTPCommonParams:function(velocityratio, accelerationratio, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetPTPCommonParams(velocityratio, accelerationratio, isQueued, callback);
    },
    GetPTPCommonParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetPTPCommonParams(callback);
    },
    SetPTPCmd:function(ptpMode, x, y, z, rHead, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetPTPCmd(ptpMode, x, y, z, rHead, isQueued, callback);
    },
    SetCPParams:function(planAcc, juncitionVel, acc, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetCPParams(planAcc, juncitionVel, acc, isQueued, callback);
    },
    GetCPParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetCPParams(callback);
    },
    SetCPCmd:function(cpMode, x, y, z, velocity, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetCPCmd(cpMode, x, y, z, velocity, isQueued, callback);
    },
    SetARCParams:function(temp, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetARCParams(temp, isQueued, callback);
    },
    GetARCParams:function(callback){
        callback = callback || function(){}
        this.jsApi.GetARCParams(callback);
    },
    SetARCCmd:function(cirPoint, toPoint, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetARCCmd(cirPoint, toPoint, isQueued, callback);
    },
    SetWAITCmd:function(waitTime, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetWAITCmd(waitTime, isQueued, callback);
    },
    SetTRIGCmd:function(address, mode, condition, threshold, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetTRIGCmd(address, mode, condition, threshold, isQueued, callback);
    },
    SetIOMultiplexing:function(address, multiplex, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetIOMultiplexing(address, multiplex, isQueued, callback);
    },
    GetIOMultiplexing:function(addr, callback){
        callback = callback || function(){}
        this.jsApi.GetIOMultiplexing(addr, callback);
    },
    SetIODO:function(address, level, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetIODO(address, level, isQueued, callback);
    },
    GetIODO:function(addr, callback){
        callback = callback || function(){}
        this.jsApi.GetIODO(addr, callback);
    },
    SetIOPWM:function(address, frequency, dutyCycle, isQueued, callback){
        callback = callback || function(){}
        this.jsApi.SetIOPWM(address, frequency, dutyCycle, isQueued, callback);
    },
    GetIOPWM:function(addr, callback){
        callback = callback || function(){}
        this.jsApi.GetIOPWM(addr, callback);
    },
    GetIODI:function(addr, callback){
        callback = callback || function(){}
        this.jsApi.GetIODI(addr, callback);
    },
    GetIOADC:function(addr, callback){
        callback = callback || function(){}
        this.jsApi.GetIOADC(addr, callback);
    },
    SetAngleSensorStaticError:function(rearArmAngleError, frontArmAngleError){
        this.jsApi.SetAngleSensorStaticError(rearArmAngleError, frontArmAngleError);
    },
    GetAngleSensorStaticError:function(callback){
        callback = callback || function(){}
        this.jsApi.GetAngleSensorStaticError(callback);
    },
    
    close:function (callback) {
        callback = callback || function(){}
        this.jsApi.close(callback);
    },

},dobot)
window.dobot = dobot;
window.onload = function() {
    //dobot.output("111")
    dobot.init()
}
