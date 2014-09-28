var M3D = function () {
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.light = null;
    this.cube = null;
    this.cap = null;
    this.player = null;
    this.canvas = null;
    this.meterWidth = null;
    this.meterNum = null;
    this.isInit = false;
};

M3D.prototype = {
    init: function (c) {
        if (this.isInit == true) return;
        this.isInit = true;
        ///this.player = p;
        this.canvas = c;

        var width = c.clientWidth, height = c.clientHeight;
        var cubeColor = 0x00FF00;
        this.meterWidth = 10,
        this.meterNum = 16;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        //create canvas
        this.canvas.appendChild(this.renderer.domElement);
        // ???
        this.renderer.setClearColor(0xFFFFFF, 1.0);
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        //set camera positon
        this.camera.position.x = 400;
        this.camera.position.y = -50;
        this.camera.position.z = 600;
        //set camera z for up
        this.camera.up.x = 0;
        this.camera.up.y = 0;
        this.camera.up.z = 1;
        //set fov center
        this.camera.lookAt({ x: 0, y: 0, z: 0 });
        this.scene = new THREE.Scene();
        this.light = new THREE.DirectionalLight(0xFFFFFF, 1, 0, 0);
        this.light.position.set(50, 50, 50);
        var light2 = new THREE.DirectionalLight(0xFFFFFF, 1, 0, 0);
        light2.position.set(400, 100, 100);
        this.scene.add(light2);
        this.scene.add(this.light);
        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
        //object
        this.cube = Array();
        this.Cube();

        //var basicMater = new THREE.MeshBasicMaterial({ color: 0x000000 });
        //var floor = new THREE.Mesh(new THREE.PlaneGeometry(width, height), basicMater);
        //floor.material.side = THREE.DoubleSide;
        //floor.position.set(0, -50, 0);
        //floor.receiveShadow = true;
        //var top = floor.clone();
        //top.position.z = height;
        //var wall = Array();
        //basicMater = new THREE.MeshBasicMaterial({ color: 0x0000FF });
        //wall[0] = new THREE.Mesh(new THREE.PlaneGeometry(width, height), basicMater);
        //wall[0].material.side = THREE.DoubleSide;
        //wall[0].position.set(0, -200, height / 2);
        //wall[0].rotation.x = Math.PI / 2;
        //wall[1] = wall[0].clone();
        //wall[1].position.set(0, 100, height / 2);
        //wall[1].rotation.x = -1 * Math.PI / 2;
        //basicMater = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
        //wall[2] = new THREE.Mesh(new THREE.PlaneGeometry(height, height), basicMater);
        //wall[2].position.set(-1 * width / 2, -50, height / 2);
        //wall[2].rotation.y = Math.PI / 2;
        //wall[3] = wall[2].clone();
        //wall[3].position.x = width / 2;

        //this.scene.add(top);
        //this.scene.add(wall[0]);
        //this.scene.add(wall[1]);
        //this.scene.add(wall[2]);
        //this.scene.add(wall[3]);
        //this.scene.add(floor);
        //alert(typeof this.cube[0]);
        //var ii = 0;
        //while (ii < 100)
        //this.cube[ii++].material.setValues({ color: new THREE.Color(0xffffff) });
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    },
    Globe: function () {
        var cnt = 0;
        for (var k = 0; k < 90; k++) {
            for (var i = 0; i < 90; i++) {
                this.cube[cnt] = new THREE.Mesh(
                        new THREE.BoxGeometry(20, 20, 600),
                        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
                    );
                this.cube[cnt].position.set(0, 0, 0);
                this.cube[cnt].rotation.x = i / 2;
                this.cube[cnt].rotation.y = k / 2;
                this.scene.add(this.cube[cnt++]);
            }
        }
        console.log("Cube Count: " + cnt + "\n");
    },
    Cube: function () {
        var cct = 0, step = this.meterWidth + 1;
        for (var i = 0; i < this.meterNum; i++) {
            for (var j = 0; j < this.meterNum; j++) {
                var cl = new THREE.Color(0x0d0cea);
                this.cube[cct] = new THREE.Mesh(
                            new THREE.BoxGeometry(this.meterWidth, this.meterWidth, 10),
                            new THREE.MeshLambertMaterial({ color: cl })
                        );
                this.cube[cct].position.set(-10 + i * step, -160 + step * j, 0);
                this.scene.add(this.cube[cct++]);
            }
        }
        console.log("Cube count: " + cct);
    },
    ShowMeter: function (analyser) {
        var canvas = this.canvas,
            meterNum = this.meterNum,
            that = this;
        var timer = 0;
        var renderAnimation = function () {
            that.renderer.clear();
            if (analyser) {
                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                var step = Math.round(array.length / (meterNum * meterNum));
                var ctt = 0;
                for (var i = 0; i < meterNum; i++) {
                    for (var j = 0; j < meterNum; j++) {
                        var value = array[ctt * step] / 4;
                        value = value < 1 ? 1 : value;
                        that.cube[ctt++].scale.z = value;
                    }
                }
                /*var len = that.cube.length / 1024;
                while (ctt < 1024) {
                var value = array[ctt++] / 8;
                for (var i = (ctt - 1) * len;i < ctt * len;i++){
                if (that.cube[i] instanceof Object)
                that.cube[i].scale.z = value;
                }
                }*/
            };
            that.controls.update();
            that.renderer.render(that.scene, that.camera);
            window.requestAnimationFrame(renderAnimation);
        };
        window.requestAnimationFrame(renderAnimation);
    }
};