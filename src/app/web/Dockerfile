FROM node:12.16.2-slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --ignore-scripts

ADD . .

EXPOSE 3000
EXPOSE 6606

CMD yarn local