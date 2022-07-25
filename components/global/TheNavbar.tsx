import React from "react";
import Link from "next/link";
import TheModal from "./TheModal";
import TheLogin from "./TheLogin";
import LoginBtn from "./LoginBtn";
import RegisterBtn from "./RegisterBtn";
// import LogoutBtn from "./LogoutBtn";
import TheRegister from "./TheRegister";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/user/userSlice";
import UsersService from "../../services/UsersService";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const TheNavbar = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { userInfo, userToken } = useSelector(
    (state: any) => state.userReducer
  );
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await UsersService.logout();
    dispatch(logout());
    router.push("/");
  };
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      {mounted && (
        <header className="w-full mx-auto p-5 sm:px-0 navbar">
          <div className="container m-auto">
            <ul className="flex justify-end">
              {/* if logged ? ['Ingresar', 'Registrarse'] : ['Mis favoritos' 'Salir'] */}
              {userToken || userInfo ? (
                <>
                  <li className="p-2 flex">
                    {router.pathname === "/favorites" ? (
                      <Link href="/">
                        <a className="self-center underline">Home</a>
                      </Link>
                    ) : (
                      <Link href="/favorites">
                        <a className="self-center underline">Mis favoritos</a>
                      </Link>
                    )}
                  </li>
                  <li>
                    <button
                      className="rounded btn bg-primary text-white p-2 border-white"
                      onClick={() => handleLogout()}
                    >
                      Salir
                    </button>
                    {/* <LogoutBtn logout={dispatch(logout())} /> */}
                  </li>
                </>
              ) : (
                <>
                  <li className="p-2">
                    <TheModal
                      button={<LoginBtn />}
                      title={"Ingresar"}
                      content={<TheLogin />}
                    />
                  </li>
                  <li className="p-2">
                    <TheModal
                      button={<RegisterBtn />}
                      title={"Registrarse"}
                      content={<TheRegister />}
                    />
                  </li>
                </>
              )}
            </ul>
          </div>
        </header>
      )}
    </>
  );
};

export default TheNavbar;
