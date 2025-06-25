import { io } from "socket.io-client";

const socket = io("http://collaborative-whiteboard-production-4885.up.railway.app");
export default socket;
