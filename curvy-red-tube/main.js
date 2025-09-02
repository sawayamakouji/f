import * as THREE from 'https://unpkg.com/three@0.164.1/build/three.module.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // 1. チューブの経路となる、滑らかな曲線を作成
    const points = [];
    // 点の数を増やし、計算式を調整してより複雑なカーブに
    for (let i = 0; i < 20; i++) {
        points.push(new THREE.Vector3(
            Math.sin(i * 0.5) * 50 + (Math.random() - 0.5) * 25,
            Math.cos(i * 0.3) * 50 + (Math.random() - 0.5) * 25,
            Math.sin(i * 0.4) * 50 + (Math.random() - 0.5) * 25
        ));
    }
    // CatmullRomCurve3で点を滑らかに結ぶ。第二引数 `true` で曲線を閉じてループさせる。
    const curve = new THREE.CatmullRomCurve3(points, true);

    // 2. 曲線に沿ったチューブのジオメトリを作成
    // (パス, パスの分割数, 半径, 円周の分割数, 閉じるか)
    const tubeGeometry = new THREE.TubeGeometry(curve, 300, 1.5, 8, true);

    // 3. チューブの見た目を設定（ワイヤーフレーム）
    const material = new THREE.MeshBasicMaterial({
        color: 0xff4444, // 赤っぽい色に変更
        wireframe: true // ワイヤーフレームで表示
    });

    const tubeMesh = new THREE.Mesh(tubeGeometry, material);
    scene.add(tubeMesh);


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

    function render(time) {
        time *= 0.0001; // 進行速度のベース

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // 4. カメラをパスに沿って動かす
        const t = time % 1; // 進行度 (0.0 ~ 1.0)

        // パス上の現在位置を取得してカメラに設定
        const position = curve.getPointAt(t);
        camera.position.copy(position);

        // パス上の少し先の位置を取得
        const lookAtPosition = curve.getPointAt((t + 0.01) % 1);

        // カメラの向きを、常に進行方向（少し先）に向ける
        camera.lookAt(lookAtPosition);

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
