FROM node:15-alpine

WORKDIR /app
COPY ./package.json /app/
COPY ./yarn.lock /app/
RUN yarn install --production
COPY ./ /app/


CMD ["npm", "start"]