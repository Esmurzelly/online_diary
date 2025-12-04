export interface User {
    id: string;
    name: string;
    email: string;
    surname: string;
    avatarUrl?: string | null;
    phone?: string | null;
    address?: string | null,
    parentIds?: [],
    classId?: string | null,
    createdAt: Date | string | null,
    updatedAt: Date | string | null
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends AuthCredentials {
    name: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    message: string | null;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}