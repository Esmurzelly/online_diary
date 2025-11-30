export interface IStudent {
  id: string;
  email: string;
  password?: string; // в API ответах обычно удаляем password
  name: string;
  surname?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  parentIds?: string[];
  parents?: IParent[];
  classId?: string | null;
  class?: IClass | null;
  grades?: IGrade[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeacher {
  id: string;
  email: string;
  password?: string;
  name: string;
  surname?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  schoolId?: string | null;
  school?: ISchool | null;
  subjects?: ISubject[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IParent {
  id: string;
  email: string;
  password: string;
  name: string;
  surname?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  childrenIds?: string[];
  children?: IStudent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISchool {
  id: string;
  title: string;
  phone: string;
  email: string;
  address: string;
  teachers?: ITeacher[];
  classes?: IClass[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IClass {
  id: string;
  num: number;
  letter?: string | null;
  school?: ISchool | null;
  schoolId?: string | null;
  students?: IStudent[];
  subjects?: ISubject[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubject {
  id: string;
  title: string;
  teacher?: ITeacher | null;
  teacherId?: string | null;
  classId?: string | null;
  class?: IClass | null;
  createdAt: Date;
  updatedAt: Date;
  grades?: IGrade[];
}

export interface IGrade {
  id: string;
  value: number;
  date: Date; // в контроллерах/сериализации можно конвертировать в ISO string
  subjectId?: string | null;
  subject?: ISubject | null;
  studentId?: string | null;
  comment?: string | null;
}

export interface IUserRegisterRequest {
  email: string;
  password: string;
  name: string;
  surname: string,
  avatarUrl?: string | null
}

export interface IUserLoginRequest {
  email: string;
  password: string;
}

export interface IClassCreateInput {
  num: number;
  letter: string;
  subjects: {
    create: { title: string }[];
  };
}

export interface IUserWithToken {
  id?: string;
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export interface IRequestGrade {
  subjectId: string;
  studentId: string;
  teacherId: string;
}