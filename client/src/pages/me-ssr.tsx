import { GetServerSideProps } from "next";
import { FC } from "react";
import { fetcherSSR } from "src/lib/fetcher-ssr";
import env from "src/lib/environment";
import { UserDocument } from "@shared";
import { useUser } from "src/context/user-context";
import Logout from "src/components/logout";

const MeSSR: FC = () => {
  const { user } = useUser();
  return (
    <main className="flex items-center justify-center h-full">
      <div className="space-y-4 text-center">
        <h1 className="px-4 py-2 text-lg font-medium bg-gray-200 rounded">Server Side Authentication</h1>
        {user ? <p>Hi, {user.name} 👋🏽</p> : <p>Loading...</p>}
        {/* When you view the page spurce, the user will be populated already*/}
        <Logout />
      </div>
    </main>
  );
};

export default MeSSR;

export const getServerSideProps: GetServerSideProps = async context => {
  const { req, res } = context;
  const [error, user] = await fetcherSSR<UserDocument>(req, res, `${env.apiUrl}/me`);

  if (!user) return { redirect: { statusCode: 307, destination: "/" } };
  return { props: { user } };
};
