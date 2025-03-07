document.addEventListener('DOMContentLoaded', () => {
    const fetchDataButton = document.getElementById('fetchDataButton');

    fetchDataButton.addEventListener('click', () => {
        fetchDataFromBackend();
    });
});

const fetchDataFromBackend = () => {
    fetch('http://localhost:3000/api/fetchUsers')
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