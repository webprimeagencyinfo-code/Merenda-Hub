'use client';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// Configuriamo Supabase direttamente qui per evitare errori di percorsi mancanti
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Page() {
  return (
    <div style={{ 
      backgroundColor: 'black', 
      color: 'white', 
      minHeight: '100-vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif' 
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Merenda Hub 🥐</h1>
      <p style={{ color: '#888', fontSize: '1.2rem' }}>Il portale è in fase di lancio...</p>
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '20px', 
        border: '1px solid #eab308', 
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#eab308', fontWeight: 'bold' }}>
          ✅ SE VEDI QUESTA SCHERMATA, IL SITO È ONLINE!
        </p>
        <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
          Ora Vercel ha accettato il codice.
        </p>
      </div>
    </div>
  );
}
