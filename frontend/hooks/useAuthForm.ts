'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { postJson } from '../utils/api';

type AuthMode = 'login' | 'register';

type AuthFormState = {
  email: string;
  password: string;
  name: string;
};

const initialState: AuthFormState = {
  email: '',
  password: '',
  name: ''
};

export function useAuthForm(initialMode: AuthMode = 'login') {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState<AuthFormState>(initialState);
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState('');

  const isLogin = mode === 'login';
  const endpoint = useMemo(() => `/api/auth/${isLogin ? 'login' : 'register'}`, [isLogin]);

  function updateField(field: keyof AuthFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setStatus('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Preparing arena...');

    const payload = isLogin
      ? { email: form.email, password: form.password, remember }
      : { name: form.name, email: form.email, password: form.password };

    try {
      await postJson(endpoint, payload);
      setStatus(isLogin ? 'Login request sent.' : 'Registration request sent.');
    } catch {
      setStatus('Backend not connected yet. Opening dashboard preview.');
    }

    router.push('/dashboard');
  }

  return {
    form,
    handleSubmit,
    isLogin,
    remember,
    setRemember,
    status,
    switchMode,
    updateField
  };
}
