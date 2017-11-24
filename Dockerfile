# Set the base image to Node 6.11.0 with Alpine Linux
FROM    node:6.11.0-alpine

# File Author / Maintainer
MAINTAINER Dan Halverson

# Install nodemon
RUN npm install -g nodemon

# Define working directory
WORKDIR /src
ADD . /src

# Expose port
EXPOSE  3001

# Run app using nodemon
RUN cd /src && npm install
CMD ["nodemon", "/src/server.js"]
