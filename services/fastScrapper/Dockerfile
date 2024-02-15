# what img to do you want to pull
FROM node:20-alpine

RUN npm install -g nodemon

# where to work from, what everything will have access to
WORKDIR /speedtest-services-fast

# copy package.json to cache
COPY package.json .

# commands to run when booting img
RUN npm install

# copy file from root dir to root dir
COPY . .

# which port to use and which port to map it to
EXPOSE 3005

# what commands to run when container is up
CMD ["npm", "run", "dev"]
