// 記事表示関数（リンク機能付き）
displayArticles() {
    const container = document.getElementById('articlesContainer');
    container.innerHTML = '';

    if (this.filteredArticles.length === 0) {
        container.innerHTML = '<div class="no-articles">記事が見つかりません</div>';
        return;
    }

    this.filteredArticles.forEach(article => {
        const articleCard = document.createElement('div');
        articleCard.className = 'article-card';
        articleCard.innerHTML = `
            <div class="article-header">
                <h3 class="article-title">
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer">
                        ${article.title}
                    </a>
                </h3>
                <div class="article-meta">
                    <span class="article-source">${article.source}</span>
                    <span class="article-date">${this.formatDate(article.date)}</span>
                    <span class="article-category">${this.getCategoryName(article.category)}</span>
                </div>
            </div>
            <div class="article-content">
                <p class="article-description">${article.description}</p>
            </div>
        `;
        container.appendChild(articleCard);
    });
}
