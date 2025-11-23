export const addClasses = (array, num, letter, typeOfSubject) => {
    array.push({
        num: num,
        letter: letter,
        subjects: {
            create: typeOfSubject.map(title => ({ title }))
        }
    });
}