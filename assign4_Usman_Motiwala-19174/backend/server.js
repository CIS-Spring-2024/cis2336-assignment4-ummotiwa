const express = require('express');
const app = express();
const port = 8000;
var path = require('path');
var store = require('store')

// Middleware to parse JSON
app.use(express.json());
// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// The code below Serves static files from the frontend directory
app.use(express.static(path.resolve('../frontend')));


// Handle get / request
app.get('/', (req, res) => {
    res.sendFile(path.resolve('../frontend/HTML folder/index.html'));
});

//handle get /confirm request
app.get('/confirm', (req, res)=>{
    res.sendFile(path.resolve('../frontend/HTML folder/confirm.html'))
});

// Handle get /about request
app.get('/about', (req, res) => {
    res.sendFile(path.resolve('../frontend/HTML folder/biography.html'));
});

//Handle get /menu request
app.get("/menu", function (req, res) {
    res.sendFile(path.resolve("../frontend/HTML folder/menu.html"));
});

//Handle get /order request
app.get("/order", function (req, res) {
    res.sendFile(path.resolve("../frontend/HTML folder/order.html"));
});

// Handle post /order request
app.post('/order', validateOrder, calculateTotal, (req, res) => {
    const { items, address } = req.body;
    const totalAmount = req.totalAmount;
    const order = { items, address, totalAmount };
    // Store the order in localStorage
    //clear the previous order
    store.remove('order');
    store.set('order', order);
    res.status(200).json({ message: 'Order placed successfully' });
});

// Handle get /order/confrimation
app.get('/order/confirmation', (req, res) => {
    const order = store.get('order');
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
});

// Middleware to calculate total order amount
function calculateTotal(req, res, next) {
    const items = req.body.items
    let totalAmount = 0;
    items.forEach(item => {
        totalAmount += item.price * item.quantity;
    });
    req.totalAmount = totalAmount;
    next();
}
// Middleware to validate order details
function validateOrder(req, res, next) {
    const items  = req.body;
    //check if address is provided
    if (!items.address) {
        return res.status(400).json({ message: 'Address is required' });
    }
    //check if items is provided
    if (!items.items) {
        return res.status(400).json({ message: 'Items are required' });
    }
    //check if items is an array
    if (!Array.isArray(items.items)) {
        return res.status(400).json({ message: 'Items must be an array' });
    }

    // If all validations pass, proceed to the next middleware
    next();
}


//Handle 404 page
app.use((req, res)=>{
    res.status(404).end("Sorry! This route does not exist. PLease check the URL and try again.");
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



