document.addEventListener('DOMContentLoaded', () => {
    const fetchDataButton = document.getElementById('fetchDataButton');
    const dataContainer = document.getElementById('dataContainer');
    // 页面加载时自动调用获取数据函数
    fetchDataFromBackend2(dataContainer);
    fetchDataButton.addEventListener('click', () => {
        fetchDataFromBackend();
    });
});

const fetchDataFromBackend = () => {
    fetch('http://localhost:3000/api/fetchProducts')
        .then(response => response.json())
        .then(data => {
            console.log('Data from database:', data);
            alert('Data fetched successfully! Check the console.');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Check the console.');
        });
};

const fetchDataFromBackend2 = (container) => {
    fetch('http://localhost:3000/api/fetchUsers')
        .then(response => response.json())
        .then(data => {
            console.log('Data from database2:', data);
            displayData(data, container);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Check the console.');
        });
};

const displayData = (data, container) => {
    container.innerHTML = ''; // 清空容器内容

    if (data.length === 0) {
        container.innerHTML = '<p>No data available.</p>';
        return;
    }

    // 动态生成表格
    const tableHtml = `
        <table border="1">
            <thead>
                <tr>
                    <th>Team member name</th>
                    <th>Student ID</th>
                    <th>Job Title</th>
                    <!-- 根据你的数据结构调整表头 -->
                </tr>
            </thead>
            <tbody>
                ${data
        .map(
            (item) => `
                            <tr>
                                <td>${item.empl_name}</td>
                                <td>${item.empl_stuID}</td>
                                <td>${item.empl_job}</td>
                                <!-- 根据你的数据结构调整表格内容 -->
                            </tr>
                        `
        )
        .join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = tableHtml;
};