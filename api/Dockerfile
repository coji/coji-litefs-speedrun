ARG PYTHON_BASE_IMAGE='python'
FROM ${PYTHON_BASE_IMAGE}:3.11-slim AS rye

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/app/src:$PYTHONPATH"
ENV RYE_HOME="/opt/rye"
ENV PATH="$RYE_HOME/shims:$PATH"
ENV FLY="true"
ENV LITEFS_DIR="/litefs"
ENV DATABASE_FILENAME="data.db"
ENV DATABASE_PATH="$LITEFS_DIR/$DATABASE_FILENAME"
ENV DATABASE_URL="file:$DATABASE_PATH"
# LiteFS proxy port
ENV LITEFS_PROXY_PORT="8080"
# App server port
ENV APP_PORT="3000"
ENV APP_HOST="0.0.0.0"

WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential curl procps vim-tiny sqlite3 ca-certificates fuse3 \
  && curl -sSf https://rye-up.com/get | RYE_NO_AUTO_INSTALL=1 RYE_INSTALL_OPTION="--yes" bash

COPY pyproject.toml requirements.lock requirements-dev.lock .python-version README.md ./
RUN rye sync --no-dev --no-lock
RUN . .venv/bin/activate

# COPY setup.py ./
# RUN python setup.py

FROM rye AS dev
RUN rye sync --no-lock

FROM rye AS run

COPY server.py server.py

# prepare for litefs
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs
COPY litefs.yml /etc/litefs.yml

CMD ["litefs", "mount"]
