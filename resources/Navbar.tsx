import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IconButton,
  AppBar,
  Toolbar,
  makeStyles,
  Box,
  Theme,
  InputBase,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFeatherAlt,
  faSignOutAlt,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import Gravatar from "./util/Gravatar";
import {
  Bookmarks as BookmarkedIcon,
  Search as SearchIcon,
} from "@material-ui/icons";
import DarkModeContext from "./DarkMode";

interface StyleProps {
  darkMode: boolean;
}
const useStyles = makeStyles((theme: Theme) => ({
  navBar: (props: StyleProps) => ({
    backgroundColor: props.darkMode ? "#222" : "#eee",
    boxShadow: "none",
    marginBottom: theme.spacing(4),
  }),
  icon: (props: StyleProps) => ({
    color: props.darkMode ? "#eee" : "#222",
  }),
  toolBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: (props: StyleProps) => ({
    color: "transparent", //props.darkMode ? "#080b17" : "#dff0f7",
    padding: theme.spacing(1, 1, 1, 4),
    transition: theme.transitions.create("width"),
    width: theme.spacing(0),
    "&:focus": {
      color: props.darkMode ? "#080b17" : "#dff0f7",
      width: theme.spacing(20),
    },
  }),
  search: (props: StyleProps) => ({
    backgroundColor: props.darkMode ? "#eee" : "#222",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    /*"&:hover": {
      backgroundColor: lighten(props.darkMode ? "#eee" : "#222", 0.2),
    }, */
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }),
  searchIcon: (props: StyleProps) => ({
    padding: theme.spacing(0, 1),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: props.darkMode ? "#222" : "#fff",
  }),
}));

const Navbar = (): JSX.Element => {
  const darkMode = useContext(DarkModeContext);
  const classes = useStyles({ darkMode });
  const history = useHistory();
  const [email, setEmail] = useState<string | undefined>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setEmail(Cookies.get("email"));
  }, []);

  const handleLogout = (): void => {
    Cookies.remove("token");
    Cookies.remove("email");
    setEmail("");
    history.push("/");
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    history.push(`/search?qs=${search}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };
  return (
    <AppBar position="fixed" className={classes.navBar}>
      <Toolbar className={classes.toolBar}>
        <Box display="flex" alignItems="center">
          <Box className={classes.search}>
            <Box className={classes.searchIcon}>
              <SearchIcon />
            </Box>
            <form onSubmit={handleSearchSubmit}>
              <InputBase
                placeholder="Search...."
                classes={{
                  input: classes.input,
                }}
                name="qs"
                onChange={handleSearchChange}
                inputProps={{ "aria-label": "search" }}
              />
            </form>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          {email ? (
            <>
              <Link to="/dashboard">
                <Gravatar email={email} size={4} />
              </Link>
              <Link to="/posts/new">
                <IconButton className={classes.icon}>
                  <FontAwesomeIcon icon={faFeatherAlt} />
                </IconButton>
              </Link>
              <Link to="/bookmarks">
                <IconButton className={classes.icon}>
                  <BookmarkedIcon />
                </IconButton>
              </Link>
              <IconButton className={classes.icon} onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </IconButton>
            </>
          ) : (
            <>
              <Link to="/login">
                <IconButton className={classes.icon}>
                  <FontAwesomeIcon icon={faSignInAlt} />
                </IconButton>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
