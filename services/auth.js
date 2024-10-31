const sessionIdtoUserMap = new Map();

const setUser = (sessionId, user) => {
  return sessionIdtoUserMap.set(sessionId, user);
};

const getUser = (sessionId) => {
  return sessionIdtoUserMap.get(sessionId);
};

const delUser = (sessionId) => {
  return sessionIdtoUserMap.delete(sessionId);
};

module.exports = { setUser, getUser, delUser };