import { Copy, RefreshCcw, Save } from 'lucide-react';
import Button from './components/Button/Button';
import InputText from './components/InputText/InputText';
import Card from './components/Card/Card';
import Switch from './components/Switch/Switch';
import { useEffect, useState } from 'react';
import Slider from './components/Slider/Slider';
import PasswordCard from './components/PasswordCard/PasswordCard';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const generatePassword = (
  isUppercaseOn,
  isLowercaseOn,
  isNumbersOn,
  isSymbolsOn,
  passwordLength
) => {
  const uppercases = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercases = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+{}[]|:;<>,.?/~';

  let charset = '';
  if (isUppercaseOn) charset += uppercases;
  if (isLowercaseOn) charset += lowercases;
  if (isNumbersOn) charset += numbers;
  if (isSymbolsOn) charset += symbols;

  let newPassword = '';
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    newPassword += charset.charAt(randomIndex);
  }

  return newPassword;
};

const App = () => {
  const [passwordLength, setPasswordLength] = useState(6);
  const [isUppercaseOn, setIsUppercaseOn] = useState(true);
  const [isLowercaseOn, setIsLowercaseOn] = useState(true);
  const [isNumbersOn, setIsNumbersOn] = useState(true);
  const [isSymbolsOn, setIsSymbolsOn] = useState(true);
  const [passwordLabel, setPasswordLabel] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [isLoadingPasswords, setIsLoadingPasswords] = useState(false);

  const fetchAllPasswords = async () => {
    const url = 'http://localhost:3000/passwords';
    setIsLoadingPasswords(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const passwords = await response.json();
      return passwords;
    } catch (error) {
      console.error(error.message);
      return [];
    } finally {
      setIsLoadingPasswords(false);
    }
  };

  const createPassword = async password => {
    const url = 'http://localhost:3000/passwords';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(password)
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const passwords = await fetchAllPasswords();
      return passwords;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  };

  const deletePassword = async id => {
    const url = `http://localhost:3000/passwords/${id}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const passwords = await fetchAllPasswords();
      return passwords;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  };

  useEffect(() => {
    fetchAllPasswords().then(passwords => setPasswords(passwords));
  }, []);

  const handleChangeSlider = event => {
    setPasswordLength(event.target.value);
  };

  const handleChangePasswordId = event => {
    setPasswordLabel(event.target.value);
  };

  const handleDeletePassword = id => {
    deletePassword(id).then(passwords => setPasswords(passwords));
  };

  const handleClickSave = passwordData => {
    createPassword({
      id: uuidv4(),
      label: passwordData.label,
      password: passwordData.password
    }).then(passwords => setPasswords(passwords));
    setPasswordLabel('');
    setNewPassword('');
  };

  const handleClickGenerate = () => {
    setNewPassword(
      generatePassword(
        isUppercaseOn,
        isLowercaseOn,
        isNumbersOn,
        isSymbolsOn,
        passwordLength
      )
    );
  };

  const handleClickCopy = () => {
    navigator.clipboard.writeText(newPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  return (
    <main className="main">
      <section className="container">
        <Card width={450}>
          <h2>Gerador de senhas aleatórias</h2>
          <div className="slider-box">
            <p>Comprimento da senha: {passwordLength}</p>
            <Slider
              min={6}
              max={30}
              value={passwordLength}
              onChange={handleChangeSlider}
            />
          </div>
          <div className="switches-container">
            <div className="switches-row">
              <div className="switch-box">
                <Switch
                  isOn={isUppercaseOn}
                  onToggle={() => setIsUppercaseOn(!isUppercaseOn)}
                />
                <p>Maiúsculas</p>
              </div>
              <div className="switch-box">
                <Switch
                  isOn={isLowercaseOn}
                  onToggle={() => setIsLowercaseOn(!isLowercaseOn)}
                />
                <p>Minúsculas</p>
              </div>
            </div>
            <div className="switches-row">
              <div className="switch-box">
                <Switch
                  isOn={isNumbersOn}
                  onToggle={() => setIsNumbersOn(!isNumbersOn)}
                />
                <p>Números</p>
              </div>
              <div className="switch-box">
                <Switch
                  isOn={isSymbolsOn}
                  onToggle={() => setIsSymbolsOn(!isSymbolsOn)}
                />
                <p>Símbolos</p>
              </div>
            </div>
          </div>
          <div className="inputs-container">
            <InputText
              placeholder="Identificador da senha (ex: Email, Banco)"
              onChange={handleChangePasswordId}
              value={passwordLabel}
            />
            <InputText
              placeholder="A senha aparecerá aqui"
              disabled
              value={newPassword}
            />
          </div>
          <div className="buttons-container">
            <div className="buttons-actions">
              <Button
                icon={<Copy size={16} />}
                variant="secondary"
                onClick={handleClickCopy}
              >
                {isCopied ? 'Copiado!' : 'Copiar'}
              </Button>
              <Button
                icon={<RefreshCcw size={16} />}
                onClick={handleClickGenerate}
              >
                Gerar nova senha
              </Button>
            </div>
            <Button
              icon={<Save size={16} />}
              disabled={!(passwordLabel && newPassword)}
              onClick={() =>
                handleClickSave({
                  label: passwordLabel,
                  password: newPassword
                })
              }
            >
              Salvar senha
            </Button>
          </div>
        </Card>
        <Card width={450} className="saved-passwords-container">
          <h3>Senhas salvas</h3>
          <div className="passwords-container">
            {isLoadingPasswords && <p>Carregando...</p>}
            {!isLoadingPasswords && passwords.length === 0 && (
              <p>Nenhuma senha salva ainda.</p>
            )}
            {passwords.map((password, index) => (
              <PasswordCard
                key={index}
                label={password.label}
                password={password.password}
                handleDelete={() => handleDeletePassword(password.id)}
              />
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
};

export default App;
