import { Copy, RefreshCcw, Save } from 'lucide-react';
import Button from './components/Button/Button';
import InputText from './components/InputText/InputText';
import Card from './components/Card/Card';
import Switch from './components/Switch/Switch';
import { useState } from 'react';
import Slider from './components/Slider/Slider';
import PasswordCard from './components/PasswordCard/PasswordCard';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import {
  deletePassword,
  fetchAllPasswords,
  createPassword
} from './services/passwords.service';
import { generatePassword } from './utils/passwords.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const App = () => {
  const queryClient = useQueryClient();

  const [passwordLength, setPasswordLength] = useState(6);
  const [isUppercaseOn, setIsUppercaseOn] = useState(true);
  const [isLowercaseOn, setIsLowercaseOn] = useState(true);
  const [isNumbersOn, setIsNumbersOn] = useState(true);
  const [isSymbolsOn, setIsSymbolsOn] = useState(true);
  const [passwordLabel, setPasswordLabel] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const { data: allPasswordsData, isLoading: allPasswordsIsLoading } = useQuery(
    {
      queryKey: ['passwords'],
      queryFn: fetchAllPasswords
    }
  );

  const createPasswordMutation = useMutation({
    mutationFn: passwordData => createPassword(passwordData),
    onSuccess: () => {
      console.log('Senha adicionada com sucesso!');
      queryClient.invalidateQueries('passwords');
    },
    onError: error => {
      console.log('Ocorreu um erro ao adicionar a senha:', error);
    }
  });

  const deletePasswordMutation = useMutation({
    mutationFn: id => deletePassword(id),
    onSuccess: () => {
      console.log('Senha removida com sucesso!');
      queryClient.invalidateQueries('passwords');
    },
    onError: error => {
      console.log('Ocorreu um erro ao remover a senha:', error);
    }
  });

  const handleChangeSlider = event => setPasswordLength(event.target.value);

  const handleChangePasswordLabel = event =>
    setPasswordLabel(event.target.value);

  const handleDeletePassword = async id => {
    deletePasswordMutation.mutate(id);
  };

  const handleClickSave = async passwordData => {
    createPasswordMutation.mutate({
      id: uuidv4(),
      label: passwordData.label,
      password: passwordData.password
    });
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
        <Card width={'100%'}>
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
          <Button icon={<RefreshCcw size={16} />} onClick={handleClickGenerate}>
            Gerar nova senha
          </Button>
          <div className="inputs-container">
            <InputText
              placeholder="Identificador da senha (ex: Email, Banco)"
              onChange={handleChangePasswordLabel}
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
          </div>
        </Card>
        <Card width={'100%'} className="saved-passwords-container">
          <h3>Senhas salvas</h3>
          <div className="passwords-container">
            {allPasswordsIsLoading ? (
              <p>Carregando...</p>
            ) : allPasswordsData.length === 0 ? (
              <p>Nenhuma senha salva ainda.</p>
            ) : (
              allPasswordsData.map(password => (
                <PasswordCard
                  key={password.id}
                  label={password.label}
                  password={password.password}
                  handleDelete={() => handleDeletePassword(password.id)}
                />
              ))
            )}
          </div>
        </Card>
      </section>
    </main>
  );
};

export default App;
