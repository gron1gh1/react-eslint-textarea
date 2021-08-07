import React, { useRef, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { OverlayTrigger,Tooltip } from "react-bootstrap";

function splitToken(text: string, start: number, error : string) {
  const spaceIdx = text.indexOf(" ", start);
  const semicolonIdx = text.indexOf(";", start);
  const newlineIdx = text.indexOf("\n", start);

  const idxArr = [spaceIdx, semicolonIdx, newlineIdx];
  const usingArr = idxArr.filter((f) => f !== -1);
  const minVal = usingArr.reduce((a, b) => (a < b ? a : b));

  const prefix = text.substring(0, start);
  const underline = React.cloneElement(
    <UnderLine />,
    {error},
    text.substring(start, minVal)
  );
  const suffix = text.substring(minVal);
  return [prefix, underline, suffix];
}

function UnderLine({ children,error }: { children?: React.ReactChildren,error?: string }) {
  const renderTootip = (error?: string) => (props : any) => (
    <Tooltip id="button-tooltip" {...props}>
      {error}
    </Tooltip>
  )
  
  return (
    <OverlayTrigger placement="bottom" delay={{show:250,hide:400}} overlay={renderTootip(error)}>
      <u>{children}</u>
    </OverlayTrigger>
  );
}

type EslintType = Array<string | React.ReactElement>;

function App() {
  const [eslint, setEslint] = useState<EslintType>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const filterErr = error
      .split("\n")
      .filter((f) => f.indexOf("error") !== -1);

    const positionErr = filterErr.map((err) => {
      return {
        error: err,
        pos: err.split("  ")[1]
      };
    });
    positionErr.pop();

    console.log("positionErr", positionErr);

    let newlineSplit = text.split("\n").map((v) => v + "\n");

    let paragraph: EslintType = [];

    let errPos = positionErr.map((position) => {
      const [_line, _left] = position.pos.split(":");
      let line = Number(_line) - 1;
      let left = Number(_left) - 1;
      return {
        error: position.error,
        line,
        left,
      };
    });

    paragraph = newlineSplit
      .map((text, idx) => {
        const findPos = errPos.find((f) => f.line === idx);
        if (findPos) {
          return splitToken(text, findPos.left, findPos.error);
        }
        return text;
      })
      .flat();

    setEslint(paragraph);
  }, [error, text]);

  useEffect(() => {
    axios.post("http://localhost:5000/code", { code: text }).then((res) => {
      setError(res.data.status);
    });
  }, [text]);

  return (
    <div className="App" style={{ display: "flex" }}>
      <textarea
        style={{ width: "300px", height: "500px" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div
        style={{ width: "300px", height: "500px", border: "1px solid black" }}
      >
        {React.cloneElement(<pre></pre>, {}, eslint)}
      </div>

      <textarea
        style={{ width: "300px", height: "500px" }}
        readOnly={true}
        value={error}
      />
    </div>
  );
}

export default App;
