FROM node:14-alpine

COPY dist /opt/action-files/dist
COPY node_modules /opt/action-files/dist/node_modules

COPY package* /opt/action-files

COPY entrypoint.sh /opt/action-files/entrypoint.sh

ENTRYPOINT [ "/opt/action-files/entrypoint.sh" ]