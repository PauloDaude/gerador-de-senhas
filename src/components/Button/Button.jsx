import './Button.css';

const Button = ({
  icon,
  variant,
  onClick,
  children,
  type,
  disabled,
  ...props
}) => {
  return (
    <button
      className={`button ${variant}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
export default Button;
