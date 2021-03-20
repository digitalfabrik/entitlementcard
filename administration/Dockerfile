FROM node:15.12.0-buster
WORKDIR /app/druckerei

COPY ./specs /app/specs
COPY ./administration /app/druckerei

RUN npm install

ENV REACT_APP_API_BASE_URL=https://api.staging.ehrenamtskarte.app
# start app
CMD ["npm", "run", "start"]
