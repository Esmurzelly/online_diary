export interface User {
    id: string;
    name: string;
    email: string;
    surname: string;
    avatarUrl?: string | null;
    phone?: string | null;
    address?: string | null,
    class?: IClass,
    createdAt: Date | string | null,
    updatedAt: Date | string | null
}

export interface Student extends User {
    parents?: Parent[],
    parentIds?: string[],
    classId?: string | null,
    grades?: IGrade[];
}

export interface Teacher extends User {
    school: ISchool;
    schoolId?: string | null;
    subjects?: ISubject[];
}

export interface Parent extends User {
    childrenIds?: string[];
    children?: Student[];
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends AuthCredentials {
    name: string;
}

export type Role = 'student' | 'teacher' | 'parent' | 'admin' | 'none';

export interface AuthResponse {
    user: Student | Teacher | Parent;
    token: string;
    message: string | null;
    role?: Role;
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
    schoolId: string;
    school?: ISchool;
    subjects?: ISubject[];
    students?: Student[];
}

export interface ISubject {
    id: string;
    title: string;
    teacherId: string | null;
    teacher?: Teacher;
    classId: string;
    class: IClass;
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

export type GradeValue = 1 | 2 | 3 | 4 | 5;

export interface IGrade {
    id: string;
    value: GradeValue;
    date: Date;
    subjectId: string;
    subject: ISubject;
    studentId: string;
    student: Student;
    comment?: string;
}

export interface IGetAllSchoolsAction {
    allSchools: ISchool[];
    message: string;
}

// ------------------ school Slice ---------------------------


export interface ApiError {
    message: string;
}

export interface GetSchoolByIdResponse {
    schoolById: ISchool;
    message: string;
}

export interface CreateSchoolResponse {
    school: ISchool;
    message: string;
}

export interface AddClassResponse {
    data: IClass;
    message: string;
}

export interface DeleteClassResponse {
    removedClass: IClass;
    message: string;
}

export interface AddTeacherResponse {
    data: ISchool;
    message: string;
}

// export interface AddTeacherResponseWithSchoolId extends AddTeacherResponse {
//     schoolId: string
// }

export interface RemoveTeacherResponse {
    data: Teacher;
    message: string;
}

// ------------------ user Slice ---------------------------

export interface GetMeResponse {
    user: User | Student | Teacher | Parent;
    message: string;
}

export interface GetUserByIdResponse {
    user: User | Student | Teacher | Parent;
    message: string;
}

export interface UpdateUserResponse {
    user: User | Student | Teacher | Parent;
    message: string;
}

export interface RemoveUserResponse {
    message: string;
}

export interface GetAllUsersResponse {
    users: (Student | Teacher | Parent)[];
    message: string;
}

export interface AddParentToChildResponse {
    message: string;
    result: {
        childrenIds: string[];
        children: Student[];
    };
}

export interface RemoveParentToChildResponse {
    message: string;
    parentToChild: {
        id: string;
        children: Student[];
    };
}

// ------------------ teacher Slice ---------------------------

export interface GetAllTeachersResponse {
    allTeacher: Teacher[];
    message: string;
}

// ------------------ student Slice ---------------------------


export interface GetAllStudentsResponse {
    allStudents: Student[];
    message: string;
}

export interface GetStudentsFromOneClassResponse {
    students: Student[];
    message: string;
}

export interface SetGradeResponse {
    grade: IGrade;
    message: string;
}

export interface UpdateGradeResponse {
    updatedGrade: IGrade;
    message: string;
}

export interface RemoveGradeResponse {
    grade: IGrade;
    message: string;
}

// ------------------ class Slice ---------------------------

export interface ClassItem {
    id: string;
    num: number | null;
    letter: string | null;
    schoolId: string | null;
    students: Student[] | null;
    subjects: ISubject[] | null;
    school: ISchool | null,
}

export interface GetClassByIdResponse {
    classItem: ClassItem;
    message: string;
}

export interface AddStudentToClassResponse {
    student: Student;
    message: string;
}

export interface RemoveStudentFromClassResponse {
    student: Student;
    message: string;
}

export interface StudentsFromOneClassResponse {
    students: Student[];
    message: string;
}

export interface AddSubjectToClassResponse {
    subject: ISubject;
    message: string;
}

export interface RemoveSubjectFromClassResponse {
    subject: ISubject;
    message: string;
}

export interface AddTeacherToSubjectResponse {
    teacherToSubject: {
        teacherId: string;
        teacher: {
            subjects: ISubject[];
        };
    };
    message: string;
}

export interface RemoveTeacherFromSubjectResponse {
    teacherId: string;
    removedSubjectFromTeacher: ISubject;
    message: string;
}

export interface EditClassResponse {
    editedClass: ClassItem;
    message: string;
}