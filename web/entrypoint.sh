#!/bin/sh

# 証明書のパス
CERT_KEY=/etc/nginx/ssl/nginx.key
CERT_CRT=/etc/nginx/ssl/nginx.crt

# 証明書とキーが存在しない場合にのみ生成
if [ ! -f "$CERT_KEY" ] || [ ! -f "$CERT_CRT" ]; then
  echo "Generating self-signed certificate..."
  # 証明書を保存するディレクトリを作成
  mkdir -p /etc/nginx/ssl
  # opensslコマンドで証明書を生成
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$CERT_KEY" \
    -out "$CERT_CRT" \
    -subj "/C=JP/ST=Tokyo/L=Chiyoda/O=Self-employed/OU=IT/CN=localhost"
else
  echo "Certificate already exists."
fi

# Nginxをフォアグラウンドで起動
exec nginx -g 'daemon off;'