FROM node:8

ENV NODE_ENV=development
ENV DEBUG=true

WORKDIR /home/node/servicio

COPY /package.json .
COPY /package-lock.json .

RUN ["npm", "install"]

EXPOSE 5001

COPY album.js /home/node/servicio/
COPY ApiErrors.js /home/node/servicio/
COPY artist.js /home/node/servicio/
COPY cargarDatos.sh /home/node/servicio/
COPY commands.js /home/node/servicio/
COPY errors.js /home/node/servicio/
COPY LoggingConsumer.js /home/node/servicio/
COPY main.js /home/node/servicio/
COPY musixmatchClient.js /home/node/servicio/
COPY Notificador.js /home/node/servicio/
COPY playlist.js /home/node/servicio/
COPY playListGenerator.js /home/node/servicio/
COPY Notifier/notifierManager.js /home/node/servicio/
COPY searchable.js /home/node/servicio/
COPY spotifyClient.js /home/node/servicio/
COPY test.js /home/node/servicio/
COPY track.js /home/node/servicio/
COPY unqfy.js /home/node/servicio/
COPY UNQFYApiRest.js /home/node/servicio/
COPY UNQFYController.js /home/node/servicio/


RUN chown node:users /home/node/

USER node

CMD [ "node", "UNQFYApiRest.js" ]

