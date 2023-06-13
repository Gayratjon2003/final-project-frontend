import React from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  createTheme,
  ThemeProvider,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../../constant";
import { useDispatch } from "react-redux";
import { snackbarStart } from "../../store/SnackbarSlice";
import { start, done } from "../../store/loaderSlice";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://www.gayratjon.uz">
        Gayratjon.uz
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(start());
    const formData = new FormData(event.currentTarget);
    try {
      const { data } = await axios({
        method: "post",
        url: LOGIN_URL,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          email: formData.get("email"),
          password: formData.get("password"),
        },
      });
      dispatch(
        snackbarStart({
          text: data?.text,
          severity: "success",
        })
      );
    dispatch(done());
    localStorage.setItem("token", JSON.stringify(data?.token));
    localStorage.setItem("id", JSON.stringify(data?._id));
    navigate("/");
    } catch (err) {
      console.log(err);
      dispatch(
        snackbarStart({
          text: err?.response?.data || "Something went wrong!",
          severity: "error",
        })
      );
    dispatch(done());
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  variant="body2"
                  onClick={() => navigate("/signup")}
                  className="cursor-pointer"
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default Login;
