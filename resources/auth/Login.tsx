import React, { useState } from "react";
import {
  TextField,
  makeStyles,
  Theme,
  fade,
  Typography,
  Button,
  darken,
  Box,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    width: "40%",
    margin: theme.spacing(1),
    backgroundColor: "#449dd1",
    color: "#eee",
    "&:hover": {
      backgroundColor: darken("#449dd1", 0.1),
      color: "#eee",
    },
  },
  input: {
    width: "40%",
    margin: theme.spacing(1),
    "& .MuiFormLabel-root": {
      color: "#222",
    },
    "& .MuiOutlinedInput-root": {
      color: "#222",
      backgroundColor: fade("#449dd1", 0.1),

      "&.Mui-focused fieldset": {
        borderColor: "#449dd1",
      },
    },
    "& .MuiFormHelperText-root": {
      fontWeight: "bold",
    },
    "&:focus": {
      borderColor: "#eee",
    },
  },
  form: {
    width: "100%",
  },
}));

const Login = (): JSX.Element => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const classes = useStyles();
  const history = useHistory();
  const csrf = Cookies.get("csrftoken")!;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const body = JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    });
    fetch("/login/", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          Cookies.set("token", data.access); // needs to be HTTPOnly soon.
          history.push("/dashboard");
          // todo fetch email and set it
        } else {
          setError(data.detail);
        }
      });
  };

  const handleCredentialsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const name = e.target.getAttribute("name")!;
    setCredentials({ ...credentials, [name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Typography variant="h1">Login</Typography>
        <TextField
          className={classes.input}
          value={credentials.username}
          onChange={handleCredentialsChange}
          name="username"
          label="Username"
          variant="outlined"
          error={!!error.length}
          helperText={error}
        />
        <TextField
          className={classes.input}
          value={credentials.password}
          onChange={handleCredentialsChange}
          name="password"
          type="password"
          label="Password"
          variant="outlined"
        />
        <Button type="submit" className={classes.button}>
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default Login;
