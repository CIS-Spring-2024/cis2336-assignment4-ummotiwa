// fetchOrders.js

document.addEventListener('DOMContentLoaded', () => {
  const orderList = document.getElementById("orderList");
          const addressElement = document.getElementById('address');
          const totalElement = document.getElementById('total');
  
    // Fetch orders from the backend
    fetch('/order/confirmation')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        return response.json();
      })
      .then(data => {
        // Display the orders
        const orderItems = data.items;
        orderItems.forEach(item => {
          const itemElement = document.createElement('li');
          itemElement.textContent = `${item.name} x ${item.quantity} - $ ${item.price}`;
          orderList.appendChild(itemElement);
        });
        addressElement.textContent = data.address;
        totalElement.textContent = data.totalAmount;

      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  });
  