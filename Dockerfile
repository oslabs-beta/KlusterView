FROM node:18.13-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
RUN npm run build
EXPOSE 3000
ENTRYPOINT ["npm", "start"]