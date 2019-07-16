FROM node:8

ENV NODE_ENV=development
ENV DEBUG=true

WORKDIR /home/node/servicio

COPY /package.json .
COPY /package-lock.json .

RUN ["npm", "install"]

EXPOSE 5002

COPY /Notifier/credentials.json /home/node/servicio/
COPY /Notifier/gmailClient.js /home/node/servicio/
COPY /Notifier/notificationAPI.js /home/node/servicio/
COPY /Notifier/notifierManager.js /home/node/servicio/
COPY /Notifier/subscriptionManager.js /home/node/servicio/
COPY /Notifier/token.json /home/node/servicio/
COPY /Notifier/gmail_tools /home/node/servicio/
COPY ApiErrors.js /home/node/servicio/

RUN chown node:users /home/node/

USER node

CMD [ "node", "notificationAPI.js" ]

