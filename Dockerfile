FROM node:latest

# Set the working directory to /app
WORKDIR /app

COPY package*.json ./

# Install app dependencies
RUN yarn add react-scripts
RUN yarn add node-sass
COPY . .
# Build the app
RUN yarn build
# Copy the current directory contents into the container at /app
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
