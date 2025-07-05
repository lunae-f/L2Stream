# 軽量なNginxイメージをベースにする
FROM nginx:1.27-alpine

# opensslをインストール
RUN apk add --no-cache openssl

# publicディレクトリの中身をNginxの公開ディレクトリにコピー
COPY ./public/ /usr/share/nginx/html

# Nginxのカスタム設定ファイルをコピー
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 起動スクリプトをコピーして実行権限を付与
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh

# コンテナ起動時にスクリプトを実行
ENTRYPOINT ["/entrypoint.sh"]