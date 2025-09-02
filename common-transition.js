document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.createElement('div');
    overlay.id = 'transition-overlay';
    document.body.appendChild(overlay);

    // 基本的なスタイル
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'transparent'; // ★修正点: オーバーレイ自体は透明に
    overlay.style.pointerEvents = 'none';
    overlay.style.overflow = 'hidden'; // はみ出しを隠す
    overlay.style.zIndex = '9999'; // 最前面に表示

    // 画面を分割するグリッドを作成
    const gridSize = 10; // 10x10のグリッド
    const fragmentSize = 100 / gridSize; // 各フラグメントのサイズ（%）
    const fragments = [];

    for (let i = 0; i < gridSize * gridSize; i++) {
        const fragment = document.createElement('div');
        fragment.className = 'transition-fragment';
        fragment.style.position = 'absolute';
        fragment.style.width = `${fragmentSize}%`;
        fragment.style.height = `${fragmentSize}%`;
        fragment.style.left = `${(i % gridSize) * fragmentSize}%`;
        fragment.style.top = `${Math.floor(i / gridSize) * fragmentSize}%`;
        fragment.style.backgroundColor = 'black';
        fragment.style.opacity = '0'; // 初期状態は透明
        fragment.style.transform = 'scale(0)'; // 初期状態は縮小
        fragment.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        overlay.appendChild(fragment);
        fragments.push(fragment);
    }

    // ページ遷移を開始する関数
    window.startPageTransition = (url) => {
        overlay.style.pointerEvents = 'auto';
        // 各フラグメントをランダムにアニメーションさせて画面を覆う
        fragments.forEach((fragment, index) => {
            const delay = Math.random() * 0.3; // ランダムな遅延
            fragment.style.transitionDelay = `${delay}s`;
            fragment.style.opacity = '1'; // 表示
            fragment.style.transform = 'scale(1)'; // 拡大
        });

        setTimeout(() => {
            window.location.href = url; // アニメーション完了後に遷移
        }, 800); // アニメーション時間より少し長めに設定
    };

    // ページ読み込み完了時にオーバーレイをフェードアウト
    window.addEventListener('load', () => {
        // 各フラグメントをランダムにアニメーションさせて画面から消す
        fragments.forEach((fragment, index) => {
            const delay = Math.random() * 0.3; // ランダムな遅延
            fragment.style.transitionDelay = `${delay}s`;
            fragment.style.opacity = '0'; // 透明
            fragment.style.transform = 'scale(0)'; // 縮小
        });
        setTimeout(() => {
            overlay.style.pointerEvents = 'none';
        }, 800); // アニメーション時間より少し長めに設定
    });
});