const sessionIdtoUserMap = new Map()

const setUser = (sessionId,user) => {
    sessionIdtoUserMap.set(sessionId,user)
}

const getUser = (sessionId) => {
    return sessionIdtoUserMap.get(sessionId)
}

module.exports = { setUser,getUser }