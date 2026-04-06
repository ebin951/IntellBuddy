// utils/localStorage.ts

export const saveToLocalStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Error saving data to local storage for key "${key}":`, e);
    }
};

export const getFromLocalStorage = (key: string, defaultValue: any): any => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error(`Error retrieving or parsing data from local storage for key "${key}":`, e);
        return defaultValue;
    }
};

export const clearLocalStorage = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error(`Error clearing data from local storage for key "${key}":`, e);
    }
};