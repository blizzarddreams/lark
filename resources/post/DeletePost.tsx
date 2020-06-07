import React from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@material-ui/core";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

interface DeletePostProps {
  open: boolean;
  handleClose: () => void;
  id: number;
}
const DeletePost = ({
  open,
  handleClose,
  id,
}: DeletePostProps): JSX.Element => {
  const history = useHistory();
  const csrf = Cookies.get("csrftoken")!;
  const token = `Bearer ${Cookies.get("token")}`;

  const handleDelete = (): void => {
    fetch(`/posts/delete/${id}/`, {
      method: "DELETE",
      headers: {
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
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete</DialogTitle>
      <DialogContent>
        <Button onClick={handleDelete}>Delete</Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePost;
