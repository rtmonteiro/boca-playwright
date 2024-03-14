#========================================================================
# Copyright Universidade Federal do Espirito Santo (Ufes)
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
# 
# This program is released under license GNU GPL v3+ license.
#
#========================================================================

# Build on base image (default: node:20)
# Use official Docker images whenever possible
ARG BASE_IMAGE=node:20

# The efficient way to publish multi-arch containers from GitHub Actions
# https://actuated.dev/blog/multi-arch-docker-github-actions
# hadolint ignore=DL3006
FROM --platform=${BUILDPLATFORM:-linux/amd64} ${BASE_IMAGE}

ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETOS
ARG TARGETARCH

LABEL authors="Ryan Monteiro, Rodrigo Laiola Guimaraes"
ENV CREATED_AT 2023-10-19
ENV UPDATED_AT 2024-03-11

# Set NODE_ENV variable
# https://viralganatra.com/docker-nodejs-production-secure-best-practices/
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Places binaries to node_modules/@playwright/test
# https://github.com/microsoft/playwright/issues/5767
ENV PLAYWRIGHT_BROWSERS_PATH 0

# Ensure we have superuser privileges
# hadolint ignore=DL3002
USER root

# Set working folder
WORKDIR /usr/src/boca-playwright

# Copy package files
# A wildcard is used to ensure both package.json AND package-lock.json are
# copied where available (npm@5+)
COPY package*.json ./

# Install app dependencies
RUN npx playwright install-deps \
    # Setup
    && npm ci \
    && npm cache clean --force \
    # If you are building your code for production
    # RUN npm ci --omit=dev
    && npx playwright install

# Bundle app source
COPY src src

# Run everything after as non-privileged user
USER node

# Use exec format to run program directly as pid 1
# https://www.padok.fr/en/blog/docker-processes-container
ENTRYPOINT [ "npm", "start" ]
