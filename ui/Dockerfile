FROM node:22-bookworm


WORKDIR /app_xy/ui
COPY ui/package*.json .
RUN npm install
RUN cp package-lock.json ./node_modules/  # for getting a pkg-lck from build
