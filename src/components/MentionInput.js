import { useState, useRef } from "react";

const MentionInput = ({ value, onChange, project, placeholder }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const inputRef = useRef(null);

  const handleKeyUp = (e) => {
    const position = e.target.selectionStart;
    const textBeforeCursor = value.slice(0, position);
    const matches = textBeforeCursor.match(/@(\w*)$/);

    if (matches) {
      const searchTerm = matches[1].toLowerCase();
      setFilteredMembers(
        project.members.filter((member) =>
          member.username.toLowerCase().includes(searchTerm)
        )
      );
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    setCursorPosition(position);
  };

  const handleMention = (username) => {
    const beforeMention = value.slice(0, cursorPosition).replace(/@\w*$/, "");
    const afterMention = value.slice(cursorPosition);
    onChange(beforeMention + `@${username} ` + afterMention);
    setShowSuggestions(false);
  };

  return (
    <div className="position-relative">
      <textarea
        ref={inputRef}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={handleKeyUp}
        rows={1}
        style={{
          minHeight: "38px",
          maxHeight: "100px",
          resize: "none",
          height: "auto",
        }}
        onInput={(e) => {
          e.target.style.height = "38px";
          e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
        }}
      />
      {showSuggestions && (
        <div className="position-absolute bottom-100 start-0 w-100 bg-body border rounded shadow-sm mb-4">
          {filteredMembers.map((member) => (
            <button
              key={member.id}
              className="btn btn-link text-start w-100 py-1 px-2"
              onClick={() => handleMention(member.username)}
            >
              {member.username}
            </button>
          ))}
        </div>
      )}
      <button
        type="submit"
        className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
      >
        <i className="bi bi-send"></i>
      </button>
    </div>
  );
};

export default MentionInput;
