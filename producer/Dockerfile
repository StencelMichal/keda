FROM node:16

WORKDIR /usr/src/app

COPY ./producer /usr/src/app

RUN ["npm", "install"]

CMD ["node", "producer.js"]