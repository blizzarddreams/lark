import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  makeStyles,
  Theme,
  darken,
  Grid,
} from "@material-ui/core";
import Gravatar from "../util/Gravatar";
import { Link, useParams } from "react-router-dom";
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
}
interface Profile {
  user: User;
  posts: Post[];
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
    justifyContent: "center",
    flexDirection: "column",
  },
}));

const ViewUser = (): JSX.Element => {
  const darkMode = useContext(DarkModeContext);
  const { username } = useParams();
  const [profile, setProfile] = useState<Profile>();
  const classes = useStyles({ darkMode });

  useEffect(() => {
    fetch(`/profiles/${username}/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.user);
        }
      });
  }, [username]);
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
              <Typography variant="h5">
                {`${profile.user.username}'s`} Latest Posts
              </Typography>
              {profile.posts.map((post) => (
                <Box
                  display="flex"
                  flexDirection="column"
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
          </Grid>
        </Box>
      )}
    </>
  );
};

export default ViewUser;
