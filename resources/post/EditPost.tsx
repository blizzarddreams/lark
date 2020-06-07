import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import {
  Button,
  makeStyles,
  Theme,
  fade,
  TextField,
  Box,
} from "@material-ui/core";
import Cookies from "js-cookie";
import { useParams, useHistory } from "react-router-dom";

interface Post {
  data: string;
  title: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    height: "100%",
    width: "100%",
  },
  box: {
    height: "100%",
  },
  input: {
    width: "80%",
    marginBottom: theme.spacing(1),
    "& .MuiFormLabel-root": {
      color: "#222",
    },
    "& .MuiOutlinedInput-root": {
      color: "#222",
      backgroundColor: fade("#66d0f9", 0.1),
      borderRadius: theme.shape.borderRadius,

      "&.Mui-focused fieldset": {
        borderColor: "#23f0c7",
      },
    },
    "&:focus": {
      borderColor: "#eee",
    },
  },
}));
const EditPost = (): JSX.Element => {
  const history = useHistory();
  const { username, titleSlug } = useParams();
  const classes = useStyles();
  const [data, setData] = useState("");
  const [post, setPost] = useState({
    title: "",
    subtitle: "",
  });

  const csrf = Cookies.get("csrftoken")!;
  const token = `Bearer ${Cookies.get("token")}`;

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      ["code-block", "blockquote"],
    ],
  };

  useEffect(() => {
    fetch(`/posts/${username}/${titleSlug}/edit/`, {
      headers: {
        "X-CSRFToken": csrf,
        Authorization: token,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost({ title: data.post.title, subtitle: data.post.subtitle });
          setData(data.post.data);
        }
      });
  }, [csrf, titleSlug, token, username]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetch("/posts/new/", {
      method: "POST",
      body: JSON.stringify({
        title: post.title,
        subtitle: post.subtitle,
        data,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          history.push("/dashboard");
        }
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.getAttribute("name")!;
    setPost({ ...post, [name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        className={classes.box}
        alignItems="center"
      >
        <TextField
          name="title"
          id="outlined-basic"
          label="Title"
          onChange={handleChange}
          value={post.title}
          placeholder={"Lark"}
          fullWidth
          variant="standard"
          classes={{
            root: classes.input,
          }}
        />
        <TextField
          name="subtitle"
          id="outlined-basic"
          label="Subtitle"
          onChange={handleChange}
          value={post.subtitle}
          placeholder={"Lark"}
          fullWidth
          variant="standard"
          classes={{
            root: classes.input,
          }}
        />
        <ReactQuill
          theme="bubble"
          value={data}
          onChange={setData}
          placeholder={"Once upon a time...."}
          modules={modules}
        />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default EditPost;
