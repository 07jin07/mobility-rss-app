/**
 * モビリティ業界RSS情報収集アプリ - 先進版
 * 詳細カテゴリ分類とアニメーション機能付き
 */

// グローバル変数
let allArticles = [];
let filteredArticles = [];
let activeFilters = {
    main: 'all',
    company: null,
    tech: null,
    government: null
};
let categoryChart = null;

// サンプル記事データ（提供されたデータを使用）
const SAMPLE_ARTICLES = [
    {
        id: 1,
        title: "トヨタ、次世代SDVプラットフォーム「arene」の開発を発表",
        description: "トヨタ自動車は、ソフトウェア定義車両（SDV）の実現に向けた包括的なプラットフォーム「arene」の開発について詳細を発表。エッジコンピュート層での高性能処理とクラウド連携を重視。",
        link: "#",
        date: new Date("2025-05-28"),
        source: "トヨタ自動車",
        category: "technology",
        subCategory: "toyota",
        techCategory: "sdv",
        sdvLayer: "edge_compute",
        tags: ["SDV", "arene", "プラットフォーム", "クラウド連携"]
    },
    {
        id: 2,
        title: "ホンダ、新型ADAS技術「Honda SENSING Elite」を発表",
        description: "本田技研工業は、高度運転支援システムの最新版を発表。ACC、LKAS、AEBS機能を統合し、レベル3自動運転に対応した包括的なシステム。",
        link: "#",
        date: new Date("2025-05-27"),
        source: "ホンダ",
        category: "technology", 
        subCategory: "honda",
        techCategory: "adas",
        adasFunction: "acc",
        tags: ["ADAS", "Honda SENSING", "自動運転", "ACC", "LKAS"]
    },
    {
        id: 3,
        title: "経済産業省、SDV推進のための新規制フレームワークを策定",
        description: "経済産業省は、日本のSDV産業競争力強化に向けた新しい規制フレームワークを発表。OTA更新の安全基準やサイバーセキュリティ要件を明確化。",
        link: "#",
        date: new Date("2025-05-26"),
        source: "経済産業省",
        category: "policy",
        subCategory: "meti",
        techCategory: "sdv",
        tags: ["政策", "規制", "SDV", "OTA", "サイバーセキュリティ"]
    },
    {
        id: 4,
        title: "日産、自動運転レベル4技術「ProPILOT 4.0」の実証実験開始",
        description: "日産自動車は、高度運転自動化技術の実証実験を開始。限定的な環境下でのレベル4自動運転を実現し、2026年の実用化を目指す。",
        link: "#",
        date: new Date("2025-05-25"),
        source: "日産自動車",
        category: "technology",
        subCategory: "nissan", 
        techCategory: "autonomous_driving",
        tags: ["自動運転", "ProPILOT", "レベル4", "実証実験"]
    },
    {
        id: 5,
        title: "マツダ、内燃機関とEVの統合プラットフォーム戦略を発表",
        description: "マツダは、SKYACTIV技術をベースとした内燃機関とEVの統合プラットフォーム戦略を発表。2030年までにカーボンニュートラル実現を目指す。",
        link: "#",
        date: new Date("2025-05-24"),
        source: "マツダ",
        category: "technology",
        subCategory: "mazda",
        techCategory: "ev",
        tags: ["EV", "SKYACTIV", "プラットフォーム", "カーボンニュートラル"]
    },
    {
        id: 6,
        title: "国土交通省、自動運転レベル4の公道実用化に向けた道路法改正案",
        description: "国土交通省は、自動運転レベル4車両の公道での実用化に向けた道路法改正案を発表。専用レーンの設置や通信インフラの整備計画を含む。",
        link: "#",
        date: new Date("2025-05-23"),
        source: "国土交通省",
        category: "policy",
        subCategory: "mlit",
        techCategory: "autonomous_driving",
        tags: ["政策", "道路法", "自動運転", "インフラ整備"]
    },
    {
        id: 7,
        title: "スバル、新型アイサイトXに夜間歩行者検知機能を追加",
        description: "SUBARU は、先進運転支援システム「アイサイトX」の最新版に、赤外線カメラを用いた夜間歩行者検知機能（NV/PD）を追加。安全性を大幅に向上。",
        link: "#",
        date: new Date("2025-05-22"),
        source: "SUBARU",
        category: "technology",
        subCategory: "subaru",
        techCategory: "adas",
        adasFunction: "nvpd",
        tags: ["ADAS", "アイサイト", "歩行者検知", "夜間安全"]
    },
    {
        id: 8,
        title: "三菱自動車、AUTOSAR Adaptive Platform採用の車載システム開発",
        description: "三菱自動車工業は、次世代車載システム開発においてAUTOSAR Adaptive Platformを採用。柔軟なソフトウェア更新と高性能コンピューティングを実現。",
        link: "#",
        date: new Date("2025-05-21"),
        source: "三菱自動車",
        category: "technology",
        subCategory: "mitsubishi",
        techCategory: "sdv",
        sdvLayer: "edge_compute",
        tags: ["AUTOSAR", "車載システム", "SDV", "プラットフォーム"]
    }
];

