# Use the current Node LTS (Long Term Support)
FROM node:14.15.1-buster-slim as base
# Install packages required for building the app
RUN apt update && apt install -y git python make build-essential
# Set the working directory
WORKDIR /app
# Copy package.json to install dependencies
COPY package.json .
# Execute npm to actually install dependencies
RUN npm install
# Copy specific files and folders from source to the dest path in the image's filesystem.
COPY . .
COPY *.js *.json *.ts *.lock ./

# Use the base stage to produce a build
FROM base as build
# Specify variables at build-time for Vue
ARG NEXT_PUBLIC_WITHDRAWALADDRESS
ARG NEXT_PUBLIC_ROUTERPUBLICIDENTIFIER
ARG NEXT_PUBLIC_DEPOSITASSETID
ARG NEXT_PUBLIC_DEPOSITCHAINPROVIDER
ARG NEXT_PUBLIC_WITHDRAWASSETID
ARG NEXT_PUBLIC_WITHDRAWCHAINPROVIDER
# Execute npm to create a production build
RUN npm run build


# Build a production image
FROM build as production
# Define command to execute at runtime
CMD ["npm", "start"]
# Define the network port that this image will listen on at runtime.
EXPOSE 3000