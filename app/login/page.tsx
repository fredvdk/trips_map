'use client'

import React from 'react';
import { supabase } from '../lib/supabaseClient';
import {Box, Button, Paper, Tab, Tabs, TextField, Typography} from '@mui/material';
import { useRouter } from 'next/navigation';


const handleSignup = async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signUp({ email, password });  
    if (error) {
        throw new Error('Error signing up: ' + error.message);
    } else {
        console.log('Signed up user:', data.user);
        
    }
};
              
const handleLogin = async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        throw new Error('Error logging in:' + error.message);
    } else {
        console.log('Logged in user:', data.user);
    }
};

const Login = () => {
  
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<'login' | 'signup'>('login');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const router = useRouter()

    const handleChange = (event: React.SyntheticEvent, newValue: 'login' | 'signup') => {
        setTab(newValue);
        setErrorMsg(null);
    }
    const handleAuth = async (event: React.FormEvent) => {
        event.preventDefault();
        await submitForm(tab);
    }

  async function submitForm(mode: 'signup' | 'login'): Promise<void> {
        setErrorMsg(null);

        if (!email || !password) {
            console.error('Email and password are required');
            return;
        }
        if (mode === 'signup') {
            try {
                await handleSignup(email, password);
                router.push('/');
            } catch (err) {
                console.error('Signup failed:', err);
                setErrorMsg('Signup failed. Please try again.' + (err instanceof Error ? ` ${err.message}` : ''));
            }
            return;
        }
        try {
            await handleLogin(email, password);
            router.push('/');
        } catch (err) {
            console.error('Login failed:', err);
            setErrorMsg('Login failed. Please check your credentials.');
        }
    }
  return (

      <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3 }}>
          <Tabs
              value={tab}
              onChange={handleChange}
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
          >
              <Tab label="Log In" value="login" />
              <Tab label="Sign Up" value="signup" />
          </Tabs>

          <Box component="form" onSubmit={handleAuth} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField name="email" label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
              <TextField name="password" label="Password" type="password" value={password} required onChange={(e) => setPassword(e.target.value)} />

              <Button variant="contained" type="submit">
                  {tab === 'login' ? 'Log In' : 'Sign Up'}
              </Button>

              {errorMsg && (
                  <Typography color="error" variant="body2" align="center">
                      {errorMsg}
                  </Typography>
              )}
          </Box>
      </Paper>
  )
}


export default Login