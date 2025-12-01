FROM node:20

WORKDIR /app

# Копируем package.json и prisma/
COPY package*.json ./
COPY prisma ./prisma

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код
COPY . .

# Удаляем prisma.config.ts если он есть
RUN rm -f prisma.config.ts

# Генерируем Prisma Client с placeholder
ENV DATABASE_URL="mongodb://placeholder:27017/mydb"
RUN npx prisma generate

# Очищаем placeholder
ENV DATABASE_URL=""

EXPOSE 3000

CMD ["npm", "run", "dev"]