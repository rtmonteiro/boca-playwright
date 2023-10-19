FROM node:18
LABEL authors="ryan"

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

RUN npx playwright install
RUN npx playwright install-deps

# Bundle app source
COPY . .

ENTRYPOINT [ "npm", "start" ]