// カテゴリ定義
const CATEGORIES = {
    main: {
        all: "全て",
        policy: "政策・規制", 
        technology: "技術・製品",
        market: "市場・事業",
        social: "社会・環境"
    },
    company: {
        toyota: "トヨタ",
        honda: "ホンダ", 
        nissan: "日産",
        mazda: "マツダ",
        subaru: "スバル",
        mitsubishi: "三菱"
    },
    tech: {
        sdv: "SDV",
        adas: "ADAS", 
        ev: "EV",
        autonomous_driving: "自動運転"
    },
    government: {
        meti: "経済産業省",
        mlit: "国土交通省"
    }
};

// アプリケーション初期化
function initializeApp() {
    console.log('先進版アプリケーション初期化開始');
    
    try {
        // カスタムカーソルの初期化
        initializeCustomCursor();
        
        // イベントリスナーの設定
        setupEventListeners();
        
        // 初期ローディング表示
        showLoadingOverlay();
        
        // 2秒後にデータロードとアニメーション開始
        setTimeout(() => {
            try {
                loadSampleData();
                hideLoadingOverlay();
                setTimeout(() => {
                    initializeCharts();
                }, 500);
                startEntranceAnimations();
            } catch (error) {
                console.error('データロード中にエラー:', error);
                hideLoadingOverlay();
                showErrorState();
            }
        }, 2000);
        
    } catch (error) {
        console.error('アプリケーション初期化エラー:', error);
        hideLoadingOverlay();
        showErrorState();
    }
}

// エラー状態表示
function showErrorState() {
    const container = document.getElementById('articlesGrid');
    if (container) {
        container.innerHTML = `
            <div class="glass-card">
                <div style="text-align: center; padding: 2rem; color: white;">
                    <h3>アプリケーションエラー</h3>
                    <p>アプリケーションの初期化中にエラーが発生しました。</p>
                    <button onclick="location.reload()" class="reset-btn">再読み込み</button>
                </div>
            </div>
        `;
    }
}

// カスタムカーソルの初期化
function initializeCustomCursor() {
    try {
        const cursor = document.getElementById('customCursor');
        if (!cursor) return;
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function updateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(updateCursor);
        }
        
        updateCursor();
        
        // ホバー効果
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('button, .article-card, .filter-btn')) {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = 'rgba(6, 214, 160, 1)';
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches('button, .article-card, .filter-btn')) {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = 'rgba(139, 92, 246, 0.8)';
            }
        }, true);
    } catch (error) {
        console.warn('カスタムカーソー初期化エラー:', error);
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    try {
        // 検索機能
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', handleSearch);
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSearch();
            });
            searchInput.addEventListener('input', debounce(handleRealTimeSearch, 300));
        }
        
        // 更新ボタン
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', handleRefresh);
        }
        
        // フィルターボタン
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                const type = e.target.dataset.type;
                handleFilterClick(filter, type, e.target);
            });
        });
        
        // リセットボタン
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetAllFilters);
        }
        
    } catch (error) {
        console.error('イベントリスナー設定エラー:', error);
    }
}

