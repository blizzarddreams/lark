import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  Box,
  Typography,
  makeStyles,
  darken,
  Card,
  CardContent,
  Grid,
} from "@material-ui/core";
import { Bookmark } from "@material-ui/icons";
import Gravatar from "../util/Gravatar";
import { Link } from "react-router-dom";
import Moment from "../util/Moment";
import { Theme } from "@material-ui/core";
import ReadingTime from "../util/ReadingTime";

interface User {
  username: string;
  email: string;
}
interface Profile {
  user: User;
}
interface Post {
  id: number;
  data: string;
  profile: Profile;
  title: string;
  title_slug: string;
  subtitle: string;
  created_at: string;
}

interface Comment {
  id: number;
  data: string;
  created_at: string;
  profile: Profile;
  post: Post;
}
interface Bookmark {
  id: number;
  post?: Post;
  created_at: string;
  comment?: Comment;
}

const useStyles = makeStyles((theme: Theme) => ({
  link: {
    color: "#0C1B33",
    textDecoration: "none",
    "&:hover": {
      color: darken("#0C1B33", 0.1),
      textDeocrationColor: "#0C1B33",
    },
  },
  paper: {
    backgroundColor: "#dce1e3",
    padding: theme.spacing(1),
    width: "40%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    margin: theme.spacing(1),
  },
  box: {
    width: "100%",
  },
}));
const Bookmarks = (): JSX.Element => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>();
  const classes = useStyles();

  useEffect(() => {
    const token = `Bearer ${Cookies.get("token")}`;
    fetch("/bookmarks/all/", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookmarks(data.bookmarks);
        }
      });
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h4">Bookmarks</Typography>
      {bookmarks?.map((bookmark: Bookmark) => (
        <Card className={classes.paper} key={bookmark.id}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="caption">
                {/* fun line */}
                {bookmark?.post ? (
                  "Post"
                ) : (
                  <span>
                    {`Comment | `}
                    <Typography
                      variant="caption"
                      component={Link}
                      to={`/${bookmark?.comment?.post.profile.user.username}/${bookmark?.comment?.post.title_slug}/`}
                      className={classes.link}
                    >
                      {bookmark?.comment?.post.title}
                    </Typography>
                  </span>
                )}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption">
                Bookmarked on <Moment timestamp={bookmark?.created_at} />
              </Typography>
            </Box>
          </Box>
          <CardContent>
            <Grid container>
              {bookmark?.post ? (
                <>
                  <Grid item xs={3}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Gravatar
                        email={bookmark.post.profile.user.email}
                        size={8}
                      />
                      <Typography>
                        {bookmark.post.profile.user.username}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Box display="flex" flexDirection="column">
                      <Typography
                        component={Link}
                        className={classes.link}
                        variant="h6"
                        to={`/${bookmark.post.profile.user.username}/${bookmark.post.title_slug}`}
                      >
                        {bookmark.post.title}
                      </Typography>
                      <Typography variant="body1">
                        {bookmark.post.subtitle}
                      </Typography>

                      <Box display="flex" flexDirection="column">
                        <Moment timestamp={bookmark.post.created_at} />
                        <ReadingTime data={bookmark.post.data} />
                      </Box>
                    </Box>
                  </Grid>
                </>
              ) : bookmark?.comment ? (
                <>
                  <Grid item xs={3}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Gravatar
                        email={bookmark.comment.profile.user.email}
                        size={8}
                      />
                      <Typography>
                        {bookmark.comment.profile.user.username}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Box display="flex" flexDirection="column">
                      <Typography
                        component={Link}
                        className={classes.link}
                        variant="h6"
                        to={`/${bookmark.comment.post.profile.user.username}/${bookmark.comment.post.title_slug}`}
                      >
                        {bookmark.comment.post.title}
                      </Typography>
                      <Typography>{bookmark.comment.data}</Typography>
                      <Box display="flex" flexDirection="column">
                        <Moment timestamp={bookmark.comment.created_at} />
                        <ReadingTime data={bookmark.comment.data} />
                      </Box>
                    </Box>
                  </Grid>
                </>
              ) : null}
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Bookmarks;
