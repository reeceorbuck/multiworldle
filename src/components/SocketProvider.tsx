import React, { createContext, ReactChild, useEffect, useState } from "react";

const socketProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const echoSocketUrl = socketProtocol + "//" + window.location.hostname + "/ws/";
//console.log("attempt websocket: ", echoSocketUrl);
const webSocket = new WebSocket(echoSocketUrl);
console.log("initial webSocket: ", webSocket);

export const SocketContext = createContext(webSocket);

interface ISocketProvider {
  children: ReactChild;
}

export const SocketProvider = (props: ISocketProvider) => {
  const [ws, setWs] = useState<WebSocket>(webSocket);
  useEffect(() => {
    const onClose = () => {
      console.log("Socket closed!");
      setTimeout(() => {
        console.log("Creating fresh websocket");
        setWs(new WebSocket(echoSocketUrl));
      }, 5000);
    };
    console.log("Adding close event listener to socket");
    ws.addEventListener("close", onClose);

    return () => {
      console.log("Removing close event listener from socket");
      ws.removeEventListener("close", onClose);
    };
  }, [ws, setWs]);

  console.log("ws in socketProvider: ", ws);
  return (
    <SocketContext.Provider value={ws}>{props.children}</SocketContext.Provider>
  );
};
