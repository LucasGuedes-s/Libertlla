
import { io } from 'socket.io-client';

const socket = io('https://libertlla.onrender.com', {
  transports: ["websocket"],
});
 

export default socket;
