import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./auth/Login";
import Dashboard from "./user/Dashboard";
import ViewPost from "./post/ViewPost";
import { makeStyles, Theme, Box, Fab, darken } from "@material-ui/core";
import Navbar from "./Navbar";
import Bookmarks from "./user/Bookmarks";
import NewPost from "./post/NewPost";
import { Helmet } from "react-helmet";
import DarkModeContext from "./DarkMode";
import EditPost from "./post/EditPost";
import {
  Brightness2 as SunIcon,
  Brightness5 as MoonIcon,
} from "@material-ui/icons";
import ViewUser from "./user/ViewUser";
import Search from "./Search";
import Register from "./auth/Register";
interface StyleProps {
  darkMode: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: (props: StyleProps) => ({
    minHeight: `calc(100% - ${theme.spacing(8)}px) !important`,
    paddingTop: theme.spacing(8),
    backgroundColor: props.darkMode ? "#222" : "#eee",
    color: props.darkMode ? "#eee" : "#222",
  }),
  darkModeButton: (props: StyleProps) => ({
    backgroundColor: props.darkMode ? "#dff0f7" : "#080b17",
    position: "fixed",
    right: 0,
    bottom: "4rem !important",
    margin: "2rem !important",
    color: props.darkMode ? "#080b17" : "#dff0f7",
    "&:hover": {
      backgroundColor: darken(props.darkMode ? "#dff0f7" : "#080b17", 0.1),
    },
  }),
}));

const App = (): JSX.Element => {
  const [darkMode, setDarkMode] = useState(false);
  const classes = useStyles({ darkMode });

  /*
  TODO:
  - Follow system
  - ajax for:
    - comments.
    - bookmarks.
    - your current posts.
    - maybe people who liked the post/comment(?).
  - settings page.
  */
  const toggleDarkMode = (): void => setDarkMode(!darkMode);
  return (
    <Box className={classes.container}>
      <DarkModeContext.Provider value={darkMode}>
        <Helmet titleTemplate="%s | Lark" defaultTitle="Lark"></Helmet>
        <BrowserRouter>
          <Navbar />
          <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/search">
              <Search />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/posts/new">
              <NewPost />
            </Route>
            <Route path="/:username/:titleSlug/edit/">
              <EditPost />
            </Route>
            <Route path="/:username/:titleSlug/">
              <ViewPost />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/bookmarks">
              <Bookmarks />
            </Route>

            <Route path="/:username">
              <ViewUser />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </BrowserRouter>
      </DarkModeContext.Provider>
      <Fab className={classes.darkModeButton} onClick={toggleDarkMode}>
        {darkMode ? <MoonIcon /> : <SunIcon />}
      </Fab>
    </Box>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
