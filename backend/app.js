require('dotenv').config();
express = require('express');
app = express();
cors = require("cors");
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const passport = require("passport");
const ServiceRequest = require('./models/serviceRequest');
require('./utilities/passport');
require('./utilities/migrate')();

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
// Expose io to route controllers (req.app.get('io')) so REST endpoints
// can push live updates to already-connected sockets.
app.set('io', io);

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
app.use("/complaints",require("./routes/customerComplaintRoutes"))
app.use("/service-requests", require("./routes/serviceRequestRoutes"))
app.use("/explore-posts", require("./routes/explorePostRoutes"))

// Utility
app.get("/user/city/get", require("./utilities/userLocation"))
app.use('/otp', require("./routes/otpRoutes"));

// Oauth
app.use(passport.initialize());
app.use("/auth", require("./routes/customerInfoRoutes"));

// Maps a service request's ID to the socket ID of the customer who created it,
// so offers can be routed directly to that customer instead of being broadcast.
const activeRequestSockets = new Map();

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

    // Handle provider registration
    socket.on("providerJoin", (services)=>{
        console.log(services)
        services.forEach(service => {
            // Join a room for each service the provider offers
            console.log(`Provider joining service room: service-${service}`);
            socket.join(`service-${service}`);
        })
    })

    // Handle new service requests from customers
    socket.on('newServiceRequest', (requestData) => {
        console.log('New service request received:', requestData);

        // Store the socket ID that created this request for direct communication
        const requesterId = socket.id;
        requestData.requesterId = requesterId;
        activeRequestSockets.set(requestData.requestId, requesterId);
        // Broadcast to all providers
        io.to(`service-${requestData.serviceType}`).emit('newServiceRequest', requestData);
    });

    // Handle service offers from providers
    socket.on('serviceOffer', (data) => {
        console.log('Service offer received:', data);

        // Route the offer only to the customer who owns this request.
        const requesterSocketId = data.requestId != null
            ? activeRequestSockets.get(data.requestId)
            : null;

        if (requesterSocketId) {
            io.to(requesterSocketId).emit('serviceOffer', data.offer);
        } else {
            console.warn(`No active requester found for request ${data.requestId}; offer dropped`);
        }
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
    
    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);

        // Find all service requests created by this socket and clean them up
        for (const [requestId, socketId] of activeRequestSockets.entries()) {
            if (socketId === socket.id) {
                try {
                    console.log(`Deleting service request: ${requestId}`);
                    const serviceReq = await ServiceRequest.findByPk(requestId);
                    if (serviceReq) {
                        await serviceReq.destroy();
                        console.log(`Service request ${requestId} deleted successfully`);
                    }
                } catch (error) {
                    console.error(`Error deleting service request ${requestId}:`, error);
                }
                activeRequestSockets.delete(requestId);
            }
        }
    });

});

// Use server.listen instead of app.listen for Socket.io
// server.listen(3000, () => {
//     console.log("Server is running on port http://localhost:3000/");
// });

// Use server.listen instead of app.listen for Socket.io
server.listen(3000, '0.0.0.0',()=>{
        console.log("server is running ")
});