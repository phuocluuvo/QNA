# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

#isntall yarn
RUN npm install -g yarn --force

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "start"]