import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Box,
  makeStyles,
  Theme,
  Grid,
  TextField,
  Button,
  darken,
  Card,
  CardContent,
  IconButton,
} from "@material-ui/core";
import Gravatar from "../util/Gravatar";
import Moment from "../util/Moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import Cookies from "js-cookie";
import {
  ArrowDownward as ArrowDownIcon,
  ArrowUpward as ArrowUpIcon,
  BookmarksOutlined as NotBookmarkedIcon,
  Bookmarks as BookmarkedIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@material-ui/icons";
import ReadingTime from "../util/ReadingTime";
import DeletePost from "./DeletePost";
import DeleteComment from "./DeleteComment";
import ViewFavorites from "./ViewFavorites";
import { Helmet } from "react-helmet";
interface User {
  username: string;
  email: string;
  id: number;
}
interface Profile {
  user: User;
  id: number;
}

interface Favorite {
  post_id: number | undefined | null;
  comment_id: number | undefined | null;
}

interface FetchFavorite {
  profile: {
    user: User;
  };
}

interface Bookmark {
  post_id: number | undefined | null;
  comment_id: number | undefined | null;
}

interface Bookmarks {
  post: number | undefined | null;
  comments: number[];
}

interface Favorites {
  post: number | undefined | null;
  comments: number[];
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
}

interface User {
  email: string;
  username: string;
}

interface Errors {
  data: string[];
}

interface Dialog {
  id: number;
  open: boolean;
}

interface FavoriteDialog {
  open: boolean;
  users: User[];
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: "100%",
  },
  text: {
    wordBreak: "break-all",
  },
  count: {
    cursor: "pointer",
  },
  subtitle: {
    color: "#050427bf",
  },
  title: {
    wordBreak: "break-all",
  },
  content: {
    width: "80%",
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: theme.spacing(1),
    borderColor: "#449dd1",
    "& .MuiFormLabel-root": {
      color: "#222",
    },
    "& .MuiOutlinedInput-root": {
      color: "#222",

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
  button: {
    backgroundColor: "#449dd1",
    color: "#eee",
    "&:hover": {
      backgroundColor: darken("#449dd1", 0.1),
    },
  },
  comment: {
    margin: theme.spacing(1),
    width: "100%",
  },
  gridBox: {
    padding: theme.spacing(4),
  },
  iconButton: {
    color: "#18dbac", //"#028d6c",
  },
  iconButtonHeart: {
    color: "#ff6363",
  },
  iconButtonDelete: {
    color: "#E76F51",
  },
  iconButtonEdit: {
    color: "#079C6B",
  },
  iconButtonBookmark: {
    color: "#C60F7B",
  },
}));

