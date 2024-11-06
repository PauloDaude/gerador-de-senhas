import './Card.css';

const Card = ({ width, children, className }) => {
  return (
    <div className={`card ${className}`} style={{ width }}>
      {children}
    </div>
  );
};
export default Card;
