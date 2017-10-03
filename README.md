# ウェブサイト制作用GITHUBへようこそ
## とりあえず手元で動かす

- まずAptana等でプロジェクトを作成し、プロジェクト中にcloneする
    - ```$ git clone https://github.com/haguluma/fridayclub-website.git```
- 必要なライブラリをインストール(cloneしたリポジトリ内で)
    - ```$ bundle install --path=vendor/bundle```
- cloneしたリポジトリの親ディレクトリへ移動し、そこでsqliteデータベースを作成、データベース名はsocial.dbとする
    - ```$ cd ..```
    - ```$ sqlite3 social.db```
あとはデータベースのスキーマを設定する。テーブル構造は以下
```
>CREATE TABLE members(
sysid text primary key,
mail text,
pass text,
salt text);
CREATE TABLE unique_strings(
uniquestr text
);

>CREATE TABLE infos (
no integer primary key,
date timestamp default(datetime(current_timestamp,'localtime')),
comment text);

>CREATE TABLE profiles (
sysid text primary key,
ID text,
img text,
profile text );

>CREATE TABLE premembers(
sysid text primary key,
mail text,
pass text,
salt text);

>CREATE TABLE talks (
No integer primary key autoincrement,
title text,
sysid text,
author text default('0000000000'),
title_img text default('no_image.png'),
comment text,
date timestamp default(datetime(current_timestamp,'localtime'))
);
```

   - ↑めんどいひとはダウンロードしたsocial.dbを移動してね
   - server.rb中のメールアドレスを設定しないと会員登録機能が使えないので注意
   - あとはcloneしたリポジトリ内で```$ bundle exec ruby server.rb```
   - webブラウザで```localhost:4567```にアクセスすれば入れる
