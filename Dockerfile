FROM node:14-alpine

COPY dist /opt/action-files/dist

COPY package* /opt/action-files/dist/

RUN cd /opt/action-files/dist && \
    npm i

COPY entrypoint.sh /opt/action-files/entrypoint.sh

ENTRYPOINT [ "/opt/action-files/entrypoint.sh" ]