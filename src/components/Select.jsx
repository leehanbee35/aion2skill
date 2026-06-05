import { useState, useRef, useEffect } from "react";
import "./Select.css";

export default function Select({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className={`cselect ${open ? "cselect--open" : ""}`} ref={ref}>
      <button
        className="cselect__trigger"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span>{value}</span>
        <svg className="cselect__arrow" width="10" height="6" viewBox="0 0 10 6">
          <path d="M1 1l4 4 4-4" stroke="#aab0c8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="cselect__dropdown">
          {options.map((opt) => (
            <li
              key={opt}
              className={`cselect__option ${opt === value ? "cselect__option--selected" : ""}`}
              onMouseDown={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
