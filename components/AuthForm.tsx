import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Check, X } from './icons';
import { useTranslation } from '../hooks/useTranslation';

type AuthMode = 'login' | 'signup' | 'reset';

const PasswordValidator: React.FC<{password: string}> = ({ password }) => {
  const { t } = useTranslation();
  const validations = useMemo(() => ([
    { rule: /.{8,}/, text: t('password.validation.length') },
    { rule: /[A-Z]/, text: t('password.validation.uppercase') },
    { rule: /[a-z]/, text: t('password.validation.lowercase') },
    { rule: /[0-9]/, text: t('password.validation.number') },
    { rule: /[^A-Za-z0-9]/, text: t('password.validation.special') },
  ]), [t]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
      {validations.map(({ rule, text }) => {
        const isValid = rule.test(password);
        return (
          <div key={text} className={`flex items-center ${isValid ? 'text-green-500' : 'text-muted-foreground'}`}>
            {isValid ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
            {text}
          </div>
        );
      })}
    </div>
  );
};

const AuthForm: React.FC = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, sendPasswordReset } = useAuth();
  const { addToast } = useToast();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        addToast(t('toast.login.success'), 'success');
      } else if (mode === 'signup') {
        await signup(email, password);
        addToast(t('toast.signup.success'), 'success');
      } else if (mode === 'reset') {
        await sendPasswordReset(email);
        addToast(t('toast.reset.success'), 'success');
        setMode('login');
      }
    } catch (error) {
      addToast(t('toast.error.auth'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const titles = {
    login: { title: t('login.title'), description: t('login.description') },
    signup: { title: t('signup.title'), description: t('signup.description') },
    reset: { title: t('reset.password.title'), description: t('reset.password.description') },
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">{titles[mode].title}</h1>
        <p className="mt-2 text-muted-foreground">{titles[mode].description}</p>
      </div>

      <form onSubmit={handleAuthAction} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground">{t('email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {mode !== 'reset' && (
          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">{t('password')}</label>
              {mode === 'login' && <button type="button" onClick={() => setMode('reset')} className="text-sm text-primary hover:underline">{t('forgot.password')}</button>}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {mode === 'signup' && <PasswordValidator password={password} />}
          </div>
        )}

        <button type="submit" disabled={isLoading} className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 flex justify-center items-center">
          {isLoading ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 
            (mode === 'login' ? t('login.button') : mode === 'signup' ? t('signup.button') : t('send.reset.link'))
          }
        </button>
      </form>
      
      <div className="text-center text-sm">
        {mode === 'login' && <p>{t('no.account')} <button onClick={() => setMode('signup')} className="font-semibold text-primary hover:underline">{t('signup.button')}</button></p>}
        {mode === 'signup' && <p>{t('has.account')} <button onClick={() => setMode('login')} className="font-semibold text-primary hover:underline">{t('login.button')}</button></p>}
        {mode === 'reset' && <p><button onClick={() => setMode('login')} className="font-semibold text-primary hover:underline">{t('back.to.login')}</button></p>}
      </div>
    </div>
  );
};

export default AuthForm;
