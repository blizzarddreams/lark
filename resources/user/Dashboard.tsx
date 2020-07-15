import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import {
  Box,
  Typography,
  makeStyles,
  Theme,
  darken,
  Grid,
} from "@material-ui/core";
import Gravatar from "../util/Gravatar";
import { Link } from "react-router-dom";
import Moment from "../util/Moment";
import ReadingTime from "../util/ReadingTime";
import Truncate from "../util/Truncate";
import DarkModeContext from "../DarkMode";
interface User {
  username: string;
  email: string;
}
interface Post {
  id: number;
  title: string;
  subtitle: string;
  title_slug: string;
  data: string;
  created_at: string;
  profile: Pick<Profile, "user">;
}
interface Profile {
  user: User;
  posts: Post[];
  follower_posts: Post[];
}

interface StyleProps {
  darkMode: boolean;
}
const useStyles = makeStyles((theme: Theme) => ({
  card: {
    width: "100%",
    margin: theme.spacing(1),
  },
  subtitle: (props: StyleProps) => ({
    color: props.darkMode ? "#e0dfe7ed" : "#050427bf",
  }),
  post: {
    padding: theme.spacing(1),
    borderColor: "#050427bf",
    width: "100%",
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
  displayBox: {
    display: "flex",
    alignItems: "center",
    //justifyContent: "center",
    flexDirection: "column",
  },
}));

const Dashbord = (): JSX.Element => {
  const darkMode = useContext(DarkModeContext);
  const [profile, setProfile] = useState<Profile>(null!);
  const csrf = Cookies.get("csrftoken")!;
  const token = `Bearer ${Cookies.get("token")}`;
  const classes = useStyles({ darkMode });

  useEffect(() => {
    fetch("/dashboard/", {
      //method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrf,
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.data);
          Cookies.set("email", data.data.user.email);
        }
      });
  }, [csrf, token]);
  return (
    <>
      {profile && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Gravatar email={profile.user.email} size={10} />
          <Typography variant="h4">{profile.user.username}</Typography>
          <Grid container>
            <Grid item xs={6} className={classes.displayBox}>
              <Typography variant="h5">Your Latest Posts</Typography>
              {profile.posts.map((post) => (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  className={classes.post}
                  key={post.id}
                >
                  <Typography
                    key={post.id}
                    variant="h6"
                    className={classes.link}
                    component={Link}
                    to={`/${profile.user.username}/${post.title_slug}/`}
                  >
                    <Truncate data={post.title} at={40} />
                  </Typography>
                  <Typography className={classes.subtitle}>
                    {post.subtitle}
                  </Typography>
                  <Box
                    display="flex"
                    flexDirection="row"
                    className={classes.subtitle}
                  >
                    <Moment timestamp={post.created_at} /> |
                    <ReadingTime data={post.data} />
                  </Box>
                </Box>
              ))}
            </Grid>
            <Grid item xs={6} className={classes.displayBox}>
              <Typography variant="h5">
                Latest Posts From Users You're Following
              </Typography>
              {profile.follower_posts.map((post) => (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  className={classes.post}
                  key={post.id}
                >
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
              ))}
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Dashbord;
