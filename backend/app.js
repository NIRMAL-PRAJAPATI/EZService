require('dotenv').config();
express = require('express');
app = express();
cors = require("cors");
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const passport = require("passport");
require('./utilities/passport');

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// middlewares
app.use(express.json());
app.use(cors({
    origin: "*"
}))
app.use(require("./middlewares/pagination"))
app.use("/uploads/",express.static("uploads"))

// Routes
app.use("/customer",require("./routes/customerInfoRoutes"));
app.use("/category",require("./routes/serviceCategoryRoutes"));
app.use("/services", require("./routes/serviceRoutes"));
app.use("/template",require("./routes/categoryTemplateRoutes"))
app.use("/reviews",require("./routes/serviceReviewRoutes"))
app.use("/orders",require("./routes/orderRoutes"))
app.use("/provider",require("./routes/providerInfoRoutes"))
app.use("/service-requests", require("./routes/serviceRequestRoutes"))

// Utility
app.get("/user/city/get", require("./utilities/userLocation"))
app.use('/otp', require("./routes/otpRoutes"));

// Oauth
app.use(passport.initialize());
app.use("/auth", require("./routes/customerInfoRoutes"));

// Socket.io event handlers
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Store user type and ID for routing messages
    let userType = null;
    let userId = null;
    
    // User identification
    socket.on('identify', (data) => {
        userType = data.userType; // 'customer' or 'provider'
        userId = data.userId;
        
        // Join room based on user type and ID
        socket.join(`${userType}-${userId}`);
        console.log(`User identified as ${userType} with ID ${userId}`);
    });
    
    // Handle new service requests from customers
    socket.on('newServiceRequest', (requestData) => {
        console.log('New service request received:', requestData);
        
        // Store the socket ID that created this request for direct communication
        const requesterId = socket.id;
        requestData.requesterId = requesterId;
        
        // Broadcast to all providers
        socket.broadcast.emit('newServiceRequest', requestData);
    });
    
    // Handle service offers from providers
    socket.on('serviceOffer', (data) => {
        console.log('Service offer received:', data);
        
        // If we have the requester's socket ID, send directly to them
        if (data.requestId) {
            // Find the customer's socket and send the offer
            io.to(`customer-${data.requestId}`).emit('serviceOffer', data.offer);
            
            // Fallback: also broadcast to all sockets as a safety measure
            // This ensures the customer receives the offer even if room-based messaging fails
            socket.broadcast.emit('serviceOffer', data.offer);
        } else {
            // Fallback: broadcast to all sockets
            socket.broadcast.emit('serviceOffer', data.offer);
        }
        
        // Debug: log all connected sockets and rooms
        console.log('Active rooms:', io.sockets.adapter.rooms);
    });
    
    // Handle offer acceptance/rejection
    socket.on('offerAccepted', (data) => {
        console.log('Offer accepted:', data);
        // Notify the provider that their offer was accepted
        io.to(`provider-${data.providerId}`).emit('offerAccepted', data);
    });
    
    socket.on('offerDeclined', (data) => {
        console.log('Offer declined:', data);
        // Notify the provider that their offer was declined
        io.to(`provider-${data.providerId}`).emit('offerDeclined', data);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Use server.listen instead of app.listen for Socket.io
server.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000/");
});