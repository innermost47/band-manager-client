import React, { useState } from "react";

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-primary bg-opacity-10 p-3 rounded position-relative">
      <code className="text-primary" style={{ whiteSpace: "pre-wrap" }}>
        {code}
      </code>
      <button
        className="btn btn-sm position-absolute top-0 end-0 m-2"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy to clipboard"}
      >
        <i
          className={`bi ${copied ? "bi-clipboard-check" : "bi-clipboard"}`}
        ></i>
      </button>
    </div>
  );
};

export default CodeBlock;
