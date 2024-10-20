import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SignInResponse } from "../types/signInResponse";
import { SIGN_IN } from "../mutations/authMutations";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failSignIn, setFailSignIn] = useState(false);
  const [signin] = useMutation<SignInResponse>(SIGN_IN);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const signInInput = { email, password };
    try {
      const result = await signin({ variables: { signInInput } });
      if (result.data?.signIn) {
        localStorage.setItem("token", result.data.signIn.accessToken);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      localStorage.getItem("token") && navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        setFailSignIn(true);
        return;
      }
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {failSignIn && (
              <Typography
                variant="body2"
                color="error"
                sx={{ textAlign: "center" }}
              >
                Invalid email or password
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
