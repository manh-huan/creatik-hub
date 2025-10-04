'use client';
import AuthForm from '@/components/auth/auth-form';
import React from 'react';

export default function LoginPage() {
  const [text] = React.useState({ 
    heading: 'Welcome back',
    subHeading: 'Login to your account and start creating videos',
    authGoogle: 'Login with Google',
    authApple: 'Login with Apple',
    authFacebook: 'Login with Facebook',
    showEmailRecommendation: false
  }); 
  return (
  <AuthForm text={text} />
  );
}