import type { IGrade } from "@/types";

export const averageGrade = (array: IGrade[], fixedNum: number, subjectId: string) => {
    const initialValue = 0;

    const sortedArray = array.filter(arrayItem => arrayItem.subjectId === subjectId);

    if (sortedArray.length === 0) {
        return 'x'
    }

    const sumWithInitial = sortedArray.reduce(
        (accumulator, currentValue) => accumulator + currentValue.value,
        initialValue
    );

    return (sumWithInitial / sortedArray.length).toFixed(fixedNum)
};