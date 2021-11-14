import { AccessToken, Cookies, Message } from "@shared";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import { Buffer } from "buffer";
import * as WebSocket from "ws";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";

interface AuthenticatedSocket extends WebSocket {
  accessToken: AccessToken;
}

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;

const server = createServer((req: IncomingMessage, res: ServerResponse) => res.end());
const wss = new WebSocket.Server({ noServer: true });

// upgrade the http connection to a duplex realtime connection
// we can now control which clients will be connected to the web socket
// and we can read and validate the access token from the client that wants to connect

server.on("upgrade", (request: IncomingMessage, socket: Socket, head: Buffer) => {
  try {
    const cookies = cookie.parse(request.headers.cookie as string);
    const accessToken = jwt.verify(cookies[Cookies.AccessToken], accessTokenSecret) as AccessToken;
    wss.handleUpgrade(request, socket, head, ws => {
      // to decide which socket belongs to which user, store the accesstoken payload on the websocket
      (ws as AuthenticatedSocket).accessToken = accessToken;
      wss.emit("connection", ws);
    });
  } catch (error) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
  }
});

function validateExpiration(socket: AuthenticatedSocket) {
  // check if the access token has expired
  if (new Date().getTime() / 1000 > socket.accessToken.exp) {
    socket.close();
  }
}

function broadcast(message: Message) {
  // send all connected clients the message
  (wss.clients as Set<AuthenticatedSocket>).forEach(client => {
    validateExpiration(client);
    client.send(JSON.stringify(message));
  });
}

// after the client has successfully connected to the socket, we use the connection handler to send and receive data
wss.on("connection", (socket: AuthenticatedSocket) => {
  socket.on("message", (message: Buffer) => {
    validateExpiration(socket);
    const msg = { text: message.toString(), userId: socket.accessToken.userId } as Message;
    broadcast(msg);
  });
});

server.listen(3000, () => {
  console.log("web socket running...");
});
