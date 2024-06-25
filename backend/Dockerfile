FROM node:alpine

WORKDIR usr/apps


COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5475

CMD ["npm", "start"]