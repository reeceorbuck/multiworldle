import React, { createContext, ReactChild } from "react";

// const ws = new WebSocket("ws://localhost");

const socketProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const echoSocketUrl =
  socketProtocol + "//" + window.location.hostname + ":8000" + "/ws/";
console.log("attempt websocket: ", echoSocketUrl);
const ws = new WebSocket(echoSocketUrl);
console.log("ws: ", ws);

export const SocketContext = createContext(ws);

interface ISocketProvider {
  children: ReactChild;
}

export const SocketProvider = (props: ISocketProvider) => (
  <SocketContext.Provider value={ws}>{props.children}</SocketContext.Provider>
);
