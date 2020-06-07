import React, { useContext } from "react";
import {
  Box,
  Typography,
  Button,
  makeStyles,
  Theme,
  darken,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import DarkModeContext from "./DarkMode";

interface StyleProps {
  darkMode: boolean;
}
const useStyles = makeStyles((theme: Theme) => ({
  button: (props: StyleProps) => ({
    margin: theme.spacing(1),
    backgroundColor: props.darkMode ? "#e9f3f9" : "#051925",
    color: props.darkMode ? "#222" : "#eee",
    "&:hover": {
      backgroundColor: darken("#051925", 0.1),
      color: "#eee",
    },
  }),
  box: {
    paddingTop: theme.spacing(4),
  },
}));
const Home = (): JSX.Element => {
  const darkMode = useContext(DarkModeContext);
  const classes = useStyles({ darkMode });
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      className={classes.box}
    >
      <Typography variant="h1">Lark</Typography>
      <Typography variant="body1">Blogging made easy</Typography>
      <Box display="flex" justifyContent="center" flexDirection="row">
        <Button
          component={Link}
          to="/login"
          variant="contained"
          className={classes.button}
        >
          Login
        </Button>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          className={classes.button}
        >
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
