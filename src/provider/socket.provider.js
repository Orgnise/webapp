import React, { createContext } from 'react'
import socket from '../lib/socket'

const SocketContext = createContext(null)
SocketContext.displayName = 'SocketContext'

export { SocketContext }

const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export default SocketProvider
