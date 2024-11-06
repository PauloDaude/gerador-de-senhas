import './Switch.css';

const Switch = ({ isOn, onToggle, ...props }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={isOn} onChange={onToggle} {...props} />
      <span className="switch-slider" />
    </label>
  );
};

export default Switch;
