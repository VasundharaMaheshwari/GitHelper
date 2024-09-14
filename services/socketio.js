const userIdtoSocketMap = new Map()

const setid = (userId,socketid) => {
    return userIdtoSocketMap.set(userId,socketid)
}

const getid = (userId) => {
    return userIdtoSocketMap.get(userId)
}

const delid = (userId) => {
    return userIdtoSocketMap.delete(userId)
}

module.exports = { setid,getid,delid }