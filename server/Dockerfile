FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN  npm ci --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]