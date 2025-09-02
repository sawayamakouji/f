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
    overlay.style.backgroundColor = 'black';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none'; // クリックを透過させる
    overlay.style.transition = 'opacity 0.5s ease-in-out'; // フェードイン/アウト

    // ページ遷移を開始する関数
    window.startPageTransition = (url) => {
        overlay.style.pointerEvents = 'auto'; // クリックをブロック
        overlay.style.opacity = '1'; // フェードイン開始

        setTimeout(() => {
            window.location.href = url; // アニメーション完了後に遷移
        }, 500); // transitionの時間に合わせる
    };

    // ページ読み込み完了時にオーバーレイをフェードアウト
    window.addEventListener('load', () => {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    });
});