// ローディングオーバーレイ
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// エントランスアニメーション
function startEntranceAnimations() {
    try {
        const elements = document.querySelectorAll('.header, .controls-section, .filters-section, .main-content');
        elements.forEach((el, index) => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    } catch (error) {
        console.warn('エントランスアニメーションエラー:', error);
    }
}

// サンプルデータの読み込み
function loadSampleData() {
    try {
        allArticles = [...SAMPLE_ARTICLES];
        
        // 日付順にソート
        allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log(`${allArticles.length}件の記事を読み込み`);
        
        // 初期表示
        applyFilters();
        updateStatistics();
        updateTrends();
        updateLastUpdateTime();
    } catch (error) {
        console.error('サンプルデータ読み込みエラー:', error);
        throw error;
    }
}

// フィルター処理
function applyFilters() {
    try {
        filteredArticles = allArticles.filter(article => {
            // メインカテゴリフィルター
            if (activeFilters.main !== 'all' && article.category !== activeFilters.main) {
                return false;
            }
            
            // 企業フィルター
            if (activeFilters.company && article.subCategory !== activeFilters.company) {
                return false;
            }
            
            // 技術フィルター
            if (activeFilters.tech && article.techCategory !== activeFilters.tech) {
                return false;
            }
            
            // 政府機関フィルター
            if (activeFilters.government && article.subCategory !== activeFilters.government) {
                return false;
            }
            
            return true;
        });
        
        displayArticles();
        updateArticleCount();
    } catch (error) {
        console.error('フィルター処理エラー:', error);
    }
}

// 記事表示
function displayArticles() {
    try {
        const container = document.getElementById('articlesGrid');
        const noArticles = document.getElementById('noArticles');
        
        if (!container) return;
        
        if (filteredArticles.length === 0) {
            container.innerHTML = '';
            if (noArticles) {
                noArticles.classList.remove('hidden');
            }
            return;
        }
        
        if (noArticles) {
            noArticles.classList.add('hidden');
        }
        
        // 記事カードを生成
        container.innerHTML = filteredArticles.map((article, index) => 
            createArticleCard(article, index)
        ).join('');
        
        // クリックイベントを追加
        container.querySelectorAll('.article-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                const article = filteredArticles[index];
                openArticle(article);
            });
            
            // アニメーション遅延を設定
            card.style.animationDelay = `${index * 0.1}s`;
        });
        
    } catch (error) {
        console.error('記事表示エラー:', error);
    }
}

