import { IClassCreateInput } from "../types";

export const addClasses = (array: IClassCreateInput[], num: number, letter: string, typeOfSubject: string[]) => {
    array.push({
        num: num,
        letter: letter,
        subjects: {
            create: typeOfSubject.map((title: string) => ({ title }))
        }
    });
}