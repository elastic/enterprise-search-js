ARG NODE_JS_VERSION=16
FROM node:${NODE_JS_VERSION}

# Create app directory
WORKDIR /usr/src/app

RUN apt-get clean -y
RUN apt-get update -y
RUN apt-get install -y zip

# Install app dependencies
COPY package*.json ./
COPY packages/enterprise-search/package*.json ./packages/enterprise-search/
COPY packages/enterprise-search-universal/package*.json ./packages/enterprise-search-universal/
RUN npm install
RUN npm install --prefix packages/enterprise-search
RUN npm install --prefix packages/enterprise-search-universal

COPY . .
