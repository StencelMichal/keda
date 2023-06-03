FROM node:16

WORKDIR /usr/src/app

COPY ./consumer /usr/src/app

RUN npm install

ENV SCALER=$scaler

EXPOSE 8080
CMD [ "node", "super-consumer.js" ]