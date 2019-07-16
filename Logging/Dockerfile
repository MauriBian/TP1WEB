FROM node:8

ENV NODE_ENV=development
ENV DEBUG=true

WORKDIR /home/node/servicio

COPY /package.json .
COPY /package-lock.json .

RUN ["npm", "install"]

EXPOSE 5003

COPY /Logging/LoggingApiRest.js /home/node/servicio/
COPY /Logging/LogglyConsumer.js /home/node/servicio/
COPY ApiErrors.js /home/node/servicio/

RUN chown node:users /home/node/

USER node

CMD [ "node", "LoggingApiRest.js" ]

