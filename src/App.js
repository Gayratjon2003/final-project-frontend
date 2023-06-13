import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Login, SignUp } from "./components";
function App() {
  const changeTheme = () => {
    if (localStorage.getItem("theme") === "light") {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
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
  useEffect(()=>{
    localStorage.setItem("theme", "light");
  },[])
  return (
    <div className="App dark:bg-black w-full h-screen">
       <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
    </div>
  );
}

export default App;
