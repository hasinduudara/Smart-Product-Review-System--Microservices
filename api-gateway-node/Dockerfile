FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g ts-node typescript

COPY . .

CMD ["npm", "start"]