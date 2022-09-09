FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

COPY ./backend/package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./backend/ .

EXPOSE 8080

CMD [ "npm", "run", "start" ]
