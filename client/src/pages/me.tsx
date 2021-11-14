import { useEffect } from "react";
import { UserDocument } from "@shared";
import Router from "next/router";
import { useUser } from "src/context/user-context";
import env from "src/lib/environment";
import { fetcher } from "src/lib/fetcher";
import Logout from "src/components/logout";
import { NextPage } from "next";

const Me: NextPage = () => {
  // this page is for CS auth: user will be authenticated in the browser through javascript
  const { user, setUser } = useUser();

  const getMe = async () => {
    const [error, user] = await fetcher<UserDocument>(`${env.apiUrl}/me`);
    if (!error && user) setUser(user);
    else Router.push("/");
  };

  useEffect(() => {
    if (!user) getMe();
  });

  return (
    <main className="flex items-center justify-center h-full">
      <div className="space-y-4 text-center">
        <h1 className="px-4 py-2 text-lg font-medium bg-gray-200 rounded">Client Side Authentication</h1>

        {user ? <p>Hi, {user.name} 👋🏽</p> : <p>Loading...</p>}
        <Logout />
      </div>
    </main>
  );
};

export default Me;
