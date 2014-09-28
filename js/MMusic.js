var Player = function () {
    this.file = null;
    this.fileName = null;
    this.audioContext = null;
    this.source = null;
    this.animationId = null;
    this.status = null;
    this.forceStop = false;
    this.canvas = null;
    this.allCapsReachBottom = false;
    this.startOffset = 0;
    this.startTime = 0;
    this.msbuffer = null;
    this.m3d = null;
    this.b3d = null;
    this.model = "B3D";
};

Player.prototype = {
    loadSound: function (url) {
        var that = this;
        that._initPlayer();
        var request = new XMLHttpRequest();
        var audioContext = this.audioContext;
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            if (that.status === 1) {
                that.forceStop = true;
            };
            that.audioContext.decodeAudioData(request.response, function (buffer) {
                that.startOffset = 0;
                that.msbuffer = buffer;
                that._visualize(audioContext, buffer);
            }, function () {
                alert("decode error");
            });
        };
        request.send();
    },
    totalTime: function () {
        if (this.msbuffer == null) return 0;
        return this.msbuffer.duration;
    },
    pause: function () {
        if (this.status === 0) {
            return;
        };
        if (this.source === null) {
            return;
        };
        this.source.stop(0);
        this.startOffset += this.audioContext.currentTime - this.startTime;
    },
    resume: function () {
        this._visualize(this.audioContext, this.msbuffer);
    },
    duration: function () {
        //console.log(this.startOffset + this.audioContext.currentTime - this.startTime);
        return this.startOffset + this.audioContext.currentTime - this.startTime;
    },
    setDur: function (t) {
        this.pause();
        this.startOffset = t;
        this.resume();
    },
    onStart: function () { },
    onEnd: function () { },
    _initPlayer: function () {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
        try {
            this.audioContext = new AudioContext();
        } catch (e) {
            alert("Cannot creaet AudioContext");
            consloe.log(e);
        }
    },
    _start: function () {
        var that = this,
            file = this.file,
            fr = new FileReader();
        fr.onload = function (e) {
            var fileResult = e.target.result;
            var audioContext = that.audioContext;
            if (audioContext == null) {
                return;
            };
            audioContext.decodeAudioData(fileResult, function (buffer) {
                that.msbuffer = buffer;
                that._visualize(audioContext, buffer);
            }, function (e) {
                alert("Decode Error!");
                console.log(e);
            });
        };

        fr.onerror = function (e) {
            alert("Fail open file");
        }

        fr.readAsArrayBuffer(file);
    },
    _visualize: function (audioContext, buffer) {
        var audioBufferSourceNode = audioContext.createBufferSource(),
            analyser = audioContext.createAnalyser(),
            that = this;
        this.startTime = audioContext.currentTime;
        this.onStart();
        audioBufferSourceNode.connect(analyser);
        analyser.connect(audioContext.destination);
        audioBufferSourceNode.buffer = buffer;
        if (!audioBufferSourceNode.start) {
            audioBufferSourceNode.start = audioBufferSourceNode.noteOn;
            audioBufferSourceNode.stop = audioBufferSourceNode.noteOff;
        };
        if (this.animationId !== null) {
            cancelAnimationFrame(this, this.animationId);
        }
        if (this.source !== null) {
            this.source.stop(0);
        }
        console.log("D: " + buffer.duration);
        audioBufferSourceNode.start(0, this.startOffset % buffer.duration);
        this.status = 1;
        this.source = audioBufferSourceNode;
        audioBufferSourceNode.onended = function () {
            that._audioEnd(that);
        };

        switch (this.model) {
            case "2D":
                this._drawSpectrum2D(analyser);
                break;
            case "B3D":
                this._drawSpectrumB3D(analyser);
                break;
        }
    },
    initM3D: function () {
        if (this.canvas == null) return;
        if (this.m3d == null) this.m3d = new M3D();
        this.m3d.init(this.canvas);
    },
    initB3D: function (c) {
        if (this.b3d == null) this.b3d = new B3D();
        this.b3d.init(c);
    },
    DisB3D: function () {
        this.b3d.Dispose();
    },
    init2D: function (c) {
        this.canvas = c;
    },
    initModel: function (c) {
        this.initB3D(c);
        this.init2D(c);
    },
    _drawSpectrum2D: function (analyser) {
        this._drawSpectrum(analyser);
    },
    _drawSpectrumM3D: function (analyser) {
        this.m3d.ShowMeter(analyser);
    },
    _drawSpectrumB3D: function (analyser) {
        this.b3d.ShowMeter(analyser);
    },
    _drawSpectrum: function (analyser) {
        var that = this,
            canvas = this.canvas,
            cwidth = canvas.width,
            cheight = canvas.height - 2,
            meterWidth = 10,
            gap = 2,
            capHeight = 2,
            capStyle = '#fff',
            meterNum = cwidth / (meterWidth + gap),
            capYPositionArray = [];
        var ctx = canvas.getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, '#000000');
        gradient.addColorStop(0.75, '#ff0000');
        gradient.addColorStop(0.5, '#ffff00');
        gradient.addColorStop(0, '#ffffff');
        var drawMeter = function () {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            if (that.status === 0) {
                for (var i = array.length - 1; i >= 0; i--) {
                    array[i] = 0;
                };
                this.allCapsReachBottom = true;
                for (var i = capYPositionArray.length - 1; i >= 0; i--) {
                    allCapsReachBottom = allCapsReachBottom && (capYPositionArray[i] === 0);
                };
                if (allCapsReachBottom) {
                    cancelAnimationFrame(that.animationId);
                    return;
                };
            };
            var step = Math.round(array.length / meterNum);
            ctx.clearRect(0, 0, cwidth, cheight);
            for (var i = 0; i < meterNum; i++) {
                var value = array[i * step];
                if (capYPositionArray.length < Math.round(meterNum)) {
                    capYPositionArray.push(value);
                };
                ctx.fillStyle = capStyle;
                if (value < capYPositionArray[i]) {
                    ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
                } else {
                    ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                    capYPositionArray[i] = value;
                };
                ctx.fillStyle = gradient;
                ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight);
            }
            that.animationId = requestAnimationFrame(drawMeter);
        }
        this.animationId = requestAnimationFrame(drawMeter);
    },
    _audioEnd: function (instance) {
        if (this.duration() >= this.totalTime() - 4)
            this.onEnd();
        if (this.forceStop) {
            this.forceStop = false;
            this.status = 1;
            return;
        }
        this.status = 0;
    }
};