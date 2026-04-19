// supabaseAuth.js

const { createClient } = require('@supabase/supabase-js');

// Replace these with your Supabase project URL and public anon key.
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function for signing in a user
async function signIn(email, password) {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
    return user;
}

// Function for signing out the user
async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// Function for signing up a new user
async function signUp(email, password) {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return user;
}

// Exporting the authentication functions
module.exports = { signIn, signOut, signUp };