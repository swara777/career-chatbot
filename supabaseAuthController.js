import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zmlqvgooswtxlismotox.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptbHF2Z29vc3d0eGxpc21vdG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDgwNTQsImV4cCI6MjA5MjE4NDA1NH0.B09TidYtRcIyqpemBiHqcw_W5YE3kzJA_S7oT7N_DGs';
const supabase = createClient(supabaseUrl, supabaseKey);

export const signup = async (email, password) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    return { user, error };
};

export const login = async (email, password) => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    return { user, error };
};

export const getProfile = async () => {
    const { user, error } = await supabase.auth.getUser();
    return { user, error };
};

export const updateProfile = async (data) => {
    const { user, error } = await supabase.auth.updateUser({ data });
    return { user, error };
};

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};
