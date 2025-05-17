import { useContext } from "react";
import AppStack from "./AppStack";
import UserStack from "./UserStack";
import { AuthContext } from "../context/AuthContext";

const UserNav = () => {
  const { userInfo } = useContext(AuthContext);

  console.log(userInfo);

  return userInfo.role === "admin" ? <AppStack /> : <UserStack />;
  //   return <UserStack />;
};

export default UserNav;
