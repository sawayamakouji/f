document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('transition-overlay'); // HTMLに直接置く
    if (!overlay) {
        console.error('Transition overlay element not found!');
        return;
    }

    // ページ遷移を開始する関数
    window.startPageTransition = (url) => {
        overlay.classList.add('is-active'); // アニメーション開始クラスを追加

        // アニメーション完了後に遷移
        overlay.addEventListener('animationend', () => {
            window.location.href = url;
        }, { once: true }); // 一度だけ実行
    };

    // ページ読み込み完了時にオーバーレイをフェードアウト
    window.addEventListener('load', () => {
        overlay.classList.add('is-leaving'); // 離脱アニメーション開始クラスを追加

        // アニメーション完了後にクラスを削除
        overlay.addEventListener('animationend', () => {
            overlay.classList.remove('is-active', 'is-leaving');
        }, { once: true });
    });
});