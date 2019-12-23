/* eslint-disable */

import * as THREE from 'three';
import * as Stats from 'stats.js';
import { WarmMagma } from 'color-curves';
import { Stars } from './subjects/Stars';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class SceneManager {

    constructor(canvas) {

        this.that = this;
        this.canvas = canvas;
        this.clock = new THREE.Clock(true);

        this.screenDimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        this.animate = this.animate.bind(this);
        this.render = this.render.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

    }

    init() {
        return new Promise((resolve, reject) => {
            try {
                // lights, camera, action
                this.scene = this.initScene();
                this.renderer = this.initRender();
                this.camera = this.initCamera();
                this.lights = this.initLights();
                this.helpers = this.initHelpers();
                this.subjects = this.initSubjects();
                this.controls = this.initControls();
                resolve();
            } catch (e) {
                console.error(e);
                reject(e)
            }
        })
    }

    animate() {
        this.helpers.stats.begin();
        this.render();
        this.helpers.stats.end();
        requestAnimationFrame(this.animate);
    }

    render() {
        this.subjects.stars.update(this.clock.getDelta());
        this.controls.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
    }

    initScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1F262F);
        return scene;
    }

    initRender() {

        const renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });

        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;

        renderer.setSize(this.screenDimensions.width, this.screenDimensions.height);
        renderer.setPixelRatio(DPR);

        return renderer;

    }

    initCamera() {

        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 1000;
        const aspect = this.screenDimensions.width / this.screenDimensions.height;
        const camera = new THREE.PerspectiveCamera(fieldOfView, 1, nearPlane, farPlane);
        camera.aspect = aspect;
        camera.position.set(0, 0, 150);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.updateProjectionMatrix();
        return camera;

    }

    initLights() {

        const ambient = new THREE.AmbientLight(0xffffff, 1)
        const sunlight = new THREE.SpotLight(0xffffff, 1);
        sunlight.position.set(100, 100, 100);

        const lights = {
            ambient,
            sunlight
        }

        this.scene.add(lights.ambient);
        this.scene.add(lights.sunlight);
        this.lights = lights;

    }

    initHelpers() {
        const stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        stats.dom.style.left = null;
        stats.dom.style.right = '0px';
        document.body.appendChild(stats.dom);

        const helpers = {
            stats: stats,
        }

        return helpers;
    }

    initSubjects() {

        const planetGeo = new THREE.SphereBufferGeometry(50, 64, 64);
        const planetMat = new THREE.MeshToonMaterial({
            color: 0x013220
        });
        const planetMesh = new THREE.Mesh(planetGeo, planetMat);

        const starPalette = new WarmMagma();

        const stars = new Stars(
            this.scene,
            new THREE.Vector3(0, 0, 0),
            300,
            1000, {
            colorPalette: (n) => starPalette.hexValueAt(n)
        }
        )

        this.scene.add(planetMesh);

        return {
            planet: planetMesh,
            stars
        };

    }

    initControls() {
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        orbitControls.autoRotate = true;
        orbitControls.autoRotateSpeed = .1;
        return {
            orbitControls
        };
    }

    onWindowResize(newWidth, newHeight) {
        this.screenDimensions.width = newWidth;
        this.screenDimensions.height = newHeight;
        this.camera.aspect = newWidth / newHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(newWidth, newHeight);
    }

};