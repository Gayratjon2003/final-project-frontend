import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "react-i18next";
import {
  styled,
  FormControlLabel,
  Switch,
  InputBase,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { switchLang } from "../../store/languageSlice";
import { clearUser } from "../../store/userSlice";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));
const Navbar = () => {
  const { navData, selectedLang } = useSelector((state) => state.language);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [nav, setNav] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [searchText, setSearchText] = useState("");
  const changeTheme = (val) => {
    val
      ? localStorage.setItem("theme", "dark")
      : localStorage.setItem("theme", "light");
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  const onSelectClick = (id) => {
    dispatch(switchLang(navData[id - 1]));
    setShowSelect(false);
  };
  const searchHandle = () => {
    if (searchText?.trim()?.length > 0) {
      setNav(false);
      navigate(`/search/search=${searchText}`);
    }
  };
  const handleKeyDownSearchText = (e) => {
    if (e.key === "Enter") {
      searchHandle();
    }
  };
  const gotoDashboard = () => {
    navigate("/dashboard");
  };
  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/");
  };
  const getEmptySearchText = () => {
    setSearchText("");
  };
  const openMenu = () => {
    setNav(true);
  };
  const closeMenu = () => {
    setNav(false);
  };
  useEffect(() => {
    if (localStorage?.getItem("lang") === "uz") {
      dispatch(switchLang(navData[1]));
    } else {
      dispatch(switchLang(navData[0]));
    }
  }, []);
  return (
    <div className="navbar bg-white dark:bg-black w-full h-[80px] flex justify-center items-center fixed z-20 border-b-[1px] border-green-500">
      <div className="container">
        <div className="navbar-box w-full flex justify-between items-center h-[80px]">
          <div className="left flex items-center">
            <Link to="/" onClick={getEmptySearchText}>
              <HomeIcon
                className="text-black dark:text-white text-4xl mr-6"
                fontSize="24"
                onClick={closeMenu}
              />
            </Link>
          </div>
          <div className="w-full flex justify-between items-center max-md:hidden block">
            <div className="center w-3/4 flex items-center">
              <div className="languages mr-3">
                <div className="cursor-pointer w-[40px">
                  <div
                    className="flex items-center p-2"
                    onClick={() => setShowSelect(!showSelect)}
                  >
                    <p className="mr-3">{selectedLang.name}</p>
                  </div>

                  <div
                    className={`flex flex-col fixed gap-y-4 p-2 bg-white dark:bg-black ${
                      showSelect ? "block" : "hidden"
                    }`}
                  >
                    {navData?.map((item) => (
                      <div
                        className="flex w-full items-center"
                        key={item.id}
                        onClick={() => onSelectClick(item.id)}
                      >
                        <p className="">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="switch-theme mr-3">
                <FormControlLabel
                  control={
                    <MaterialUISwitch
                      sx={{ m: 1 }}
                      defaultChecked={localStorage.getItem("theme") === "dark"}
                      onChange={(e) => changeTheme(e.target.checked)}
                    />
                  }
                />
              </div>
              <div className="search rounded-md border-2 border-[#333] text-black dark:text-white dark:border-white">
                <div className="pl-2 flex items-center">
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={t("navbar.search")}
                    onKeyDown={handleKeyDownSearchText}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="nav-search dark:!text-white w-[200px]"
                  />
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    onClick={searchHandle}
                  >
                    <SearchIcon className="text-black dark:text-white" />
                  </IconButton>
                </div>
              </div>
            </div>
            {user?.status === "Active" && (
              <div className="right flex items-center gap-x-3 text-white dark:text-black">
                <button
                  className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
                  onClick={gotoDashboard}
                >
                  {t("navbar.dashboard")}
                </button>
                <button
                  className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase whitespace-nowrap"
                  onClick={handleLogout}
                >
                  {t("navbar.logout")}
                </button>
              </div>
            )}
            {!user?.status && (
              <div className="right flex items-center gap-x-3 text-white dark:text-black">
                <Link to="/login">
                  <button className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase">
                    {t("navbar.login")}
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase whitespace-nowrap">
                    {t("navbar.signup")}
                  </button>
                </Link>
              </div>
            )}
          </div>
          {nav && (
            <div className="w-full flex justify-center items-center max-md:block hidden fixed top-[80px] left-0 w-full h-full bg-white dark:bg-black gap-x-3 z-10">
              <div className="center flex items-center flex-col justify-center mt-20">
                <div className="switch-theme mr-3 max-sm:m-0 max-sm:ml-4">
                  <FormControlLabel
                    control={
                      <MaterialUISwitch
                        sx={{ m: 1 }}
                        defaultChecked={
                          localStorage.getItem("theme") === "dark"
                        }
                        onChange={(e) => changeTheme(e.target.checked)}
                      />
                    }
                  />
                </div>
                <div className="languages mr-3 max-sm:m-0 relative z-10">
                  <div className="cursor-pointer w-[40px] ">
                    <div
                      className="flex items-center p-2"
                      onClick={() => setShowSelect(!showSelect)}
                    >
                      <p className="mr-3">{selectedLang.name}</p>
                    </div>
                    <div
                      className={`flex flex-col fixed p-2 bg-white dark:bg-black ${
                        showSelect ? "block" : "hidden"
                      }`}
                    >
                      {navData?.map((item) => (
                        <div
                          className="flex w-full items-center  py-2"
                          key={item.id}
                          onClick={() => onSelectClick(item.id)}
                        >
                          <p className="">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="search rounded-md border-2 border-[#333] text-black dark:text-white dark:border-white my-3">
                  <div className="pl-2 flex items-center">
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder={t("navbar.search")}
                      onKeyDown={handleKeyDownSearchText}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="nav-search dark:!text-white w-[200px]"
                    />
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      onClick={searchHandle}
                    >
                      <SearchIcon className="text-black dark:text-white" />
                    </IconButton>
                  </div>
                </div>
              </div>
              {user?.status === "Active" && (
                <div className="right flex items-center gap-x-3 text-white dark:text-black flex-col justify-center gap-y-3">
                  <button
                    className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
                    onClick={() => {
                      gotoDashboard();
                      closeMenu();
                    }}
                  >
                    {t("navbar.dashboard")}
                  </button>
                  <button
                    className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                  >
                    {t("navbar.logout")}
                  </button>
                </div>
              )}
              {!user?.status && (
                <div className="right flex items-center gap-x-3 text-white dark:text-black flex-col justify-center gap-y-3">
                  <Link to="/login">
                    <button
                      className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
                      onClick={closeMenu}
                    >
                      {t("navbar.login")}
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button
                      className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase"
                      onClick={closeMenu}
                    >
                      {t("navbar.signup")}
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}
          <div className="bottom hidden max-md:block">
            {nav ? (
              <button onClick={closeMenu}>
                <CloseIcon
                  className="text-black dark:text-white text-4xl"
                  fontSize="24"
                />
              </button>
            ) : (
              <button onClick={openMenu}>
                <MenuIcon
                  className="text-black dark:text-white text-4xl"
                  fontSize="24"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
