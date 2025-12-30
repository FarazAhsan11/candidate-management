export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
}

export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
};

export const setCurrentUser = (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const removeCurrentUser = (): void => {
    localStorage.removeItem('user');
};