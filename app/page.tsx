'use client';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// NIENTE "export" qui davanti
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Merenda Hub 🥐</h1>
      <p className="text-gray-400">Il portale è quasi pronto...</p>
      <div className="mt-8 p-4 border border-yellow-500 rounded-lg">
        <p className="text-yellow-500">Se vedi questa pagina, il sito è ONLINE!</p>
      </div>
    </div>
  );
}
