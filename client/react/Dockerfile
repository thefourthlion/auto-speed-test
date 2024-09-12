# what img to do you want to pull
FROM node:17-alpine

# where to work from, what everything will have access to
WORKDIR /speedtest-client

# copy package.json to cache
COPY package.json .

# commands to run when booting img
RUN npm install

# copy file from root dir to root dir
COPY . .

# which port to use and which port to map it to
EXPOSE 4000

# what commands to run when container is up
CMD ["npm", "start"]

# sudo docker remove speedtest-client
# sudo docker build -t speedtest-client .
# sudo docker run -d --network host --restart unless-stopped -it --name speedtest-client speedtest-client

# sudo docker build -t mikrotik-controller-server .
# sudo docker run -d --network host --restart unless-stopped -it --name mikrotik-controller-server mikrotik-controller-server
