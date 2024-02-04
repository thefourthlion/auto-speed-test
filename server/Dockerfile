# what img to do you want to pull
FROM node:17-alpine

# where to work from, what everything will have access to
WORKDIR /app

# copy file from root dir to root dir
COPY . .

# commands to run when booting img
RUN npm install

# which port to use and which port to map it to
EXPOSE 3025

# what commands to run when container is up
CMD ["node", "index.js"]

# docker build -t expressapp .