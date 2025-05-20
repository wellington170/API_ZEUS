
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3001

CMD ["./wait-for-it.sh", "db:3306", "--", "yarn", "dev"]
