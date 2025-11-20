import express from 'express';
import { prisma } from './prisma/prisma-client.js';


const app = express();

app.get('/', (req, res) => {
    res.send("Hello world")
});

app.listen(3000, () => {
    console.log(`Example app listening on port 3000`);
    const fetchData = async () => {
        const allStudents = await prisma.student.findMany();
        console.log('All students (null', JSON.stringify(allStudents));
    }

    fetchData();
})