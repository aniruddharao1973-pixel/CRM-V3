import { useState, useRef, useEffect } from "react";

const OPTIONS = [
  "Email",
  "Call",
  "Meeting",
  "Send Letter",
  "Product Demo",
];

const SubjectWithSuggestions = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState(OPTIONS);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);

    const f = OPTIONS.filter((o) =>
      o.toLowerCase().includes(val.toLowerCase())
    );

    setFiltered(f);
    setOpen(true);
  };

  const selectOption = (text) => {
    onChange(text);
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        className="input"
        placeholder="Subject"
        value={value}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
      />

      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
          {filtered.map((item) => (
            <div
              key={item}
              onClick={() => selectOption(item)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectWithSuggestions;