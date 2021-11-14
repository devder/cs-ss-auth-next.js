import { useState, useRef, useEffect } from "react";
import { GetServerSideProps, NextPage } from "next";
import { Message, UserDocument } from "@shared";
import env from "src/lib/environment";
import { fetcherSSR } from "src/lib/fetcher-ssr";
import { refreshTokens } from "src/lib/fetcher";

const Realtime: NextPage = props => {
  const [value, setValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const ws = useRef<WebSocket>();

  useEffect(() => {
    if (isReconnecting) return;

    if (!ws.current) {
      ws.current = new WebSocket(env.realtimeURl);
      ws.current.onopen = () => setIsOpen(true);
      ws.current.onclose = async () => {
        setIsOpen(false);
        setIsReconnecting(true);
        await refreshTokens();
        setIsReconnecting(false);
      };
    }

    return () => {
      // close connection when component unmounts
      if (ws.current) {
        ws.current.close();
        ws.current = undefined;
      }
    };
  }, [isReconnecting]);

  useEffect(() => {
    if (ws.current) {
      ws.current.onmessage = msg => {
        const parsedData = JSON.parse(msg.data);
        setMessages([...messages, parsedData]);
      };
    }
  }, [isReconnecting, messages]);

  const sendMessage = () => {
    if (ws.current && isOpen) {
      ws.current.send(value);
      setValue("");
    }
  };

  return (
    <main className="flex items-center justify-center h-full">
      <div className="space-y-4 text-center">
        <h1 className="px-4 py-2 text-lg font-medium bg-gray-200 rounded">WebSocket Authentication</h1>

        <div>
          {isOpen ? <p className="text-green-500">Connected </p> : <p className="text-red-500">Disconnected</p>}
        </div>

        <div className="flex flex-col space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className="self-start">
              <span className="p-1 px-2 text-sm bg-gray-200 rounded">{msg.text}</span>
            </div>
          ))}
        </div>

        <input
          className="w-full px-2 py-1 border-2 border-gray-200 rounded outline-none focus:border-gray-400"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyPress={e => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
        />
      </div>
    </main>
  );
};

export default Realtime;

export const getServerSideProps: GetServerSideProps = async context => {
  const { req, res } = context;
  const [error, user] = await fetcherSSR<UserDocument>(req, res, `${env.apiUrl}/me`);

  if (!user) return { redirect: { statusCode: 307, destination: "/" } };
  return { props: { user } };
};
