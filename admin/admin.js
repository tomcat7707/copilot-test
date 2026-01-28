// 관리자 패널 데이터
let adminData = {
    products: JSON.parse(localStorage.getItem('adminProducts')) || [
        { id: 1, name: '클래식 화이트 셔츠', category: 'women', price: 45000, stock: 50, status: 'active' },
        { id: 2, name: '스트라이프 블라우스', category: 'women', price: 52000, stock: 35, status: 'active' },
        { id: 3, name: '캐주얼 청바지', category: 'women', price: 65000, stock: 25, status: 'active' },
        { id: 4, name: '슬림핏 셔츠', category: 'men', price: 48000, stock: 40, status: 'active' },
        { id: 5, name: '검정 스웨터', category: 'men', price: 55000, stock: 30, status: 'active' },
    ],
    orders: [
        { id: 1001, customer: '김철수', total: 112000, status: 'shipped', date: '2026-01-28' },
        { id: 1002, customer: '이영희', total: 65000, status: 'pending', date: '2026-01-27' },
        { id: 1003, customer: '박지민', total: 178000, status: 'delivered', date: '2026-01-26' },
    ],
    categories: [
        { id: 1, name: '여성', products: 25 },
        { id: 2, name: '남성', products: 18 },
        { id: 3, name: '액세서리', products: 12 },
    ],
    users: [
        { id: 1, name: '김철수', email: 'kim@email.com', joined: '2025-12-01', orders: 5 },
        { id: 2, name: '이영희', email: 'lee@email.com', joined: '2025-11-15', orders: 3 },
        { id: 3, name: '박지민', email: 'park@email.com', joined: '2025-10-20', orders: 8 },
    ]
};

let currentEditingProductId = null;
let currentPage = 'dashboard';

// 네비게이션
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const page = e.target.dataset.page;
        if (page) {
            navigateTo(page);
        }
    });
});

document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('logoutBtn2').addEventListener('click', logout);

function navigateTo(page) {
    currentPage = page;
    const pageContent = document.getElementById('pageContent');
    const pageTitle = document.getElementById('pageTitle');
    
    // 활성 네비게이션 업데이트
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === page) btn.classList.add('active');
    });

    // 페이지 컨텐츠 로드
    switch(page) {
        case 'dashboard':
            pageTitle.textContent = '대시보드';
            pageContent.innerHTML = getDashboardHTML();
            break;
        case 'products':
            pageTitle.textContent = '상품 관리';
            pageContent.innerHTML = getProductsHTML();
            break;
        case 'orders':
            pageTitle.textContent = '주문 관리';
            pageContent.innerHTML = getOrdersHTML();
            break;
        case 'categories':
            pageTitle.textContent = '카테고리';
            pageContent.innerHTML = getCategoriesHTML();
            break;
        case 'users':
            pageTitle.textContent = '고객 관리';
            pageContent.innerHTML = getUsersHTML();
            break;
    }
}

