import React from 'react';
import { supabase } from '../lib/supabaseClient';


const handleLogin = async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error('Error logging in:', error.message);
    } else {
        console.log('Logged in user:', data.user);
    }
};

const Login = () => {
  handleLogin("frederick.vdkerckhove@telenet.be", "kinkhoorn");
  return <div>Login Page</div>;
}

export default Login