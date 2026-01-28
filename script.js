// 상품 데이터 (Unsplash 무료 이미지 URL 포함)
const products = [
    {
        id: 1,
        name: '클래식 화이트 셔츠',
        category: 'women',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop'
    },
    {
        id: 2,
        name: '스트라이프 블라우스',
        category: 'women',
        price: 52000,
        image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=400&fit=crop'
    },
    {
        id: 3,
        name: '캐주얼 청바지',
        category: 'women',
        price: 65000,
        image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop'
    },
    {
        id: 4,
        name: '슬림핏 셔츠',
        category: 'men',
        price: 48000,
        image: 'https://images.unsplash.com/photo-1596662712007-11b9a237553d?w=400&h=400&fit=crop'
    },
    {
        id: 5,
        name: '검정 스웨터',
        category: 'men',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1578932750294-708eaa3624e0?w=400&h=400&fit=crop'
    },
    {
        id: 6,
        name: '데님 재킷',
        category: 'men',
        price: 78000,
        image: 'https://images.unsplash.com/photo-1591047990975-e71eb41d75ce?w=400&h=400&fit=crop'
    },
    {
        id: 7,
        name: '플로럴 드레스',
        category: 'women',
        price: 72000,
        image: 'https://images.unsplash.com/photo-1595777707802-91d177c547e1?w=400&h=400&fit=crop'
    },
    {
        id: 8,
        name: '크롭 탑',
        category: 'women',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1542321021-7ab264b275f7?w=400&h=400&fit=crop'
    },
    {
        id: 9,
        name: '카고 팬츠',
        category: 'men',
        price: 62000,
        image: 'https://images.unsplash.com/photo-1473621038790-b3592e248d16?w=400&h=400&fit=crop'
    },
    {
        id: 10,
        name: '가죽 핸드백',
        category: 'accessories',
        price: 89000,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop'
    },
    {
        id: 11,
        name: '선글라스',
        category: 'accessories',
        price: 42000,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237aa25d?w=400&h=400&fit=crop'
    },
    {
        id: 12,
        name: '스카프',
        category: 'accessories',
        price: 28000,
        image: 'https://images.unsplash.com/photo-1574896369812-fd2cf02d1c3d?w=400&h=400&fit=crop'
    }
];

// 장바구니 배열
let cart = [];

// 현재 필터
let currentFilter = 'all';

// DOM 요소 선택
const productGrid = document.getElementById('productGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const closeBtn = document.querySelector('.close');

// 상품 표시 함수
function displayProducts(filterCategory = 'all') {
    // 필터된 상품
    let filteredProducts = filterCategory === 'all' 
        ? products 
        : products.filter(product => product.category === filterCategory);

    // HTML 생성
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">고품질 소재로 만들어진 상품</div>
                <div class="product-footer">
                    <div class="product-price">₩${product.price.toLocaleString()}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">담기</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 카테고리 이름 변환 함수
function getCategoryName(category) {
    const categoryNames = {
        women: '여성',
        men: '남성',
        accessories: '액세서리'
    };
    return categoryNames[category] || category;
}

// 장바구니에 상품 추가
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    // 이미 장바구니에 있는지 확인
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    
    // 추가 효과
    showAddToCartNotification();
}

// 장바구니에서 상품 제거
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// 장바구니 업데이트
function updateCart() {
    // 장바구니 카운트 업데이트
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // 장바구니 아이템 표시
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">장바구니가 비어있습니다</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">
                        ${item.emoji} ₩${item.price.toLocaleString()} × ${item.quantity}
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">제거</button>
            </div>
        `).join('');
    }

    // 총액 업데이트
    const totalPrice = document.getElementById('totalPrice');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = total.toLocaleString();

    // 로컬스토리지에 저장
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 추가 알림 표시
function showAddToCartNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #1a1a1a;
        color: white;
        padding: 15px 25px;
        border-radius: 3px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.5s ease;
        z-index: 999;
        font-weight: bold;
    `;
    notification.textContent = '✓ 상품이 장바구니에 추가되었습니다!';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// 필터 버튼 이벤트
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 활성 버튼 업데이트
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // 필터 카테고리 업데이트
        currentFilter = button.dataset.filter;
        displayProducts(currentFilter);
    });
});

// 장바구니 모달 관련 이벤트
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// 결제 버튼 클릭 이벤트
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('장바구니가 비어있습니다');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`총 ₩${total.toLocaleString()}가 결제되었습니다. 감사합니다! 🎉`);
    
    // 장바구니 초기화
    cart = [];
    updateCart();
    cartModal.style.display = 'none';
});

// 슬라이드 인 우측 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 로컬스토리지에서 장바구니 복원
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }

    // 초기 상품 표시
    displayProducts();
});

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
