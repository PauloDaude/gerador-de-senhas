import './InputText.css';

const InputText = ({
  type = 'text',
  onChange,
  placeholder,
  disabled,
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      className="input-text"
      {...props}
    />
  );
};
export default InputText;
