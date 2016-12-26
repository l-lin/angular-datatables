FROM node:{node_version}

RUN mkdir app
ADD . /app/
WORKDIR /app/
RUN npm install
RUN npm install webpack@"{webpack_version}"


