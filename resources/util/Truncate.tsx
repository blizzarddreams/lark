import React from "react";

interface TruncateProps {
  data: string;
  at: number;
}
const Truncate = ({ data, at }: TruncateProps): JSX.Element => {
  const str = data.length <= at ? data : `${data.substring(0, at)}....`;

  return <span>{str}</span>;
};

export default Truncate;
