import React from "react";

import readingTime from "reading-time";
import { Typography } from "@material-ui/core";

interface ReadingTimeProps {
  data: string;
}

const ReadingTime = ({ data }: ReadingTimeProps): JSX.Element => {
  const time = readingTime(data).text;
  return (
    <Typography variant="body1" display="inline">
      {time}
    </Typography>
  );
};

export default ReadingTime;
