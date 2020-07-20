import React, { useState, useEffect, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  makeStyles,
  fade,
  Box,
  TextField,
  Typography,
  Theme,
  darken,
} from "@material-ui/core";
import Truncate from "./util/Truncate";
import Moment from "./util/Moment";
import ReadingTime from "./util/ReadingTime";
import DarkModeContext from "./DarkMode";

interface User {
  username: string;
  email: string;
}
interface Profile {
  user: User;
}
interface Comment {
  id: number;
  created_at: string;
  data: string;
  profile: Profile;
  favorite_count: number;
}

interface Post {
  id: number;
  title: string;
  subtitle: string;
  comments: Comment[];
  data: string;
  created_at: string;
  profile: Profile;
  favorite_count: number;
  title_slug: string;
}

interface User {
  email: string;
  username: string;
}

interface StyleProps {
  darkMode: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  subtitle: (props: StyleProps) => ({
    color: props.darkMode ? "#e0dfe7ed" : "#050427bf",
  }),
  post: {
    padding: theme.spacing(1),
    borderColor: "#050427bf",
    //width: "100%",
    border: "none",
    borderTop: "1px",
  },
  link: (props: StyleProps) => ({
    color: props.darkMode ? "#DCE2EC" : "#0C1B33",
    textDecoration: "none",
    "&:hover": {
      color: darken(props.darkMode ? "#DCE2EC" : "#0C1B33", 0.1),
      textDeocrationColor: props.darkMode ? "#DCE2EC" : "#0C1B33",
    },
  }),
  input: {
    color: "#222",
    borderColor: "#222 !important",

    "& .MuiFormLabel-root": {
      color: "#79838a",
    },

    "& .MuiOutlinedInput-root": {
      marginBottom: "4rem",
      color: "#222",
      borderColor: "#222 !important",
      backgroundColor: fade("#66d0f9", 0.1),

      "&.Mui-focused fieldset": {
        borderColor: "#09a6f4",
        color: "#eee",
      },
    },
  },
}));
const Search = (): JSX.Element => {
  const darkMode = useContext(DarkModeContext);
  const classes = useStyles({ darkMode });
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(document.location.search.substring(1)).get("qs"),
  );

  const getPosts = (): void => {
    fetch(`/posts/search/${searchParams}/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.posts);
        }
      });
  };

  useEffect(() => {
    getPosts();
  }, [searchParams]);

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    history.push(`/search?qs=${search}`);
    setSearchParams(search);
    getPosts();
  };
  return (
    <>
      {posts && (
        <Box display="flex" flexDirection="column" justifyContent="center">
          <form onSubmit={handleSearch}>
            <TextField
              name="qs"
              id="outlined-basic"
              label="Search"
              fullWidth
              value={search}
              onChange={handleSearchValue}
              variant="outlined"
              classes={{
                root: classes.input,
              }}
            />
          </form>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            {posts.length > 0 ? (
              posts.map((post) => (
                <Box className={classes.post} key={post.id}>
                  <Typography
                    key={post.id}
                    variant="h6"
                    className={classes.link}
                    component={Link}
                    to={`/${post.profile.user.username}/${post.title_slug}/`}
                  >
                    <Truncate data={post.title} at={40} />
                  </Typography>
                  <Typography className={classes.subtitle}>
                    {post.subtitle}
                  </Typography>
                  <Typography className={classes.subtitle}>
                    By {post.profile.user.username}
                  </Typography>
                  <Box
                    display="flex"
                    flexDirection="row"
                    className={classes.subtitle}
                    alignItems="center"
                  >
                    <Moment timestamp={post.created_at} /> |
                    <ReadingTime data={post.data} />
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>
                No posts found with the query {`"${searchParams}"`}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Search;
