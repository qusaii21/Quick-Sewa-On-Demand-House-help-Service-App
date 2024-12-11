// utils/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Update this with your backend URL

const socket = io(SOCKET_URL);

export default socket;
