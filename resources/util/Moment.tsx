import React from "react";
import moment from "moment";
import { Tooltip } from "@material-ui/core";

interface MomentProps {
  timestamp: string;
  relative?: boolean;
}

const Moment = ({ timestamp, relative = false }: MomentProps): JSX.Element => {
  let time: string = moment(timestamp).local().format("MMMM DD YYYY");
  if (relative) {
    time = moment(timestamp).local().fromNow();
  }
  return (
    <Tooltip title={timestamp} arrow interactive>
      <span>{time}</span>
    </Tooltip>
  );
};

export default Moment;
