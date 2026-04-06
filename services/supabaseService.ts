// This file is deprecated. All data is now handled via Local Storage in utils/localStorage.ts and services/database.ts

export const supabase = null;

export const insertOrder = async (orderData: any): Promise<any | null> => {
    console.warn("Supabase is disabled. Order not saved to backend.");
    return orderData;
};