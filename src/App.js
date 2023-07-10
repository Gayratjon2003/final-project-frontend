import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Home,
  Login,
  SignUp,
  Navbar,
  Footer,
  Item,
  Collection,
  AllItems,
  AllCollections,
  Dashboard,
  DashboardUsers,
  DashboardCategories,
  DashboardCollections,
  SearchResult,
} from "./components";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert, Box, CircularProgress } from "@mui/material";
import { snackbarDone } from "./store/SnackbarSlice";
import { changeToken, getUserInfo } from "./store/userSlice";
import { routes } from "./constant";
function App() {
  const dispatch = useDispatch();
  const { status, text, severity } = useSelector((state) => state.snackBar);
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
    if (
      localStorage.getItem("token") !== "undefined" &&
      localStorage.getItem("token")
    ) {
      dispatch(
        changeToken({ token: JSON.parse(localStorage.getItem("token")) })
      );
      dispatch(getUserInfo(JSON.parse(localStorage.getItem("token"))));
    }
  }, []);
  return (
    <>
      <div className="App dark:bg-black w-full h-screen">
        <Navbar />
        <Routes>
          <Route path={routes.HOME} element={<Home />} />
          <Route path={routes.LOGIN} element={<Login />} />
          <Route path={routes.SIGNUP} element={<SignUp />} />
          <Route path={routes.SEARCH_RESULT} element={<SearchResult />} />
          <Route path={routes.ITEM_ID} element={<Item />} />
          <Route path={routes.COLLECTION_ID} element={<Collection />} />
          <Route path={routes.ALL_ITEMS} element={<AllItems />} />
          <Route path={routes.ALL_COLLECTIONS} element={<AllCollections />} />
          {/* Dashboard */}
          <Route path={routes.DASHBOARD.HOME} element={<Dashboard />} />
          <Route path={routes.DASHBOARD.USERS} element={<DashboardUsers />} />
          <Route
            path={routes.DASHBOARD.CATEGORIES}
            element={<DashboardCategories />}
          />
          <Route
            path={routes.DASHBOARD.COLLECTIONS}
            element={<DashboardCollections />}
          />
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
              zIndex: "20",
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
