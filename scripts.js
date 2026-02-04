function safeImage(src, alt, classes = '') {
    return `
        <img 
            src="${src}" 
            alt="${alt}" 
            class="${classes}" 
            onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Фото+недоступно'" 
            loading="lazy"
        >
    `;
}

// Функция для загрузки продуктов на главной странице
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const products = await response.json();
        const productGrid = document.querySelector('.product-grid');

        if (productGrid) {
            productGrid.innerHTML = '';

            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'product';
                productElement.setAttribute('data-product-id', product.id);
                
                productElement.innerHTML = `
                    <a href="product.html?id=${product.id}" class="product-link">
                        ${safeImage(product.image, product.name, 'product-image')}
                        <div class="title-container">
                            <h3>${product.name}</h3>
                        </div>
                        <p>${product.description}</p>
                        <div class="product-price-preview">
                            <span class="price">${product.price || 'Цена не указана'} ${product.currency || 'Руб.'}</span>
                            <span class="location">📍 ${product.location || 'Местоположение не указано'}</span>
                        </div>
                    </a>
                `;
                
                productGrid.appendChild(productElement);
            });

            // Обработчики кликов по карточкам
            document.querySelectorAll('.product-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const productId = this.closest('.product').getAttribute('data-product-id');
                    window.location.href = `product.html?id=${productId}`;
                });
            });
        }

    } catch (error) {
        console.error('Ошибка загрузки объявлений:', error);
        const productGrid = document.querySelector('.product-grid');
        if (productGrid) {
            productGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <p style="color: #666; font-size: 18px;">Не удалось загрузить объявления. Пожалуйста, попробуйте позже.</p>
                </div>
            `;
        }
    }
}

// Карусель для главной страницы
function initMainCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const indicatorsContainer = document.getElementById('indicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (carouselTrack && indicatorsContainer && prevBtn && nextBtn) {
        const banners = carouselTrack.querySelectorAll('.banner');
        const totalBanners = banners.length;
        let currentIndex = 0;
        let autoPlayInterval;

        function createIndicators() {
            for (let i = 0; i < totalBanners; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                indicatorsContainer.appendChild(dot);
            }
        }

        function goToSlide(index) {
            currentIndex = (index + totalBanners) % totalBanners;
            updateCarousel();
            resetAutoPlay();
        }

        function updateCarousel() {
            document.querySelectorAll('.banner').forEach((banner, index) => {
                banner.classList.remove('left', 'center', 'right');
                
                if (index === currentIndex) {
                    banner.classList.add('center');
                } else if ((index - currentIndex + totalBanners) % totalBanners === 1) {
                    banner.classList.add('right');
                } else if ((index - currentIndex + totalBanners) % totalBanners === totalBanners - 1) {
                    banner.classList.add('left');
                }
            });
            
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalBanners;
            updateCarousel();
            resetAutoPlay();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalBanners) % totalBanners;
            updateCarousel();
            resetAutoPlay();
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        createIndicators();
        updateCarousel();
        startAutoPlay();

        carouselTrack.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carouselTrack.addEventListener('mouseleave', startAutoPlay);
    }
}

// Функция для инициализации кнопки "Наверх"
function initScrollToTop() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Функция для инициализации поля поиска
function initSearchField() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        const originalPlaceholder = searchInput.placeholder;
        
        searchInput.addEventListener('focus', function() {
            this.classList.add('no-emoji', 'search-focused');
            this.placeholder = originalPlaceholder.replace('🔍 ', '').replace('🔍', '');
        });
        
        searchInput.addEventListener('blur', function() {
            if (this.value === '') {
                this.classList.remove('no-emoji', 'search-focused');
                this.placeholder = originalPlaceholder;
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.value.trim();
                if (query) {
                    alert(`Поиск: "${query}"\nВ реальном приложении здесь будет выполнен поиск объявлений.`);
                    this.value = '';
                    this.blur();
                }
            }
        });
    }
}

// Загрузка данных из JSON
async function loadProductData() {
    try {
        const response = await fetch('product.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const productData = await response.json();
        return productData;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        throw error;
    }
}

// Показ ошибки
function showError(message) {
    const productInfo = document.getElementById('productInfo');
    if (productInfo) {
        productInfo.innerHTML = `
            <div class="error-message">
                <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
                <h3>Ошибка загрузки данных</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #228B22; color: white; border: none; border-radius: 25px; cursor: pointer;">
                    Повторить попытку
                </button>
            </div>
        `;
    }
}

// Переменные для полноэкранного просмотра
let currentMediaItems = [];
let currentFullscreenIndex = 0;

// Открыть в полноэкранном режиме
function openFullscreen(index) {
    const modal = document.getElementById('fullscreenModal');
    const modalContent = document.getElementById('modalContent');
    const modalCounter = document.getElementById('modalCounter');
    
    currentFullscreenIndex = index;
    const mediaItem = currentMediaItems[index];
    
    modalContent.innerHTML = '';
    
    if (mediaItem.type === 'image') {
        const img = document.createElement('img');
        img.src = mediaItem.url;
        img.alt = `Фото ${index + 1}`;
        modalContent.appendChild(img);
    } else if (mediaItem.type === 'video') {
        const video = document.createElement('video');
        video.src = mediaItem.url;
        video.controls = true;
        video.autoplay = true;
        modalContent.appendChild(video);
    }
    
    if (modalCounter) {
        modalCounter.textContent = `${index + 1}/${currentMediaItems.length}`;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрыть полноэкранный режим
function closeFullscreen() {
    const modal = document.getElementById('fullscreenModal');
    const modalContent = document.getElementById('modalContent');
    
    const video = modalContent.querySelector('video');
    if (video) video.pause();
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Навигация в полноэкранном режиме
function navigateFullscreen(direction) {
    let newIndex = currentFullscreenIndex + direction;
    if (newIndex < 0) newIndex = currentMediaItems.length - 1;
    if (newIndex >= currentMediaItems.length) newIndex = 0;
    openFullscreen(newIndex);
}

// Инициализация карусели медиа
function initProductCarousel(mediaItems) {
    const carouselTrack = document.getElementById('carouselTrack');
    const indicatorsContainer = document.getElementById('indicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselCounter = document.getElementById('carouselCounter');
    
    if (!carouselTrack || !indicatorsContainer) return;
    
    currentMediaItems = mediaItems;
    carouselTrack.innerHTML = '';
    
    mediaItems.forEach((mediaItem, index) => {
        const banner = document.createElement('div');
        banner.className = 'banner';
        
        const typeBadge = document.createElement('div');
        typeBadge.className = 'media-type-badge';
        typeBadge.textContent = mediaItem.type === 'video' ? '▶ Видео' : '📷 Фото';
        
        if (mediaItem.type === 'image') {
            banner.innerHTML = safeImage(mediaItem.url, `Фото ${index + 1}`, 'carousel-image');
        } else if (mediaItem.type === 'video') {
            banner.innerHTML = `<video src="${mediaItem.url}" preload="metadata" poster="${mediaItem.thumbnail || ''}"></video>`;
        }
        
        banner.appendChild(typeBadge);
        banner.addEventListener('click', () => openFullscreen(index));
        carouselTrack.appendChild(banner);
    });

    const totalBanners = mediaItems.length;
    let currentIndex = 0;
    let autoPlayInterval;

    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalBanners; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        currentIndex = (index + totalBanners) % totalBanners;
        updateCarousel();
        resetAutoPlay();
    }

    function updateCarousel() {
        document.querySelectorAll('.banner').forEach((banner, index) => {
            banner.classList.remove('left', 'center', 'right');
            if (index === currentIndex) banner.classList.add('center');
            else if ((index - currentIndex + totalBanners) % totalBanners === 1) banner.classList.add('right');
            else if ((index - currentIndex + totalBanners) % totalBanners === totalBanners - 1) banner.classList.add('left');
        });
        
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        if (carouselCounter) {
            carouselCounter.textContent = `${currentIndex + 1}/${totalBanners}`;
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalBanners;
        updateCarousel();
        resetAutoPlay();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalBanners) % totalBanners;
        updateCarousel();
        resetAutoPlay();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    createIndicators();
    updateCarousel();
    startAutoPlay();

    carouselTrack.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carouselTrack.addEventListener('mouseleave', startAutoPlay);
}

function displayProductData(productData) {
    const productInfo = document.getElementById('productInfo');

    if (productInfo) {
        productInfo.innerHTML = `
            <div class="product-header">
                <h1 class="product-title">${productData.title || 'Название не указано'}</h1>
                <div class="product-price">${productData.price || '0'} ${productData.currency || 'Руб.'}</div>
            </div>
            
            <div class="product-location">
                <div class="location-details">
                    <span>📍 ${productData.location || 'Адрес не указан'}</span>
                    ${productData.distance ? `<span class="distance">• ${productData.distance}</span>` : ''}
                    <a href="#" class="show-map">Показать на карте</a>
                </div>
            </div>
            
            ${productData.tags && productData.tags.length > 0 ? `
            <div class="product-tags">
                ${productData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            ` : ''}
            
            ${productData.description ? `
            <div class="description-section">
                <h3>Описание</h3>
                <div class="description-content">
                    ${productData.description}
                </div>
            </div>
            ` : ''}
        `;

        const showMapBtn = document.querySelector('.show-map');
        if (showMapBtn) {
            showMapBtn.addEventListener('click', function(e) {
                e.preventDefault();
                alert(`Показать на карте: ${productData.location || 'Адрес не указан'}`);
            });
        }
    }

    const seller = productData.seller || {};
    document.getElementById('seller-name').textContent = seller.name || 'Не указано';
    document.getElementById('seller-role').textContent = seller.role || '';
    document.getElementById('seller-clients').textContent = seller.clients || 0;

    const ratingStars = '★'.repeat(Math.round(seller.rating)) + '☆'.repeat(5 - Math.round(seller.rating));
    document.getElementById('seller-rating').innerHTML = `${ratingStars} <span>(${seller.rating || 0})</span>`;

    const reviewsSection = document.querySelector('.reviews-section');
    if (!reviewsSection) return;

    reviewsSection.innerHTML = '<h4>Отзывы</h4>';

    if (!productData.reviews || productData.reviews.length === 0) {
        const noReviews = document.createElement('p');
        noReviews.textContent = 'Пока нет отзывов.';
        reviewsSection.appendChild(noReviews);
        return;
    }

    const reviewsChat = document.createElement('div');
    reviewsChat.className = 'reviews-chat';

    productData.reviews.forEach(review => {
        const message = document.createElement('div');
        message.className = 'review-message';

        const avatarUrl = review.avatar || 'https://via.placeholder.com/60x60?text=👤';

        message.innerHTML = `
            <div class="review-avatar">
                <img src="${avatarUrl}" alt="${review.author}">
            </div>
            <div class="review-content">
                <div class="review-author">${review.author}</div>
                <div class="review-rating">${'★'.repeat(Math.round(review.rating))}${'☆'.repeat(5 - Math.round(review.rating))}</div>
                <div class="review-text">«${review.text}»</div>
                <div class="review-actions">
                    <button class="review-like" data-review-id="${review.id}"></button>
                    <span style="color: #aaa; font-size: 11px;">${review.date}</span>
                </div>
            </div>
        `;
        reviewsChat.appendChild(message);
    });

    reviewsSection.appendChild(reviewsChat);

    const likeButtons = reviewsSection.querySelectorAll('.review-like');
    likeButtons.forEach(btn => {
        const id = btn.dataset.reviewId;
        const liked = localStorage.getItem(`like_${id}`) === 'true';
        if (liked) btn.classList.add('liked');

        btn.addEventListener('click', () => {
            if (btn.classList.contains('liked')) {
                btn.classList.remove('liked');
                localStorage.setItem(`like_${id}`, 'false');
            } else {
                btn.classList.add('liked');
                localStorage.setItem(`like_${id}`, 'true');
            }
        });
    });
}

function initFullscreenModal() {
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const modal = document.getElementById('fullscreenModal');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeFullscreen);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeFullscreen();
            }
        });
    }
    
    if (modalPrev) {
        modalPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateFullscreen(-1);
        });
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateFullscreen(1);
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeFullscreen();
        }
        
        if (modal && modal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                navigateFullscreen(-1);
            } else if (e.key === 'ArrowRight') {
                navigateFullscreen(1);
            }
        }
    });
}

async function initProductPage() {
    try {
        const productData = await loadProductData();
        
        if (productData.media && productData.media.length > 0) {
            initProductCarousel(productData.media);
        } else {
            const productCarousel = document.querySelector('.product-carousel');
            if (productCarousel) {
                productCarousel.style.display = 'none';
            }
        }
        
        initFullscreenModal();
        
        displayProductData(productData);
        
    } catch (error) {
        showError(error.message || 'Не удалось загрузить данные объявления');
        
        const productCarousel = document.querySelector('.product-carousel');
        if (productCarousel) {
            productCarousel.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initScrollToTop();
    initSearchField();
    
    if (document.querySelector('.product-grid')) {
        loadProducts();
        initMainCarousel();
    } else if (document.querySelector('.product-detail-page')) {
        initProductPage();
    }
});

// === Форма отзыва ===
const reviewForm = document.getElementById('reviewForm');
const ratingStars = document.getElementById('ratingStars');
let selectedRating = 5;

ratingStars.querySelectorAll('span').forEach(star => {
    star.addEventListener('click', function () {
        selectedRating = parseInt(this.getAttribute('data-value'));
        updateStars();
        document.getElementById('rating').value = selectedRating;
    });

    star.addEventListener('mouseover', function () {
        const value = parseInt(this.getAttribute('data-value'));
        ratingStars.querySelectorAll('span').forEach(s => {
            s.classList.toggle('active', parseInt(s.getAttribute('data-value')) <= value);
        });
    });

    star.addEventListener('mouseout', () => {
        updateStars();
    });
});

function updateStars() {
    ratingStars.querySelectorAll('span').forEach(s => {
        s.classList.toggle('active', parseInt(s.getAttribute('data-value')) <= selectedRating);
    });
}

updateStars();

reviewForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const author = document.getElementById('author').value.trim();
    const rating = document.getElementById('rating').value;
    const text = document.getElementById('reviewText').value.trim();

    const newReview = {
        id: Date.now(),
        author: author,
        rating: parseInt(rating),
        text: text,
        date: new Date().toLocaleString('ru-RU', { month: 'long', year: 'numeric' }),
        avatar: 'https://via.placeholder.com/60x60?text=👤'
    };

    const reviewsChat = document.querySelector('.reviews-chat');
    if (reviewsChat) {
        const message = document.createElement('div');
        message.className = 'review-message';

        message.innerHTML = `
            <div class="review-avatar">
                <img src="${newReview.avatar}" alt="${newReview.author}">
            </div>
            <div class="review-content">
                <div class="review-author">${newReview.author}</div>
                <div class="review-rating">${'★'.repeat(newReview.rating)}${'☆'.repeat(5 - newReview.rating)}</div>
                <div class="review-text">«${newReview.text}»</div>
                <div class="review-actions">
                    <button class="review-like" data-review-id="${newReview.id}"></button>
                    <span style="color: #aaa; font-size: 11px;">${newReview.date}</span>
                </div>
            </div>
        `;

        reviewsChat.prepend(message);

        const likeBtn = message.querySelector('.review-like');
        likeBtn.addEventListener('click', function () {
            this.classList.toggle('liked');
            const id = this.dataset.reviewId;
            localStorage.setItem(`like_${id}`, this.classList.contains('liked') ? 'true' : 'false');
        });
    }

    reviewForm.reset();
    selectedRating = 5;
    updateStars();
    document.getElementById('rating').value = 5;

    alert('Спасибо за отзыв!');
});
