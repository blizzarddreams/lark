import React from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@material-ui/core";
import Cookies from "js-cookie";
interface User {
  username: string;
  email: string;
  id: number;
}

interface Comment {
  id: number;
  created_at: string;
  data: string;
  favorite_count: number;
  profile: Profile;
}

interface Profile {
  user: User;
  id: number;
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
interface DeleteCommentProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  post: Post;
  setPost: React.Dispatch<React.SetStateAction<Post>>;
}
const DeleteComment = ({
  open,
  handleClose,
  id,
  post,
  setPost,
}: DeleteCommentProps): JSX.Element => {
  const csrf = Cookies.get("csrftoken")!;
  const token = `Bearer ${Cookies.get("token")}`;

  const handleDelete = (): void => {
    fetch(`/comments/delete/${id}/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": csrf,
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const newComments = post.comments.filter(
            (comment) => comment.id !== id,
          );
          setPost({ ...post, comments: newComments });
        }
      });
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete</DialogTitle>
      <DialogContent>
        <Button onClick={handleDelete}>Delete</Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteComment;
