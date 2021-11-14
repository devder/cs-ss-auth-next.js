import Router from "next/router";
import { FC } from "react";
import { useUser } from "src/context/user-context";
import env from "src/lib/environment";
import { poster } from "src/lib/poster";

const Logout: FC = () => {
  const { user } = useUser();

  const onLogout = async () => {
    await poster(`${env.apiUrl}/logout`);
    Router.replace("/");
  };

  // you won't be able to generate a new access token
  const onLogoutAll = async () => {
    await poster(`${env.apiUrl}/logout-all`);
    Router.replace("/");
  };

  return (
    <>
      {user && (
        <div className="flex justify-center space-x-2">
          <button className="text-sm font-medium text-blue-500 " onClick={onLogout}>
            Logout
          </button>
          <button className="text-sm  text-blue-500 " onClick={onLogoutAll}>
            Logout All
          </button>
        </div>
      )}
    </>
  );
};

export default Logout;
