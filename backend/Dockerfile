# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install -g @nestjs/cli
# Install app dependencies
RUN npm install

RUN npm install pm2 -g
# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
#CMD [ "node", "dist/main" ]
CMD ["pm2-runtime", "start", "dist/main.js"]