FROM ubuntu:24.04
RUN apt-get update && apt-get install -y --no-install-recommends libssl3t64 ca-certificates && rm -rf /var/lib/apt/lists/*
COPY agentic-server /usr/local/bin/agentic-server
RUN useradd -m -u 10001 agentic && mkdir /data && chown 10001:10001 /data
USER 10001
ENTRYPOINT ["/usr/local/bin/agentic-server"]
