FROM node:14-alpine

COPY dist ./dist

COPY package* ./

COPY entrypoint.sh ./entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]