import * as THREE from 'https://unpkg.com/three@0.164.1/build/three.module.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const fov = 90; // 視野角をさらに広げて遠近感を強調
    const aspect = 2;
    const near = 0.1;
    const far = 8000; // 描画範囲をさらに奥に広げる
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 1;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0003); // フォグを調整

    // ★修正点1: 円形のグラデーションテクスチャを生成する関数
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

    const starCount = 15000; // 星の数を増やす
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const geometry = new THREE.BufferGeometry();

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        // ★修正点1: XYの広がりをさらに大きくする
        positions[i3] = (Math.random() - 0.5) * 1000;
        positions[i3 + 1] = (Math.random() - 0.5) * 1000;
        positions[i3 + 2] = (Math.random() - 0.5) * 8000; // Z方向の配置範囲をさらに奥に広げる

        const color = new THREE.Color();
        color.setHSL(Math.random(), 0.7, 0.8);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 5, // テクスチャに合わせてサイズ調整
        map: createCircleTexture(), // ★修正点1: 生成した円形テクスチャを使用
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false, // 加算合成を綺麗に見せるため
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

        const delta = Math.min(clock.getDelta(), 0.05); // フレームレートの急変動に対応
        const speed = 1200; // 速度をさらに高速に固定

        const positions = stars.geometry.attributes.position.array;
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            positions[i3 + 2] += delta * speed;

            if (positions[i3 + 2] > camera.position.z) {
                positions[i3] = (Math.random() - 0.5) * 1000;
                positions[i3 + 1] = (Math.random() - 0.5) * 1000;
                positions[i3 + 2] = -4000 - Math.random() * 4000; // 再配置のZ座標もさらに奥に広げる
            }
        }
        stars.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();