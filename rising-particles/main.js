import * as THREE from 'https://unpkg.com/three@0.164.1/build/three.module.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 100); // カメラを正面に設定
    camera.lookAt(0, 0, 0); // 原点を向くように設定

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0005);

    function createCircleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }

    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const geometry = new THREE.BufferGeometry();

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 100; // Xの広がり
        positions[i3 + 1] = (Math.random() - 0.5) * 100 - 50; // Yを下部に配置
        positions[i3 + 2] = (Math.random() - 0.5) * 100; // Zの広がり

        const color = new THREE.Color();
        color.setHSL(Math.random(), 0.7, 0.8);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2, // サイズ調整
        map: createCircleTexture(),
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    const clock = new THREE.Clock();

    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        const delta = Math.min(clock.getDelta(), 0.05);
        const speed = 50; // 上がる速度

        const positions = stars.geometry.attributes.position.array;
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            positions[i3 + 1] += delta * speed; // Y軸方向に上昇

            if (positions[i3 + 1] > 50) { // 画面上部を通り過ぎたら
                positions[i3] = (Math.random() - 0.5) * 100;
                positions[i3 + 1] = -50; // 下に戻す
                positions[i3 + 2] = (Math.random() - 0.5) * 100;
            }
        }
        stars.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();