import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, fade, Box, TextField } from "@material-ui/core";

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
}

interface User {
  email: string;
  username: string;
}

const useStyles = makeStyles(() => ({
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
  const classes = useStyles();
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
    <Box display="flex" flexDirection="row" justifyContent="center">
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
      {posts?.map((post) => (
        <p key={post.id}>{post.title}</p>
      ))}
    </Box>
  );
};

export default Search;
