export interface User {
    id: string;
    name: string;
    email: string;
    surname: string;
    avatarUrl?: string | null;
    phone?: string | null;
    address?: string | null,
    createdAt: Date | string | null,
    updatedAt: Date | string | null
}

export interface Student extends User {
    parentIds?: [],
    classId?: string | null,
    grades: IGrade[];
}

export interface Teacher extends User {
    schoolId?: string | null;
    subjects: ISubject[];
}

export interface Parent extends User {
    childrenIds?: string[];
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

export interface IClass {
    id: string;
    letter: string;
    num: number;
    schoolId: string
}

export interface ISubject {
    id: string;
    title: string;
    teacherId: string | null;
    classId: string;
}

export interface ISchool {
    id: string;
    title: string;
    phone: string;
    email: string;
    address: string;
    classes: IClass[];
    teachers: Teacher[];
}


export interface IGrade {
    id: string;
    value: number;
    date: Date;
    subjectId: string;
    subject: ISubject;
    studentId: string;
    student: Student;
    comment: string;
}
