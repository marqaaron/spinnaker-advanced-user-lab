FROM alpine:3.12 AS baseimage
ARG VERSION='dev'
RUN apk add --no-cache nginx bash python3 py3-pip
WORKDIR /version
RUN echo ${VERSION} > version && chmod +rw version

FROM baseimage AS saulintermediate
RUN apk add --no-cache git nodejs npm
WORKDIR /app
COPY /.build ./build
COPY --from=baseimage /version ./build/scripts
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && rm -rf /app/node_modules
RUN ["chmod", "+x", "./build/scripts/startup.sh"]

FROM baseimage
MAINTAINER MarqAAron
WORKDIR /app
COPY --from=saulintermediate /app .
ENTRYPOINT ["/bin/bash","-c","./build/scripts/startup.sh"]
EXPOSE 8082