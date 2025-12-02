FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN rm -f prisma.config.ts

ENV DATABASE_URL="mongodb://placeholder:27017/mydb"
RUN npx prisma generate

ENV DATABASE_URL=""

EXPOSE 3000

CMD ["npm", "run", "dev"]