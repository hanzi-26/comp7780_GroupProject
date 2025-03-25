document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('productsContainer');
    // 页面加载时自动调用获取数据函数
    fetchProducts(productContainer)
});

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
        container.innerHTML = '<p>No data available.</p>';
        return;
    }
    // 动态生成商品列表
    let productsHtml = '';
    data.forEach(product => {
        productsHtml += `
          <div class="product-card" data-id="${product.prod_id}" data-price="${product.prod_price}">
            <div class="product-image">
              <img src="${product.prod_imgurl}" alt="${product.prod_name}">
            </div>
            <div class="product-info">
              <div class="category">${product.prod_category}</div>
              <h3 class="product-name">${product.prod_name}</h3>
              <div class="product-footer">
                <span class="price">$${product.prod_price.toLocaleString()}</span>
                <button class="add-to-cart">Add to Cart</button>
              </div>
            </div>
          </div>
        `;
        container.innerHTML = productsHtml;
    })
};