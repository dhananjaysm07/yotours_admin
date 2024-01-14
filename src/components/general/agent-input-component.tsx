import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type AgentComponentProps = {
  setAgent: React.Dispatch<React.SetStateAction<string>>;
  agent: string;
};

const AgentComponent = ({ setAgent, agent }: AgentComponentProps) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "background",
    "align",
    "size",
    "font",
  ];

  const handleProcedureContentChange = (
    content: string,
    _: any,
    source: string,
    editor: any
  ) => {
    setAgent(content);
  };
  return (
    <div className="mb-4.5 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b bg-gray-3 dark:bg-graydark border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
        <h3 className="font-semibold text-black dark:text-white">
          Agent Reseller Page
        </h3>
      </div>
      <div>
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={agent || ""}
          onChange={handleProcedureContentChange}
        />
      </div>
    </div>
  );
};

export default AgentComponent;
