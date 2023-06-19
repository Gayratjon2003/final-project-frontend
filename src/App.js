import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Login, SignUp, Navbar, Footer, Item, Collection } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert, Box, CircularProgress } from "@mui/material";
import { snackbarDone } from "./store/SnackbarSlice";
import { getUserInfo } from "./store/userSlice";
function App() {
  const dispatch = useDispatch();
  const { status, text, severity } = useSelector((state) => state.snackBar);
  const { user, token } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.loader);
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
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
  }, []);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(getUserInfo(JSON.parse(localStorage.getItem("token"))));
    }
  }, []);
  return (
    <>
      <div className="App dark:bg-black w-full h-screen">
        <Navbar />
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/collection/:id" element={<Collection />} />
        </Routes>
        <Footer />
      </div>
      <div>
        <Snackbar
          open={status}
          autoHideDuration={5000}
          onClose={() => dispatch(snackbarDone())}
        >
          <Alert
            onClose={() => dispatch(snackbarDone())}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {text}
          </Alert>
        </Snackbar>
        {isLoading && (
          <div
            className="loader"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: "0px",
              left: "0px",
              width: "100vw",
              height: "100vh",
              background: "rgba(12,14,48, 0.7)",
              zIndex: "10",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <CircularProgress style={{ color: "white" }} />
            </Box>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
