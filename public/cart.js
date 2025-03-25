// 购物车数据
let cart = [];

// DOM 元素
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// 打开购物车
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
});

// 关闭购物车
closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
    document.body.style.overflow = ''; // 恢复背景滚动
});

// 点击背景关闭购物车
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// 添加商品到购物车的点击效果
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productId = productCard.dataset.id;
        const productPrice = parseInt(productCard.dataset.price);
        const productName = productCard.querySelector('.product-name').textContent;
        const productImage = productCard.querySelector('img').src;

        // 添加涟漪效果
        button.classList.add('animate');
        setTimeout(() => button.classList.remove('animate'), 600);

        addToCart({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    });
});

// 添加商品到购物车
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }

    updateCart();
    
    // 添加购物车数量的动画效果
    cartCount.classList.remove('active');
    void cartCount.offsetWidth; // 触发重排以重启动画
    cartCount.classList.add('active');
}

// 从购物车移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// 更新商品数量
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// 更新购物车显示
function updateCart() {
    // 更新购物车数量
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.classList.add('active');
    } else {
        cartCount.classList.remove('active');
    }

    // 更新购物车总价
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `¥${total.toLocaleString()}`;

    // 更新购物车列表
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="animation-delay: ${index * 0.1}s">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">¥${item.price.toLocaleString()}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="quantity-number">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');
}
document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.getElementById('checkoutButton');
    // checkout按钮点击事件
    checkoutButton.addEventListener('click', () => {
        // 获取购物车中的商品信息
        const cartItems = cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
        }));

        console.log("cart", cartItems)

        // 获取当前用户信息
        const username = localStorage.getItem('username');

        // 调用后端的checkout API
        fetch('http://localhost:3000/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                cartItems
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // 清空购物车
                    cart = [];
                    updateCart();
                    alert('Checkout successful!');
                } else {
                    alert('Checkout failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error during checkout:', error);
                alert('Error during checkout. Check the console.');
            });
    });
});