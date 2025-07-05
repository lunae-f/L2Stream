#!/bin/sh

CERT_KEY_PATH=/usr/src/app/certs/nginx.key

# 証明書ファイルが作成されるまで待機する
echo "Waiting for certificate file..."
while [ ! -f "$CERT_KEY_PATH" ]; do
  sleep 1
done

echo "Certificate found. Starting server..."

# 本来のコマンド（node server.js）を実行する
exec "$@"