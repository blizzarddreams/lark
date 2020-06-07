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
// import { useHistory } from "react-router-dom";
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

const Register = (): JSX.Element => {
  const [credentials, setCredentials] = useState({
    username: "",
    password1: "",
    password2: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    username: [],
    password1: [],
    password2: [],
    email: [],
  });
  const classes = useStyles();
  // const history = useHistory();
  const csrf = Cookies.get("csrftoken")!;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const body = JSON.stringify({
      username: credentials.username,
      password1: credentials.password1,
      password2: credentials.password2,
      email: credentials.email,
    });
    fetch("/profiles/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
      },
      body,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // todo
        } else {
          setErrors(data.errors);
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
        <Typography variant="h1">Register</Typography>
        <TextField
          className={classes.input}
          value={credentials.username}
          onChange={handleCredentialsChange}
          name="username"
          label="Username"
          variant="outlined"
          error={!!errors.username.length}
          helperText={errors.username.join("\n")}
        />
        <TextField
          className={classes.input}
          value={credentials.email}
          onChange={handleCredentialsChange}
          name="email"
          label="E-Mail"
          variant="outlined"
          type="email"
          error={!!errors.email.length}
          helperText={errors.email.join("\n")}
        />
        <TextField
          className={classes.input}
          value={credentials.password1}
          onChange={handleCredentialsChange}
          name="password1"
          type="password"
          label="Password"
          variant="outlined"
          error={!!errors.password1.length}
          helperText={errors.password1.join("\n")}
        />
        <TextField
          className={classes.input}
          value={credentials.password2}
          onChange={handleCredentialsChange}
          name="password2"
          type="password"
          label="Repeat Password"
          variant="outlined"
          error={!!errors.password2.length}
          helperText={errors.password2.join("\n")}
        />
        <Button type="submit" className={classes.button}>
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default Register;
