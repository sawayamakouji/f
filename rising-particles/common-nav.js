document.addEventListener('DOMContentLoaded', () => {
    const owner = 'sawayamakouji';
    const repo = 'f';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;

    let projectNames = []; // デモのフォルダ名を格納する配列
    let currentIndex = -1; // 現在のデモのインデックス

    // GitHub APIからプロジェクトリストを取得
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            projectNames = data.filter(item => item.type === 'dir' && !item.name.startsWith('.'))
                               .map(item => item.name)
                               .sort(); // ソートしておくと順番が安定する

            // 現在のページのフォルダ名を見つける
            const currentPath = window.location.pathname;
            const currentFolderName = currentPath.split('/').filter(Boolean).pop(); // 例: "tube-flight"
            currentIndex = projectNames.indexOf(currentFolderName);

            if (currentIndex === -1) {
                console.warn('Current project not found in the list.');
            }
        })
        .catch(error => {
            console.error('Error fetching project list for navigation:', error);
        });

    // キーボードイベントリスナー
    window.addEventListener('keydown', (event) => {
        if (projectNames.length === 0 || currentIndex === -1) {
            console.warn('Project list not ready for navigation.');
            return;
        }

        let nextIndex = currentIndex;
        let navigate = false;

        switch (event.key) {
            case 'ArrowRight':
            case 'd':
            case 'D':
                nextIndex = (currentIndex + 1) % projectNames.length;
                navigate = true;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                nextIndex = (currentIndex - 1 + projectNames.length) % projectNames.length;
                navigate = true;
                break;
            case ' ': // スペースキー
                nextIndex = Math.floor(Math.random() * projectNames.length);
                // 現在のページと同じならもう一度ランダムに選ぶ
                if (nextIndex === currentIndex && projectNames.length > 1) {
                    nextIndex = (nextIndex + 1) % projectNames.length; // 少なくとも1つずらす
                }
                navigate = true;
                event.preventDefault(); // スペースキーでスクロールするのを防ぐ
                break;
        }

        if (navigate) {
            const nextProjectName = projectNames[nextIndex];
            const newUrl = `../${nextProjectName}/`; // 相対パスで移動
            window.location.href = newUrl;
        }
    });
});