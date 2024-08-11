'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client'

interface ISocketContext {
  socket: Socket | null;
}

interface SocketProviderProps {
  children: ReactNode;
}
const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context.socket;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const SOCKET_URL = 'http://localhost:5000';

    const socketIo = io(SOCKET_URL, {
      transports: ['websocket'],  
      reconnection: true,
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};