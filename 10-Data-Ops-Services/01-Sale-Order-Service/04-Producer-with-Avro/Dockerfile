FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

#EXPOSE 6501

CMD ["node", "app.js"]