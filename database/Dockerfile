FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=bangbang
ENV MYSQL_DATABASE=bangbang_db
ENV MYSQL_USER=bangbang
ENV MYSQL_PASSWORD=bangbangpass

# Copy SQL initialization scripts
COPY ./sql/ /docker-entrypoint-initdb.d/

# Set appropriate permissions
RUN chmod -R 644 /docker-entrypoint-initdb.d/ 