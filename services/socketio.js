const socketIdToMapping = new Map();
const userIdtoSocketMap = new Map();

const setid = (userId, receiverId, socketid) => {
  if (!userIdtoSocketMap.has(userId)) {
    userIdtoSocketMap.set(userId, new Map());
  }
  const receiverMap = userIdtoSocketMap.get(userId);
  receiverMap.set(receiverId, socketid);

  socketIdToMapping.set(socketid, { userId, receiverId });
};

const getid = (userId, receiverId) => {
  const receiverMap = userIdtoSocketMap.get(userId);
  if (receiverMap) {
    return receiverMap.get(receiverId) || null;
  }
  return null;
};

const delid = (userId, receiverId = null) => {
  if (receiverId) {
    const receiverMap = userIdtoSocketMap.get(userId);
    if (receiverMap) {
      receiverMap.delete(receiverId);
      if (receiverMap.size === 0) {
        userIdtoSocketMap.delete(userId);
      }
    }
  } else {
    return userIdtoSocketMap.delete(userId);
  }
};

const delBySocketId = (socketId) => {
  const mapping = socketIdToMapping.get(socketId);
  if (mapping) {
    const { userId, receiverId } = mapping;
    delid(userId, receiverId);
    socketIdToMapping.delete(socketId);
  }
};

module.exports = { setid, getid, delid, delBySocketId };
