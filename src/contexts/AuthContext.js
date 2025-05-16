// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import api from '../api'; // Asegúrate que este es tu Axios configurado

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);  // Usuario Firebase
  const [profile, setProfile] = useState(null);          // Usuario SQL (perfil)
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (retryCount = 0) => {
    try {
      const { data } = await api.get('/users/me');
      setProfile(data);
      setLoading(false);
    } catch (err) {
      // Si es 404, reintenta hasta 3 veces con un pequeño delay
      if (
        err.response &&
        err.response.status === 404 &&
        retryCount < 3
      ) {
        setTimeout(() => fetchProfile(retryCount + 1), 1000); // 1 segundo entre reintentos
      } else {
        setProfile(null);
        setLoading(false);
        console.error('Error trayendo perfil SQL:', err);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        setLoading(true);
        try {
          const token = await user.getIdToken();
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          fetchProfile();
        } catch (err) {
          setProfile(null);
          setLoading(false);
          console.error('Error trayendo perfil SQL:', err);
        }
      } else {
        setProfile(null);
        setLoading(false);
        delete api.defaults.headers.common.Authorization;
      }
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ currentUser, profile }}>
      {children}
    </AuthContext.Provider>
  );
}
