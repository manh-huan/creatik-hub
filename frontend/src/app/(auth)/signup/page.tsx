'use client';
import React from 'react';
import AuthForm from '@/components/auth/auth-form';

export default function SignupPage() {
  const [text] = React.useState({ 
    heading: 'Create a free account',
    subHeading: 'Join Creatik Hub, the ultimate platform for creating professional-quality videos',
    authGoogle: 'Sign up with Google',
    authApple: 'Sign up with Apple',
    authFacebook: 'Sign up with Facebook',
    showEmailRecommendation: true
  }); 
  return (
  <AuthForm text={text} />
  );
}