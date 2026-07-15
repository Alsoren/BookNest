import "../Styles/CheckBox.css";

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="checkbox-wrapper">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />

      <span className="custom-checkbox"></span>

      <span className="checkbox-label">{label}</span>
    </label>
  );
}

export default Checkbox;