// 記事カード作成
function createArticleCard(article, index) {
    try {
        const categoryLabel = CATEGORIES.main[article.category] || 'その他';
        const formattedDate = formatDate(article.date);
        const tags = article.tags.slice(0, 3).map(tag => 
            `<span class="article-tag">${escapeHtml(tag)}</span>`
        ).join('');
        
        return `
            <div class="article-card" style="animation-delay: ${index * 0.1}s">
                <div class="article-header">
                    <h3 class="article-title">${escapeHtml(article.title)}</h3>
                    <span class="article-category">${categoryLabel}</span>
                </div>
                <p class="article-description">${escapeHtml(article.description)}</p>
                <div class="article-tags">${tags}</div>
                <div class="article-meta">
                    <span class="article-source">${escapeHtml(article.source)}</span>
                    <span class="article-date">${formattedDate}</span>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('記事カード作成エラー:', error);
        return '<div class="article-card">記事の表示でエラーが発生しました</div>';
    }
}

// フィルタークリック処理
function handleFilterClick(filter, type, button) {
    try {
        // 同タイプの他のボタンを非アクティブに
        document.querySelectorAll(`[data-type="${type}"]`).forEach(btn => {
            btn.classList.remove('active');
        });
        
        // クリックされたボタンの状態を切り替え
        if (activeFilters[type] === filter) {
            // 既にアクティブな場合は非アクティブに
            activeFilters[type] = type === 'main' ? 'all' : null;
            if (type === 'main' && filter === 'all') {
                button.classList.add('active');
            }
        } else {
            // 新しいフィルターを設定
            activeFilters[type] = filter;
            button.classList.add('active');
        }
        
        // フィルター適用
        applyFilters();
        
        // ボタンアニメーション
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    } catch (error) {
        console.error('フィルタークリック処理エラー:', error);
    }
}

// 検索処理
function handleSearch() {
    try {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        const query = searchInput.value.trim();
        performSearch(query);
    } catch (error) {
        console.error('検索処理エラー:', error);
    }
}

function handleRealTimeSearch() {
    try {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        const query = searchInput.value.trim();
        if (query.length > 2) {
            performSearch(query);
        } else if (query.length === 0) {
            applyFilters();
        }
    } catch (error) {
        console.error('リアルタイム検索エラー:', error);
    }
}

function performSearch(query) {
    try {
        if (!query) {
            applyFilters();
            return;
        }
        
        const lowerQuery = query.toLowerCase();
        filteredArticles = allArticles.filter(article => {
            return article.title.toLowerCase().includes(lowerQuery) ||
                   article.description.toLowerCase().includes(lowerQuery) ||
                   article.source.toLowerCase().includes(lowerQuery) ||
                   article.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
        });
        
        // メインフィルターも適用
        if (activeFilters.main !== 'all') {
            filteredArticles = filteredArticles.filter(article => 
                article.category === activeFilters.main
            );
        }
        
        displayArticles();
        updateArticleCount();
    } catch (error) {
        console.error('検索実行エラー:', error);
    }
}

// 更新処理
function handleRefresh() {
    try {
        const refreshBtn = document.getElementById('refreshBtn');
        
        if (refreshBtn) {
            // アニメーション効果
            refreshBtn.style.transform = 'scale(0.95)';
            const svg = refreshBtn.querySelector('svg');
            if (svg) {
                svg.style.transform = 'rotate(360deg)';
            }
        }
        
        setTimeout(() => {
            if (refreshBtn) {
                refreshBtn.style.transform = 'scale(1)';
                const svg = refreshBtn.querySelector('svg');
                if (svg) {
                    svg.style.transform = 'rotate(0deg)';
                }
            }
            
            // データ再読み込み
            loadSampleData();
            
            // 成功フィードバック
            showNotification('データを更新しました', 'success');
        }, 500);
    } catch (error) {
        console.error('更新処理エラー:', error);
    }
}

// 全フィルターリセット
function resetAllFilters() {
    try {
        activeFilters = {
            main: 'all',
            company: null,
            tech: null,
            government: null
        };
        
        // ボタンの状態をリセット
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const allBtn = document.querySelector('[data-filter="all"][data-type="main"]');
        if (allBtn) {
            allBtn.classList.add('active');
        }
        
        // 検索入力をクリア
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // フィルター適用
        applyFilters();
        
        showNotification('フィルターをリセットしました', 'info');
    } catch (error) {
        console.error('フィルターリセットエラー:', error);
    }
}

// 統計情報更新
function updateStatistics() {
    try {
        // 記事総数
        const totalArticlesEl = document.getElementById('totalArticles');
        const headerTotalArticlesEl = document.getElementById('headerTotalArticles');
        
        if (totalArticlesEl) {
            totalArticlesEl.textContent = allArticles.length;
        }
        if (headerTotalArticlesEl) {
            headerTotalArticlesEl.textContent = allArticles.length;
        }
        
        // カテゴリ別統計
        const categoryCounts = {};
        const companyCounts = {};
        const techCounts = {};
        
        allArticles.forEach(article => {
            categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
            if (article.subCategory) {
                companyCounts[article.subCategory] = (companyCounts[article.subCategory] || 0) + 1;
            }
            if (article.techCategory) {
                techCounts[article.techCategory] = (techCounts[article.techCategory] || 0) + 1;
            }
        });
        
        // 統計カウンター更新
        const categoryCountEl = document.getElementById('categoryCount');
        const companyCountEl = document.getElementById('companyCount');
        const techCountEl = document.getElementById('techCount');
        
        if (categoryCountEl) {
            categoryCountEl.textContent = Object.keys(categoryCounts).length;
        }
        if (companyCountEl) {
            companyCountEl.textContent = Object.keys(companyCounts).length;
        }
        if (techCountEl) {
            techCountEl.textContent = Object.keys(techCounts).length;
        }
        
        // 今日の記事数
        const today = new Date().toDateString();
        const todayCount = allArticles.filter(article => 
            article.date.toDateString() === today
        ).length;
        
        const todayCountEl = document.getElementById('todayCount');
        if (todayCountEl) {
            todayCountEl.textContent = todayCount;
        }
        
        // チャート更新
        updateChart(categoryCounts);
    } catch (error) {
        console.error('統計情報更新エラー:', error);
    }
}

// チャート初期化・更新
function initializeCharts() {
    try {
        const canvas = document.getElementById('categoryChart');
        if (!canvas || typeof Chart === 'undefined') {
            console.warn('チャートライブラリまたはcanvas要素が見つかりません');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', 
                        '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: {
                                size: 10
                            },
                            padding: 15
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('チャート初期化エラー:', error);
    }
}

function updateChart(categoryCounts) {
    try {
        if (!categoryChart) return;
        
        const labels = Object.keys(categoryCounts).map(key => CATEGORIES.main[key] || key);
        const data = Object.values(categoryCounts);
        
        categoryChart.data.labels = labels;
        categoryChart.data.datasets[0].data = data;
        categoryChart.update();
    } catch (error) {
        console.error('チャート更新エラー:', error);
    }
}

// トレンド更新
function updateTrends() {
    try {
        const trendsList = document.getElementById('trendsList');
        if (!trendsList) return;
        
        // 技術別トレンド計算
        const techTrends = {};
        allArticles.forEach(article => {
            if (article.techCategory) {
                techTrends[article.techCategory] = (techTrends[article.techCategory] || 0) + 1;
            }
        });
        
        // 上位3つのトレンド
        const topTrends = Object.entries(techTrends)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);
        
        trendsList.innerHTML = topTrends.map(([tech, count]) => `
            <div class="trend-item">
                <span class="trend-tag">${CATEGORIES.tech[tech] || tech}</span>
                <span class="trend-count">${count}件</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('トレンド更新エラー:', error);
    }
}

