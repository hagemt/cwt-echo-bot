FROM node:carbon-alpine

USER node
RUN mkdir /home/node/code
WORKDIR /home/node/code

COPY .npmrc package*.json ./
RUN npm install
COPY . ./

EXPOSE 8080
ENV NODE_ENV production
ENTRYPOINT ["npm", "start"]
