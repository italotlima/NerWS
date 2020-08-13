FROM node:latest
WORKDIR /webservice
COPY package*.json ./
RUN npm install --silent
COPY . .
ENV NODE_ENV=production
EXPOSE 8181
EXPOSE 19630
EXPOSE 19631
CMD ["npm", "start"]
