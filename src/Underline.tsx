import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function UnderLine({
  children,
  error,
}: {
  children?: React.ReactChildren;
  error?: string;
}) {
  const renderTootip = (error?: string) => (props: any) =>
    (
      <Tooltip id="button-tooltip" {...props}>
        {error}
      </Tooltip>
    );

  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTootip(error)}
    >
      <u style={{ textDecoration: "#f00 dotted underline" }}>{children}</u>
    </OverlayTrigger>
  );
}

export default UnderLine;
