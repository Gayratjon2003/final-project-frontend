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
import { useTranslation } from "react-i18next";
import { changeToken, getUserInfo } from "../../store/userSlice";

const defaultTheme = createTheme();
export default function SignUp() {
  const { t } = useTranslation();
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
          dispatch(changeToken({ token: data?.token }));
          dispatch(getUserInfo(data?.token));
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
    <>
      <div className="login-center py-20">
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
                {t("signup.title")}
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
                      className="bg-white dark:bg-black login-input"
                      autoComplete="given-name"
                      name="name"
                      required
                      fullWidth
                      id="name"
                      placeholder={t("signup.name")}
                      autoFocus
                      error={false}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="bg-white dark:bg-black login-input"
                      required
                      fullWidth
                      id="email"
                      placeholder={t("signup.email")}
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="bg-white dark:bg-black login-input"
                      required
                      fullWidth
                      name="password1"
                      placeholder={t("signup.password")}
                      type="password"
                      id="password1"
                      autoComplete="Password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="bg-white dark:bg-black login-input"
                      required
                      fullWidth
                      name="password2"
                      placeholder={t("signup.password2")}
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
                  {t("signup.title")}
                </Button>
                <Grid container justifyContent="flex-start">
                  <Grid item>
                    <Link
                      variant="body2"
                      onClick={() => navigate("/login")}
                      className="cursor-pointer"
                    >
                      {t("signup.haveAccount")}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>
    </>
  );
}
