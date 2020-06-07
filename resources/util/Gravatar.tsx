import React from "react";
import { createHash } from "crypto";
import { Avatar } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

interface GravatarProps {
  email: string;
  size: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  avatar: (props: GravatarProps) => ({
    height: theme.spacing(props.size),
    width: theme.spacing(props.size),
  }),
}));

const Gravatar = ({ email, size }: GravatarProps): JSX.Element => {
  const classes = useStyles({ email, size });
  const hash = createHash("md5").update(email).digest("hex");

  return (
    <Avatar
      src={`https://www.gravatar.com/avatar/${hash}?s=200`}
      className={classes.avatar}
    />
  );
};

export default Gravatar;
