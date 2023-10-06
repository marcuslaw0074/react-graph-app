FROM node:16.14-bullseye

WORKDIR /root/app

ENV PATH /root/app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install -g npm@8.7.0
RUN npm install

COPY . ./

CMD ["npm", "start"]