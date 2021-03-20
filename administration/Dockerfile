FROM node:15.12.0-buster
WORKDIR /app/druckerei

COPY ./specs /app/specs
COPY ./administration /app/druckerei

RUN npm install

# start app
CMD ["npm", "run", "start"]
