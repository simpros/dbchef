FROM mcr.microsoft.com/devcontainers/base:jammy

# Install needed packages
RUN apt-get install curl unzip

# Install bun
RUN curl -fsSL https://bun.sh/install | bash

# Move bun to /usr/local/bin
RUN mv /root/.bun/bin/bun /usr/local/bin/
# Allow non-root users to run bun
RUN chmod a+x /usr/local/bin/bun