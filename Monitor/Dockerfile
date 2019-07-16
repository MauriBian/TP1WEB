FROM node:8

ENV NODE_ENV=development
ENV DEBUG=true

WORKDIR /home/node/servicio

COPY /package.json .
COPY /package-lock.json .

RUN ["npm", "install"]

EXPOSE 5000

COPY /Monitor/monitor.js /home/node/servicio/
COPY /Monitor/monitoreableservice.js /home/node/servicio/
COPY /Monitor/monitormessage.js /home/node/servicio/


RUN chown node:users /home/node/

USER node

CMD [ "node", "monitor.js" ]

