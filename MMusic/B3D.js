var B3D = function () {
    this.boxNum = 20;
    this.boxs = Array();
    this.scene = null;
    this.engine = null;
    this.caps = Array(),
    this.canvas = null;
};

B3D.prototype = {
    init: function (c) {
        this.canvas = c;
        var canvas = c;
        this.engine = new BABYLON.Engine(canvas, true);
        var engine = this.engine;
        var boxNum = this.boxNum,
            step = 6,
            that = this,
            wallSize = 500;

        var createScene = function () {
            var scene = new BABYLON.Scene(engine);
            var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI, Math.PI / 2, 150, new BABYLON.Vector3(0, 0, 0), scene);
            camera.lowerBetaLimit = 0.1;
            camera.upperBetaLimit = Math.PI / 2 * 0.99;
            camera.upperRadiusLimit = 300;
            camera.lowerRadiusLimit = 20;
            camera.attachControl(canvas, false);
            var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
            groundMaterial.specularColor = BABYLON.Color3.White();
            var ground = BABYLON.Mesh.CreateGround("ground", wallSize, wallSize, 1, scene, false);
            ground.material = groundMaterial;
            //var left = BABYLON.Mesh.CreatePlane("left", wallSize, scene);
            //left.material = groundMaterial;
            //left.rotation.y = Math.PI / 2;
            //left.position.x = wallSize / 2;
            //var right = BABYLON.Mesh.CreatePlane("right", wallSize, scene);
            //right.rotation.y = Math.PI / 2;
            //right.position.x = -1 * wallSize / 2;
            //right.material = groundMaterial;
            //var front = BABYLON.Mesh.CreatePlane("front", wallSize, scene);
            //front.rotation.z = Math.PI / 2;
            //front.position.x = wallSize / 2;
            //front.material = groundMaterial;
            //var back = BABYLON.Mesh.CreatePlane("back", wallSize, scene);
            //back.rotation.z = Math.PI / 2
            //back.position.x = -1 * wallSize / 2;
            //back.material = groundMaterial;
            var light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(0, 20, 0), scene);
            var boxMat = new BABYLON.StandardMaterial("ground", scene);
            boxMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            boxMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            boxMat.emissiveColor = BABYLON.Color3.Blue();
            var capMat = new BABYLON.StandardMaterial("ground", scene);
            capMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            capMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            capMat.emissiveColor = BABYLON.Color3.White();
            var cnt = 0;
            for (var i = 0; i < boxNum; i++) {

                that.boxs[cnt] = BABYLON.Mesh.CreateBox("Box" + cnt, 5.0, scene);
                that.caps[cnt] = BABYLON.Mesh.CreateBox("Cap" + cnt, 5.0, scene);
                that.caps[cnt].position.z = boxNum * step / -2 + i * step;
                that.boxs[cnt].position.z = boxNum * step / -2 + i * step;
                //  that.caps[cnt].position.x = boxNum * step / -2 + j * step;
                //  that.boxs[cnt].position.x = boxNum * step / -2 + j * step;
                that.caps[cnt].material = capMat;
                that.boxs[cnt].scaling.y = 0;
                that.boxs[cnt++].material = boxMat;

            }
            return scene;
        };

        this.scene = createScene();
        var scene = this.scene;
        engine.runRenderLoop(function () {
            scene.render();
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });
    },
    ShowMeter: function (analyser) {
        var canvas = this.canvas,
            meterNum = this.boxNum,
            that = this;
        var capYPositionArray = Array();
        var renderAnimation = function () {
            if (analyser) {
                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                var step = Math.round(array.length / (meterNum));
                var ctt = 0;
                for (var i = 0; i < meterNum; i++) {
                    var value = array[ctt * step] / 6;
                    var v = value * 2.7;
                    if (capYPositionArray.length < Math.round(meterNum * meterNum)) {
                        capYPositionArray.push(v);
                    };
                    if (v < capYPositionArray[ctt]) {
                        that.caps[ctt].position.y = (--capYPositionArray[ctt]);
                    } else {
                        that.caps[ctt].position.y = v;
                        capYPositionArray[ctt] = v;
                    };
                    value = value < 1 ? 1 : value;
                    that.boxs[ctt++].scaling.y = value;
                }
            };
            window.requestAnimationFrame(renderAnimation);
        };
        window.requestAnimationFrame(renderAnimation);
    },
    Dispose: function () {
        this.canvas.parentNode.removeChild(this.canvas);
    }
};