// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const requestRoutes = require('./routes/request');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const acceptedRequestRoutes = require('./acceptedRequestRoutes'); 
const User = require('./userModel'); 
const AcceptedRequest = require('./AcceptedRequest'); 
const Request = require('./requestModel'); 


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://kriyaoswal:admin@cluster0.cfjlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.log('MongoDB connection error:', error));

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Register maid and store socket ID
    socket.on('registerMaid', async (maidUsername) => {
        try {
            const maid = await User.findOne({ username: maidUsername });
            if (maid) {
                maid.socketId = socket.id; 
                await maid.save();
                console.log(`Maid ${maidUsername} registered with socket ID ${socket.id}`);
            }
        } catch (error) {
            console.error('Error registering maid:', error);
        }
    });

    // Handle maid requests and notify all maids
    socket.on('maidRequest', async (requestData) => {
        try {
            const newRequest = new Request(requestData);
            await newRequest.save();

            const maids = await User.find({ userType: 'maid' });
            maids.forEach((maid) => {
                if (maid.socketId) {
                    io.to(maid.socketId).emit('maidRequest', requestData);
                }
            });
        } catch (error) {
            console.error('Error sending maid request:', error);
        }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
        console.log('A user disconnected: ' + socket.id);
        await User.updateMany({ socketId: socket.id }, { $unset: { socketId: "" } });
    });
});

// Route for accepting requests via HTTP
app.post('/acceptedrequests', async (req, res) => {
    const { maidUsername, requestData } = req.body;

    // Validate input
    if (!requestData || !requestData._id) {
        return res.status(400).json({ error: 'Request data is missing or invalid' });
    }

    if (!maidUsername) {
        return res.status(400).json({ error: 'Maid username is undefined or missing' });
    }

    try {
        // Update the request status in the database
        const updatedRequest = await Request.findByIdAndUpdate(requestData._id, { status: 'accepted' });
        if (!updatedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Fetch the maid's details
        const maid = await User.findOne({ username: maidUsername });
        if (!maid) {
            return res.status(404).json({ error: 'Maid not found' });
        }

        // Store accepted request details in the AcceptedRequest collection
        const acceptedRequest = new AcceptedRequest({  // Ensure you're using the correct constructor
            requestId: requestData._id,
            username1: maid.username,
            maidPhone: maid.phone,
            username2: requestData.username,
            userId: requestData.userId,
            phone: requestData.phone, // Store user's phone number
            address: requestData.address, // Store user's address
            date: requestData.date,
            time: requestData.time,
            details: requestData.details,
        });

        await acceptedRequest.save();

        res.status(201).json({ message: 'Request accepted successfully', acceptedRequest });
    } catch (error) {
        console.error('Error in accepting request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Routes
app.use('/requests', requestRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/acceptedrequests', acceptedRequestRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); //done
