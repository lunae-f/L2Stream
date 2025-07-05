# 軽量なNode.jsイメージをベースにする
FROM node:18-alpine

# 作業ディレクトリを作成
WORKDIR /usr/src/app

# 起動スクリプトを先にコピーして実行権限を付与
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

# コンテナ起動時にスクリプトを実行
ENTRYPOINT ["entrypoint.sh"]

# 起動スクリプトに渡すコマンドを設定
CMD [ "node", "server.js" ]