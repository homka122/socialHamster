FROM node:18
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install --omit=dev
COPY . /usr/src/app
EXPOSE 5000
RUN npm run build
CMD ["node", "-r", "dotenv/config", "dist/server.js"]