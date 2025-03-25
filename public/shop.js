document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    // 页面加载时自动调用获取数据函数
    fetchProducts(productContainer)
    // 搜索按钮点击事件
    searchButton.addEventListener('click', () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            searchProducts(keyword, productContainer);
        } else {
            alert('Please enter the product you want to inquire');
        }
    });
});

// 搜索商品
const searchProducts = (keyword, container) => {
    fetch('http://localhost:3000/api/searchProducts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({keyword}),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Searched products:', data);
            displayProducts(data, container);
        })
        .catch(error => {
            console.error('Error searching products:', error);
            alert('Error searching products. Check the console.');
        });
};

const fetchProducts = (container) => {
    fetch('http://localhost:3000/api/fetchProducts')
        .then(response => response.json())
        .then(data => {
            console.log('Data from product:', data);
            displayProducts(data, container);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Check the console.');
        });
};

const displayProducts = (data, container) => {
    container.innerHTML = ''; // 清空容器内容
    if (data.length === 0) {
        container.innerHTML = '<p>No product available.</p>';
        return;
    }
    // 动态生成商品列表
    let productsHtml = '';
    data.forEach(product => {
        productsHtml += `
          <div class="product-card" data-id="${product.prod_id}" data-price="${product.prod_price}">
            <div class="product-image">
              <img src="${product.prod_imgurl}" alt="${product.prod_desc}">
            </div>
            <div class="product-info">
              <div class="category">${product.prod_category}</div>
              <h3 class="product-name">${product.prod_desc}</h3>
              <div class="product-footer">
                <span class="price">$${product.prod_price.toLocaleString()}</span>
                <button class="add-to-cart">Add to Cart</button>
              </div>
            </div>
          </div>
        `;
        container.innerHTML = productsHtml;

        // 在动态生成商品列表后，为每个 "Add to Cart" 按钮添加点击事件监听器
        const addToCartButtons = container.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productCard = button.closest('.product-card');
                const productId = productCard.dataset.id;
                const productPrice = parseInt(productCard.dataset.price);
                const productName = productCard.querySelector('.product-name').textContent;
                const productImage = productCard.querySelector('img').src;

                // 调用 cart.js 中的 addToCart 函数
                addToCart({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            });
        });
    })
};