"use client";

import Pusher from "pusher-js";
import { useEffect, useState } from "react";

type Message = {
  message: string;
  username: string;
};

export default function Home() {
  const [username, setUsername] = useState("username");
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  let allMessages: Message[] = [];

  useEffect(() => {
    import("preline");
  }, []);

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.PUSHER_API_KEY || "", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", (data: any) => {
      allMessages.push(data);
      setMessages(allMessages);
    });
  });

  const submit = async (e: any) => {
    e.preventDefault();

    await fetch("http://localhost:8000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        message,
      }),
    });

    setMessage("");
  };

  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-screen-md py-12 px-4 sm:px-6 md:max-w-screen-xl md:py-20 lg:py-32 md:px-8">
        <div className="md:pr-8 md:w-1/2 xl:pr-0 xl:w-5/12">
          <h1 className="text-3xl text-gray-800 font-bold md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight dark:text-gray-200">
            Talk to me{" "}
            <span className="text-blue-600 dark:text-blue-500">friend</span>
          </h1>

          <div className="mt-8 grid">
            <div className="mb-4">
              <input
                type="text"
                className="py-2 px-3 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="py-6 flex items-center text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:mr-6 after:flex-[1_1_0%] after:border-t after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
            Messages
          </div>

          <div className="mb-4 border p-3">
            {messages.map(({ message, username }, id) => (
              <div
                key={id}
                className="flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5 dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7] dark:text-gray-400"
              >
                {message} from | {username}
              </div>
            ))}
          </div>

          <div className="py-6 flex items-center text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:mr-6 after:flex-[1_1_0%] after:border-t after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600"></div>

          <form onSubmit={submit}>
            <div className="mb-4">
              <input
                type="text"
                id="hs-hero-email-2"
                className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 sm:p-4 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                placeholder="Say something"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="grid">
              <button
                type="submit"
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800 sm:p-4"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:block md:absolute md:top-0 md:left-1/2 md:right-0 h-full bg-[url('https://images.unsplash.com/photo-1606868306217-dbf5046868d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1981&q=80')] bg-no-repeat bg-center bg-cover"></div>
    </div>
  );
}