const ViewPost = (): JSX.Element => {
  const { username, titleSlug } = useParams();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [post, setPost] = useState<Post>(null!);
  const [comment, setComment] = useState<string>("");
  const [following, setFollowing] = useState(false);
  const [errors, setErrors] = useState<Errors>({ data: [] });
  const [favorites, setFavorites] = useState<Favorites>({
    post: 0,
    comments: [],
  });
  const [bookmarks, setBookmarks] = useState<Bookmarks>({
    post: 0,
    comments: [],
  });

  const [postDeleteDialog, setPostDeleteDialog] = useState<Dialog>({
    open: false,
    id: 0,
  });
  const [commentDeleteDialog, setCommentDeleteDialog] = useState<Dialog>({
    open: false,
    id: 0,
  });
  const [favoriteDialog, setFavoriteDialog] = useState<FavoriteDialog>({
    open: false,
    users: [],
  });
  const csrf = Cookies.get("csrftoken")!;
  const token = `Bearer ${Cookies.get("token")}`;
  const classes = useStyles();

  const handleDeleteDialogOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    const type = e.currentTarget.getAttribute("data-type");
    if (type === "post") {
      setPostDeleteDialog({
        id: Number(e.currentTarget.getAttribute("data-id"))!,
        open: true,
      });
    } else {
      setCommentDeleteDialog({
        id: Number(e.currentTarget.getAttribute("data-id"))!,
        open: true,
      });
    }
  };

  const handlePostDeleteDialogClose = (): void => {
    setPostDeleteDialog({
      ...postDeleteDialog,
      open: false,
    });
  };

  const handleCommentDeleteDialogClose = (): void => {
    setCommentDeleteDialog({
      ...commentDeleteDialog,
      open: false,
    });
  };

  const handleDialogOpen = (e: React.MouseEvent<HTMLDivElement>): void => {
    const type = e.currentTarget.getAttribute("data-type") as
      | "comment"
      | "post";
    const id = Number(e.currentTarget.getAttribute("data-id"));
    fetch(`/favorites/${type}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const userList: User[] = [];
          data.favorites.forEach((favorite: FetchFavorite) => {
            userList.push(favorite.profile.user);
          });
          console.log(userList);
          setFavoriteDialog({
            users: userList,
            open: true,
          });
        }
      });
  };

  const handleDialogClose = (): void => {
    setFavoriteDialog({ ...favoriteDialog, open: false });
  };
  const setBookmarksAndFavorites = (
    data: Favorite[] | Bookmark[],
    type: "favorites" | "bookmarks",
  ): void => {
    const comments: number[] = [];
    let post: number;
    data.forEach((favOrBook: Favorite | Bookmark) => {
      if (favOrBook.post_id) {
        post = favOrBook.post_id;
      } else {
        comments.push(favOrBook.comment_id as number);
      }

      if (type === "favorites") {
        setFavorites({ post, comments });
      } else {
        setBookmarks({ post, comments });
      }
    });
  };

  useEffect(() => {
    fetch(`/posts/${username}/${titleSlug}/`, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost(data.data);
          setIsOwner(data.is_owner);
          // todo: condense
          setBookmarksAndFavorites(data.favorites, "favorites");
          setBookmarksAndFavorites(data.bookmarks, "bookmarks");

          if (Cookies.get("email") && !data.is_owner) {
            fetch(`/follows/following/${data.data.profile.user.id}/`, {
              headers: {
                Authorization: token,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                setFollowing(data.following);
              });
          }
        }
      });
  }, [username, titleSlug, token]);

  const scrollIntoCommentsView = (): void => {
    const element: HTMLElement | null = document.getElementById("commentRef");
    if (element !== null) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset + -100,
        behavior: "smooth",
      });
    }
  };

  const scrollIntoPostView = (): void => {
    const element: HTMLElement | null = document.getElementById("postRef");
    if (element !== null) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset + -100,
        behavior: "smooth",
      });
    }
  };

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setComment(e.target.value);
  };

  // easier to divide the methods than to combine them
  // and add complex logic to the method
  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const id = Number(e.currentTarget.getAttribute("data-id"));
    const type = e.currentTarget.getAttribute("data-type");
    fetch(`/favorites/favorite-${type}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
        Authorization: token,
      },
      body: JSON.stringify({ id, type }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.type === "post") {
            setFavorites({
              ...favorites,
              post: data.favorited ? id : undefined,
            });
          } else {
            setFavorites({
              ...favorites,
              comments: data.favorited
                ? favorites.comments.concat(id)
                : favorites.comments.filter((x) => x !== id),
            });
          }
        }
      });
  };
  // same method as above, but bookmarks
  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const id = Number(e.currentTarget.getAttribute("data-id"));
    const type = e.currentTarget.getAttribute("data-type");
    fetch(`/bookmarks/bookmark-${type}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
        Authorization: token,
      },
      body: JSON.stringify({ id, type }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.type === "post") {
            setBookmarks({
              ...bookmarks,
              post: data.bookmarked ? id : undefined,
            });
          } else {
            setBookmarks({
              ...bookmarks,
              comments: data.bookmarked
                ? favorites.comments.concat(id)
                : favorites.comments.filter((x) => x !== id),
            });
          }
        }
      });
  };

  const handleNewCommentSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ): void => {
    e.preventDefault();
    fetch("/comments/new/", {
      method: "POST",
      body: JSON.stringify({ data: comment, username, titleSlug }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost({ ...post, comments: [data.data, ...post.comments] });
          setComment("");
        } else {
          setErrors(data.errors);
        }
      });
  };

  const handleFollow = (e: React.MouseEvent<HTMLButtonElement>): void => {
    fetch("/follows/follow-user/", {
      method: "POST",
      body: JSON.stringify({ id: post.profile.user.id }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFollowing(data.following);
        }
      });
  };

  return (
    <>
      <ViewFavorites
        open={favoriteDialog.open}
        handleClose={handleDialogClose}
        users={favoriteDialog.users as User[]}
      />
      <DeletePost
        open={postDeleteDialog.open}
        handleClose={handlePostDeleteDialogClose}
        id={postDeleteDialog.id}
      />

      <DeleteComment
        open={commentDeleteDialog.open}
        post={post}
        setPost={setPost}
        handleClose={handleCommentDeleteDialogClose}
        id={commentDeleteDialog.id}
      />

      {post && (
        <>
          <Helmet>
            <title>{post.title}</title>
          </Helmet>
          <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            className={classes.container}
          >
            <Grid container>
              <Grid item xs={3}>
                <Box
                  display="flex"
                  justifyContent="center"
                  className={classes.gridBox}
                >
                  <Box position="fixed">
                    <Box
                      display="flex"
                      justifyContent="center"
                      className={classes.gridBox}
                      flexDirection="column"
                    >
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <IconButton
                          className={classes.iconButtonHeart}
                          onClick={handleFavorite}
                          data-type="post"
                          data-id={post.id}
                        >
                          <FontAwesomeIcon
                            icon={
                              post.id === favorites.post
                                ? faHeart
                                : faRegularHeart
                            }
                          />
                        </IconButton>
                        <Box
                          onClick={handleDialogOpen}
                          data-id={post.id}
                          data-type="post"
                        >
                          <Typography className={classes.count}>
                            {post.favorite_count}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={handleBookmark}
                          data-type="post"
                          data-id={post.id}
                          className={classes.iconButtonBookmark}
                        >
                          {post.id === bookmarks.post ? (
                            <BookmarkedIcon />
                          ) : (
                            <NotBookmarkedIcon />
                          )}
                        </IconButton>
                      </Box>
                      {isOwner ? (
                        <>
                          <Box>
                            <IconButton
                              data-id={post.id}
                              data-type="post"
                              onClick={handleDeleteDialogOpen}
                              className={classes.iconButtonDelete}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <Box>
                            <Link to={`/${username}/${titleSlug}/edit/`}>
                              <IconButton className={classes.iconButtonEdit}>
                                <EditIcon />
                              </IconButton>
                            </Link>
                          </Box>
                        </>
                      ) : null}
                    </Box>
                    <Box>
                      {!isOwner ? (
                        <Button
                          variant={following ? "contained" : "outlined"}
                          onClick={handleFollow}
                        >
                          {following ? "Following" : "Follow"}
                        </Button>
                      ) : null}
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  id="postRef"
                >
                  <Typography variant="h3" className={classes.title}>
                    {post.title}
                  </Typography>
                  <Typography variant="h6" className={classes.subtitle}>
                    {post.subtitle}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="row"
                  >
                    <Gravatar email={post.profile.user.email} size={5} />
                    <Typography variant="h6">
                      {post.profile.user.username}
                    </Typography>
                  </Box>
                  <Moment timestamp={post.created_at} />
                  <ReadingTime data={post.data} />
                  <Typography variant="body1" className={classes.text}>
                    <Box dangerouslySetInnerHTML={{ __html: post.data }}></Box>
                  </Typography>
                  <Typography variant="h4" id="commentRef">
                    Comments
                  </Typography>
                  {Cookies.get("email") && (
                    <form
                      onSubmit={handleNewCommentSubmit}
                      className={classes.form}
                    >
                      <TextField
                        label="Comment"
                        variant="outlined"
                        onChange={handleCommentChange}
                        value={comment}
                        multiline
                        fullWidth
                        error={errors.data.length > 0}
                        helperText={errors.data.join("\n")}
                        rows="4"
                        className={classes.input}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        className={classes.button}
                      >
                        Submit
                      </Button>
                    </form>
                  )}
                  {post.comments.map((comment) => (
                    <Card key={comment.id} className={classes.comment}>
                      <CardContent>
                        <Grid container>
                          <Grid item xs={1}>
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                            >
                              <Box
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                              >
                                <IconButton
                                  className={classes.iconButtonHeart}
                                  onClick={handleFavorite}
                                  data-type="comment"
                                  data-id={comment.id}
                                >
                                  <FontAwesomeIcon
                                    icon={
                                      favorites.comments.includes(comment.id)
                                        ? faHeart
                                        : faRegularHeart
                                    }
                                  />
                                </IconButton>
                                <Box
                                  onClick={handleDialogOpen}
                                  data-id={comment.id}
                                  data-type="comment"
                                >
                                  <Typography className={classes.count}>
                                    {comment.favorite_count}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box>
                                <IconButton
                                  onClick={handleBookmark}
                                  data-type="comment"
                                  data-id={comment.id}
                                  className={classes.iconButtonBookmark}
                                >
                                  {bookmarks.comments.includes(comment.id) ? (
                                    <BookmarkedIcon />
                                  ) : (
                                    <NotBookmarkedIcon />
                                  )}
                                </IconButton>
                              </Box>
                              <Box>
                                {isOwner ? (
                                  <IconButton
                                    data-id={comment.id}
                                    data-type="comment"
                                    onClick={handleDeleteDialogOpen}
                                    className={classes.iconButtonDelete}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                ) : null}
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={2}>
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                            >
                              <Gravatar
                                email={comment.profile.user.email}
                                size={8}
                              />
                              <Typography>
                                {comment.profile.user.username}
                              </Typography>
                              <Typography variant="body2">
                                <Moment
                                  timestamp={comment.created_at}
                                  relative={true}
                                />
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={9}>
                            <Typography variant="body1">
                              {comment.data}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box
                  display="flex"
                  justifyContent="center"
                  className={classes.gridBox}
                >
                  <Box position="fixed">
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <IconButton
                        onClick={scrollIntoPostView}
                        className={classes.iconButton}
                      >
                        <ArrowUpIcon fontSize={"large"} />
                      </IconButton>
                      <Typography>Scroll To Post</Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <IconButton
                        onClick={scrollIntoCommentsView}
                        className={classes.iconButton}
                      >
                        <ArrowDownIcon fontSize={"large"} />
                      </IconButton>
                      <Typography>Scroll To Comments</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

export default ViewPost;
