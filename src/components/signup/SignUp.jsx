import React from "react";
import {
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { REGISTER_URL } from "../../constant";
import axios from "axios";
import { snackbarStart } from "../../store/SnackbarSlice";
import { useDispatch } from "react-redux";
import { done, start } from "../../store/loaderSlice";

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

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(start());
    const formData = new FormData(event.currentTarget);

    if (
      formData.get("name").length !== 0 &&
      formData.get("email").length !== 0 &&
      formData.get("password1").length !== 0 &&
      formData.get("password2").length !== 0
    ) {
      if (formData.get("password1") === formData.get("password2")) {
        try {
          const { data } = await axios({
            method: "post",
            url: REGISTER_URL,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            data: {
              name: formData.get("name"),
              email: formData.get("email"),
              password: formData.get("password1"),
              isAdmin: false,
              status: "Active",
            },
          });
          localStorage.setItem("token", JSON.stringify(data?.token));
          localStorage.setItem("id", JSON.stringify(data?._id));
          dispatch(
            snackbarStart({
              text: "Account created successfully",
              severity: "success",
            })
          );
          dispatch(done());
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
      } else {
        dispatch(
          snackbarStart({
            text: "Passwords aren't same",
            severity: "error",
          })
        );
        dispatch(done());
      }
    } else {
      dispatch(
        snackbarStart({
          text: "Fields are not filled",
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Your name"
                  autoFocus
                  error={false}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password1"
                  label="Password"
                  type="password"
                  id="password1"
                  autoComplete="Password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Re-enter password"
                  type="password"
                  id="password2"
                  autoComplete="Re-enter password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-start">
              <Grid item>
                <Link
                  variant="body2"
                  onClick={() => navigate("/login")}
                  className="cursor-pointer"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
