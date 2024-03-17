#Dockerfile for 01-Sale-Order-Restful-API
FROM node:alpine

WORKDIR /app

# Copy only package.json and package-lock.json files
#COPY ./01-Sale-Order-Restful-API/package*.json ./
COPY package.*json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
#COPY ./01-Sale-Order-Restful-API .
COPY . . 

#EXPOSE 3000

#CMD ["npm", "run", "dev"]
CMD ["node", "app.js"]