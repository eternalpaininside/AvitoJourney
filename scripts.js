async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const products = await response.json();
        const productGrid = document.querySelector('.product-grid');

        productGrid.innerHTML = '';

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Фото+нет'">
    <div class="title-container">
        <h3>${product.name}</h3>
    </div>
    <p>${product.description}</p>
    <button class="zoom-button">Увеличить</button>
`;
            productGrid.appendChild(productElement);
        });

        attachZoomListeners();
    } catch (error) {
    }
}

function attachZoomListeners() {
    document.querySelectorAll('.zoom-button').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            if (product.style.transform === 'scale(1.2)') {
                product.style.transform = 'scale(1)';
            } else {
                product.style.transform = 'scale(1.2)';
            }
        });
    });
}

const carouselTrack = document.getElementById('carouselTrack');
        const indicatorsContainer = document.getElementById('indicators');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        const banners = carouselTrack.querySelectorAll('.banner');
        const totalBanners = banners.length;
        let currentIndex = 0;
        let autoPlayInterval;

        // Создание точек-индикаторов
        function createIndicators() {
            for (let i = 0; i < totalBanners; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                indicatorsContainer.appendChild(dot);
            }
        }

        // Переход к конкретному слайду
        function goToSlide(index) {
            currentIndex = (index + totalBanners) % totalBanners;
            updateCarousel();
            resetAutoPlay();
        }

        // Обновление позиции карусели и индикаторов
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

        // Следующий слайд
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalBanners;
            updateCarousel();
            resetAutoPlay();
        }

        // Предыдущий слайд
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalBanners) % totalBanners;
            updateCarousel();
            resetAutoPlay();
        }

        // Автоматическое переключение
        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        // Сброс автоматического переключения
        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        // Обработчики кнопок
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Инициализация
        createIndicators();
        updateCarousel();
        startAutoPlay();

        // Пауза при наведении (опционально)
        carouselTrack.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carouselTrack.addEventListener('mouseleave', startAutoPlay);

        
window.addEventListener('DOMContentLoaded', loadProducts);

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

