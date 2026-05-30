const Message = require('../models/Message');

module.exports = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
    });

    socket.on('sendMessage', async (data) => {
      try {
        const msg = await Message.create({
          conversation: data.conversation,
          sender: data.senderId,
          content: data.content,
          type: data.type || 'text',
        });
        const populated = await msg.populate('sender', 'name avatar');
        io.to(data.conversation).emit('newMessage', populated);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('typing', (data) => {
      socket.to(data.conversation).emit('typing', { userId: data.userId, userName: data.userName });
    });

    socket.on('stopTyping', (data) => {
      socket.to(data.conversation).emit('stopTyping', { userId: data.userId });
    });

    socket.on('sosAlert', (data) => {
      io.emit('sos', data);
    });

    socket.on('shareLocation', (data) => {
      socket.to(data.trekId).emit('memberLocation', data);
    });

    socket.on('notification', (data) => {
      const recipientSocket = onlineUsers.get(data.recipientId);
      if (recipientSocket) {
        io.to(recipientSocket).emit('newNotification', data);
      }
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      }
    });
  });
};
