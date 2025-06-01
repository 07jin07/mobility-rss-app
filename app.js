// RSS フィード設定
const RSS_FEEDS = [
    {
        name: "トヨタ自動車",
        url: "https://global.toyota/export/jp/allnews_rss.xml",
        category: "自動車メーカー"
    },
    {
        name: "マツダ",
        url: "https://www.mazda.com/ja/rss/news.rdf", 
        category: "自動車メーカー"
    },
    {
        name: "日経クロステック（自動車）",
        url: "https://xtech.nikkei.com/rss/xtech-at.rdf",
        category: "メディア"
    }
];

// グローバル変数
let allArticles = [];
let filteredArticles = [];

// CORS プロキシ
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

// カテゴリ分類キーワード
const CATEGORY_KEYWORDS = {
    policy: ['政策', '規制', '法案', '省令', '政府', '法律'],
    technology: ['SDV', '自動運転', 'EV', '電動化', 'ADAS', '技術'],
    market: ['販売', '業績', '決算', '提携', '買収', '市場'],
    social: ['環境', 'カーボン', '安全', '事故', '社会'],
    sdv: ['SDV', 'Software-Defined', 'ソフトウェア定義']
};

// 記事分類関数
function categorizeArticle(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }
    return 'general';
}

// RSS フィード読み込み
async function loadFeeds() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('articles').innerHTML = '';
    allArticles = [];

    // サンプルデータ（実際のRSSが取得できない場合のフォールバック）
    const sampleArticles = [
        {
            title: "トヨタ、新型電気自動車の技術開発を発表",
            description: "トヨタ自動車は次世代電気自動車の技術開発について新たな取り組みを発表しました。",
            link: "#",
            date: new Date(),
            source: "トヨタ自動車",
            category: "technology"
        },
        {
            title: "政府、自動運転車両の新規制を策定",
            description: "国土交通省は自動運転車両の安全基準に関する新しい規制を発表しました。",
            link: "#", 
            date: new Date(),
            source: "政府機関",
            category: "policy"
        },
        {
            title: "マツダ、2024年第4四半期の業績を発表",
            description: "マツダの最新四半期業績が発表され、売上高の増加が報告されました。",
            link: "#",
            date: new Date(),
            source: "マツダ",
            category: "market"
        }
    ];

    try {
        // 実際のRSSフィード取得を試行
        for (const feed of RSS_FEEDS) {
            try {
                const response = await fetch(CORS_PROXY + encodeURIComponent(feed.url));
                const data = await response.json();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.contents, "text/xml");
                
                const items = xmlDoc.querySelectorAll("item");
                items.forEach(item => {
                    const title = item.querySelector("title")?.textContent || "";
                    const description = item.querySelector("description")?.textContent || "";
                    const link = item.querySelector("link")?.textContent || "#";
                    const pubDate = item.querySelector("pubDate")?.textContent || "";
                    
                    allArticles.push({
                        title: title,
                        description: description.substring(0, 200) + "...",
                        link: link,
                        date: new Date(pubDate),
                        source: feed.name,
                        category: categorizeArticle(title, description)
                    });
                });
            } catch (error) {
                console.log(`${feed.name} のRSSフィード取得に失敗: ${error.message}`);
            }
        }
        
        // RSSが取得できない場合はサンプルデータを使用
        if (allArticles.length === 0) {
            allArticles = sampleArticles;
        }
        
    } catch (error) {
        console.error('RSS取得エラー:', error);
        allArticles = sampleArticles;
    }

    filteredArticles = allArticles;
    displayArticles();
    document.getElementById('loading').style.display = 'none';
}

// 記事表示
function displayArticles() {
    const container = document.getElementById('articles');
    container.innerHTML = '';

    if (filteredArticles.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">該当する記事が見つかりません。</p>';
        return;
    }

    filteredArticles.forEach(article => {
        const articleEl = document.createElement('div');
        articleEl.className = 'article';
        articleEl.innerHTML = `
            <h3><a href="${article.link}" target="_blank" style="text-decoration:none; color:#2c3e50;">${article.title}</a></h3>
            <div class="meta">
                <span>📰 ${article.source}</span> | 
                <span>📅 ${article.date.toLocaleDateString('ja-JP')}</span> |
                <span>🏷️ ${getCategoryName(article.category)}</span>
            </div>
            <div class="description">${article.description}</div>
        `;
        container.appendChild(articleEl);
    });
}

// カテゴリ名取得
function getCategoryName(category) {
    const names = {
        policy: '政策・規制',
        technology: '技術・製品', 
        market: '市場・事業',
        social: '社会・環境',
        sdv: 'SDV',
        general: '一般'
    };
    return names[category] || '一般';
}

// カテゴリフィルター
function filterCategory(category) {
    // タブのアクティブ状態更新
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        filteredArticles = allArticles;
    } else {
        filteredArticles = allArticles.filter(article => article.category === category);
    }
    displayArticles();
}

// 検索機能
function searchArticles() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (!query) {
        filteredArticles = allArticles;
    } else {
        filteredArticles = allArticles.filter(article => 
            article.title.toLowerCase().includes(query) ||
            article.description.toLowerCase().includes(query)
        );
    }
    displayArticles();
}

// 初期読み込み
window.addEventListener('load', loadFeeds);
