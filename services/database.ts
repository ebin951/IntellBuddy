import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';
import type { UserProfile } from '../types';

export type { UserProfile };

// Mock implementation of user registration
export const registerUser = async (
    username: string, 
    password: string, 
    fullName: string, 
    email: string, 
    phoneNumber: string
): Promise<UserProfile | null> => {
    const mockUsers = getFromLocalStorage('mock_users', {});
    
    if (mockUsers[username]) {
        throw new Error("Username already registered.");
    }

    const newUser: UserProfile = {
        id: `mock-${Date.now()}`,
        username,
        fullName,
        email,
        phoneNumber,
        joinedAt: new Date().toISOString(),
        xp: 0,
        level: 1,
        streak: 0,
        totalHours: 0,
        authSource: 'mock'
    };

    mockUsers[username] = newUser;
    saveToLocalStorage('mock_users', mockUsers);
    
    // Auto-login after register by setting current user
    saveToLocalStorage('current_user', newUser);
    return newUser;
};

// Mock implementation of user login
export const loginUser = async (username: string, password: string): Promise<UserProfile | null> => {
    const mockUsers = getFromLocalStorage('mock_users', {});
    const email = `${username.toLowerCase()}@example.com`;
    
    // Simple check - in a real app, never store plain text passwords
    const user = Object.values(mockUsers).find((u: any) => u.username === username);

    if (user && password === 'password123') { // Hardcoded mock password for existing users logic
        saveToLocalStorage('current_user', user);
        return user as UserProfile;
    }
    
    // Fallback for demo purposes if we just registered without password storage logic
    if (user) {
         saveToLocalStorage('current_user', user);
         return user as UserProfile;
    }

    throw new Error('Invalid credentials');
};

export const handleGoogleAuth = async (): Promise<void> => {
   console.log("Google Auth simulated.");
};

export const logout = async () => {
    localStorage.removeItem('current_user');
};

export const fetchUserProfile = async (userId: string, authEmail: string): Promise<UserProfile | null> => {
    // Return current user from local storage
    return getFromLocalStorage('current_user', null);
};

export const updateUserStat = async (userId: string, field: keyof UserProfile, value: any) => {
    const user = getFromLocalStorage('current_user', null);
    if (user && user.id === userId) {
        const updatedUser = { ...user, [field]: value };
        saveToLocalStorage('current_user', updatedUser);
        
        // Also update in the mock_users map
        const mockUsers = getFromLocalStorage('mock_users', {});
        if (mockUsers[user.username]) {
            mockUsers[user.username] = updatedUser;
            saveToLocalStorage('mock_users', mockUsers);
        }
    }
}

export const subscribeToAuthChanges = (callback: (user: UserProfile | null) => void) => {
    // Simple mock subscription
    const user = getFromLocalStorage('current_user', null);
    callback(user);
    return { subscription: { unsubscribe: () => {} } };
};

export const saveToDb = (key: string, data: any, userId?: string) => {
    const finalKey = userId ? `astudent_${userId}_${key}` : `astudent_${key}`;
    saveToLocalStorage(finalKey, data);
};

export const getFromDb = (key: string, defaultValue: any, userId?: string) => {
    const finalKey = userId ? `astudent_${userId}_${key}` : `astudent_${key}`;
    return getFromLocalStorage(finalKey, defaultValue);
};