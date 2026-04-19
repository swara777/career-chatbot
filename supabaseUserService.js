// supabaseUserService.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'your_supabase_url'; // Replace with your Supabase URL
const supabaseKey = 'your_supabase_key'; // Replace with your Supabase Key
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch user profile by ID
export const fetchUserProfileById = async (id) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
};

// Update user profile
export const updateUserProfile = async (id, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id);
    if (error) throw error;
    return data;
};

// Get user profile by ID (alias for fetch)
export const getUserProfileById = fetchUserProfileById;

// Delete user profile
export const deleteUserProfile = async (id) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return data;
};

export default {
    fetchUserProfileById,
    updateUserProfile,
    getUserProfileById,
    deleteUserProfile,
};
