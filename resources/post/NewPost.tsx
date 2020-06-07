import React, { useState } from "react";
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
//import "react-quill/dist/quill.snow.css";

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
const NewPost = (): JSX.Element => {
  const classes = useStyles();
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const csrf = Cookies.get("csrftoken")!;
  const token = `Bearer ${Cookies.get("token")}`;

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      ["code-block", "blockquote"],
    ],
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    //console.log(csrf);
    console.log(token);
    fetch("/posts/new/", {
      method: "POST",
      body: JSON.stringify({
        title,
        data,
        subtitle,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleSubtitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSubtitle(e.target.value);
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
          onChange={handleTitleChange}
          value={title}
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
          onChange={handleSubtitleChange}
          value={subtitle}
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

export default NewPost;
