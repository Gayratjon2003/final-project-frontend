import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
import {
  styled,
  FormControlLabel,
  Switch,
  InputBase,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
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

const navData = [
  {
    id: 1,
    name: "EN",
    encode: "en",
  },
  {
    id: 2,
    name: "UZ",
    encode: "uz",
  },
];
const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [showSelected, setShowSelected] = useState(navData[0]);
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
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
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const onSelectClick = (id) => {
    setShowSelected(navData[id - 1]);
    changeLanguage(navData[id - 1].encode);
    setShowSelect(false);
  };
  const searchHandle = () => {
    console.log("search: ", searchText);
  };
  return (
    <>
      <div className="navbar bg-white dark:bg-black w-full h-[80px] flex justify-center items-center fixed z-10">
        <div className="container">
          <div className="navbar-box w-full flex justify-between items-center h-[80px]">
            <div className="left flex items-center">
              <Link to="/">
                <HomeIcon
                  className="text-black dark:text-white text-4xl mr-6"
                  fontSize="24"
                />
              </Link>
              <div className="center w-3/4 flex items-center">
                <div className="languages mr-3">
                  <div className="cursor-pointer w-[40px">
                    <div
                      className="flex items-center p-2"
                      onClick={() => setShowSelect(!showSelect)}
                    >
                      <p className="mr-3">{showSelected.name}</p>
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
                        defaultChecked={
                          localStorage.getItem("theme") === "dark"
                        }
                        onChange={(e) => changeTheme(e.target.checked)}
                      />
                    }
                  />
                </div>
                <div className="search rounded-md border-2 border-[#333] text-black dark:text-white dark:border-white">
                  <div className="pl-2 flex items-center">
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search"
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
            </div>
            <div className="right flex items-center gap-x-3 text-white dark:text-black ">
              <Link to="/login">
                <button className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase">
                  {t("navbar.login")}
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-3 bg-green-500 dark:bg-white rounded-md uppercase">
                  {t("navbar.signup")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
