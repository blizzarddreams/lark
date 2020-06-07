import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  makeStyles,
  Theme,
} from "@material-ui/core";
import Gravatar from "../util/Gravatar";

interface ViewFavoritesProps {
  open: boolean;
  handleClose: () => void;
  //type: "post" | "comment";
  //id: number;
  users: User[];
}

interface User {
  username: string;
  email: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    padding: theme.spacing(1),
  },
}));
const ViewFavorites = ({
  open,
  handleClose,
  users,
}: ViewFavoritesProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Favorites</DialogTitle>
      <DialogContent>
        {users?.map((user) => (
          <Box
            display="flex"
            flexDirection="row"
            key={user.username}
            alignItems="center"
            className={classes.box}
          >
            <Gravatar email={user.email} size={5} />
            <Typography>{user.username}</Typography>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ViewFavorites;
