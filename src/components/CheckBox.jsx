import "../Styles/CheckBox.css";

function Checkbox({
  label,
  checked,
  onChange,
  type = "checkbox",
  name,
  value,
  disabled = false,
}) {
  return (
    <label
      className={`checkbox-wrapper ${
        checked ? "checked" : ""
      } ${disabled ? "disabled" : ""}`}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />

      <span className="custom-checkbox">
        {checked ? "✓" : ""}
      </span>

      <span className="checkbox-label">
        {label}
      </span>
    </label>
  );
}

export default Checkbox;