// 記事数表示更新
function updateArticleCount() {
    try {
        const visibleArticlesEl = document.getElementById('visibleArticles');
        if (visibleArticlesEl) {
            visibleArticlesEl.textContent = filteredArticles.length;
        }
    } catch (error) {
        console.error('記事数更新エラー:', error);
    }
}

// 最終更新時刻更新
function updateLastUpdateTime() {
    try {
        const lastUpdateEl = document.getElementById('lastUpdate');
        if (lastUpdateEl) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit'
            });
            lastUpdateEl.textContent = timeString;
        }
    } catch (error) {
        console.error('最終更新時刻更新エラー:', error);
    }
}

// 記事を開く
function openArticle(article) {
    try {
        if (article.link && article.link !== '#') {
            window.open(article.link, '_blank');
        } else {
            showNotification('記事の詳細リンクは準備中です', 'info');
        }
    } catch (error) {
        console.error('記事オープンエラー:', error);
    }
}

// 通知表示
function showNotification(message, type = 'info') {
    try {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            padding: var(--space-16) var(--space-20);
            color: white;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // アニメーション
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自動削除
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    } catch (error) {
        console.error('通知表示エラー:', error);
    }
}

// ユーティリティ関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatDate(date) {
    try {
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return '本日';
        } else if (diffDays === 1) {
            return '昨日';
        } else if (diffDays < 7) {
            return `${diffDays}日前`;
        } else {
            return date.toLocaleDateString('ja-JP', {
                month: 'short',
                day: 'numeric'
            });
        }
    } catch (error) {
        console.error('日付フォーマットエラー:', error);
        return '日付不明';
    }
}

function escapeHtml(text) {
    try {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    } catch (error) {
        console.error('HTMLエスケープエラー:', error);
        return text;
    }
}

// CSS追加（記事タグスタイル）
function addDynamicStyles() {
    try {
        const style = document.createElement('style');
        style.textContent = `
            .article-tags {
                display: flex;
                gap: var(--space-8);
                margin: var(--space-12) 0;
                flex-wrap: wrap;
            }
            
            .article-tag {
                background: rgba(6, 214, 160, 0.2);
                color: rgba(6, 214, 160, 1);
                padding: var(--space-4) var(--space-8);
                border-radius: var(--radius-sm);
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-medium);
            }
            
            .notification {
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.error('動的スタイル追加エラー:', error);
    }
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM読み込み完了 - アプリケーション開始');
    try {
        addDynamicStyles();
        initializeApp();
    } catch (error) {
        console.error('アプリケーション開始エラー:', error);
        hideLoadingOverlay();
        showErrorState();
    }
});

// デバッグ用グローバル関数
window.debugApp = {
    allArticles,
    filteredArticles,
    activeFilters,
    loadSampleData,
    applyFilters,
    resetAllFilters,
    showNotification
};
