# Set the base image to use for subsequent instructions
FROM node:alpine

# Set the working directory for any subsequent ADD, COPY, CMD, ENTRYPOINT,
# or RUN instructions that follow it in the Dockerfile
WORKDIR /app

# Copy files or folders from source to the dest path in the image's filesystem. Here, we are copying to the working directory -- WORKDIR, above
COPY package.json ./
COPY ./ ./

# Execute any commands on top of the current image as a new layer and commit the results.
RUN npm install --dev

EXPOSE 3000
EXPOSE 8080

# Configure the container to be run as an executable.
ENTRYPOINT ["npm", "start"]