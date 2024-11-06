import './PasswordCard.css';
import { Copy, Trash2 } from 'lucide-react';
import Button from '../Button/Button';

const PasswordCard = ({ label, password, handleDelete }) => {
  const handleClickCopy = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <div className="card-container">
      <div className="card-infos">
        <h4>{label}</h4>
        <p>{password}</p>
      </div>
      <div className="card-buttons">
        <Button onClick={handleClickCopy} variant="secondary">
          <Copy size={18} />
        </Button>
        <Button onClick={handleDelete} variant="danger">
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
};
export default PasswordCard;