// 대시보드
function getDashboardHTML() {
    const totalRevenue = adminData.orders.reduce((sum, order) => sum + order.total, 0);
    const totalProducts = adminData.products.length;
    const totalOrders = adminData.orders.length;
    const totalCustomers = adminData.users.length;

    return `
        <div class="dashboard-grid">
            <div class="stat-card">
                <div class="stat-label">총 매출</div>
                <div class="stat-value">₩${totalRevenue.toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">상품 수</div>
                <div class="stat-value">${totalProducts}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">주문 수</div>
                <div class="stat-value">${totalOrders}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">고객 수</div>
                <div class="stat-value">${totalCustomers}</div>
            </div>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h2>최근 주문</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>주문 ID</th>
                        <th>고객명</th>
                        <th>금액</th>
                        <th>상태</th>
                        <th>날짜</th>
                    </tr>
                </thead>
                <tbody>
                    ${adminData.orders.map(order => `
                        <tr>
                            <td>#${order.id}</td>
                            <td>${order.customer}</td>
                            <td class="price">₩${order.total.toLocaleString()}</td>
                            <td><span class="status ${order.status === 'delivered' ? 'active' : 'inactive'}">${getStatusText(order.status)}</span></td>
                            <td>${order.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 상품 관리
function getProductsHTML() {
    return `
        <div class="table-container">
            <div class="table-header">
                <h2>상품 목록</h2>
                <button class="btn-primary" onclick="openProductModal()">+ 새 상품 추가</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>상품명</th>
                        <th>카테고리</th>
                        <th>가격</th>
                        <th>재고</th>
                        <th>상태</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    ${adminData.products.map(product => `
                        <tr>
                            <td>#${product.id}</td>
                            <td>${product.name}</td>
                            <td>${getCategoryName(product.category)}</td>
                            <td class="price">₩${product.price.toLocaleString()}</td>
                            <td>${product.stock}개</td>
                            <td><span class="status active">${product.status === 'active' ? '판매중' : '중단'}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-small btn-edit" onclick="editProduct(${product.id})">수정</button>
                                    <button class="btn-small btn-delete" onclick="deleteProduct(${product.id})">삭제</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 주문 관리
function getOrdersHTML() {
    return `
        <div class="table-container">
            <div class="table-header">
                <h2>주문 관리</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>주문 ID</th>
                        <th>고객명</th>
                        <th>금액</th>
                        <th>상태</th>
                        <th>날짜</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    ${adminData.orders.map(order => `
                        <tr>
                            <td>#${order.id}</td>
                            <td>${order.customer}</td>
                            <td class="price">₩${order.total.toLocaleString()}</td>
                            <td><span class="status ${order.status === 'delivered' ? 'active' : 'inactive'}">${getStatusText(order.status)}</span></td>
                            <td>${order.date}</td>
                            <td>
                                <button class="btn-small btn-edit" onclick="alert('상세 보기 기능')">보기</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 카테고리
function getCategoriesHTML() {
    return `
        <div class="table-container">
            <div class="table-header">
                <h2>카테고리 관리</h2>
                <button class="btn-primary" onclick="alert('새 카테고리 추가 기능')">+ 새 카테고리</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>카테고리명</th>
                        <th>상품 수</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    ${adminData.categories.map(cat => `
                        <tr>
                            <td>#${cat.id}</td>
                            <td>${cat.name}</td>
                            <td>${cat.products}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-small btn-edit" onclick="alert('수정 기능')">수정</button>
                                    <button class="btn-small btn-delete" onclick="alert('삭제 기능')">삭제</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 고객 관리
function getUsersHTML() {
    return `
        <div class="table-container">
            <div class="table-header">
                <h2>고객 관리</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>가입일</th>
                        <th>주문 수</th>
                    </tr>
                </thead>
                <tbody>
                    ${adminData.users.map(user => `
                        <tr>
                            <td>#${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.joined}</td>
                            <td>${user.orders}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 모달 함수
function openProductModal() {
    currentEditingProductId = null;
    document.getElementById('productName').value = '';
    document.getElementById('productCategory').value = 'women';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

function editProduct(id) {
    const product = adminData.products.find(p => p.id === id);
    if (product) {
        currentEditingProductId = id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = '';
        document.getElementById('productModal').classList.add('active');
    }
}

function deleteProduct(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
        adminData.products = adminData.products.filter(p => p.id !== id);
        saveData();
        navigateTo('products');
    }
}

// 폼 제출
document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = parseInt(document.getElementById('productPrice').value);
    
    if (currentEditingProductId) {
        // 수정
        const product = adminData.products.find(p => p.id === currentEditingProductId);
        if (product) {
            product.name = name;
            product.category = category;
            product.price = price;
        }
    } else {
        // 추가
        const newId = Math.max(...adminData.products.map(p => p.id), 0) + 1;
        adminData.products.push({
            id: newId,
            name,
            category,
            price,
            stock: 0,
            status: 'active'
        });
    }
    
    saveData();
    closeProductModal();
    navigateTo('products');
});

// 데이터 저장
function saveData() {
    localStorage.setItem('adminProducts', JSON.stringify(adminData.products));
}

// 로그아웃
function logout() {
    alert('로그아웃되었습니다.');
    window.location.href = '../index.html';
}

// 헬퍼 함수
function getCategoryName(category) {
    const names = { women: '여성', men: '남성', accessories: '액세서리' };
    return names[category] || category;
}

function getStatusText(status) {
    const statuses = { 
        pending: '대기중',
        shipped: '배송중',
        delivered: '배송완료'
    };
    return statuses[status] || status;
}

// 모달 닫기 (외부 클릭)
window.addEventListener('click', (e) => {
    const modal = document.getElementById('productModal');
    if (e.target === modal) {
        closeProductModal();
    }
});

// 초기 로드
navigateTo('dashboard');
