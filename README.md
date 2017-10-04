# ウェブサイト制作用GITHUBへようこそ
## とりあえず手元で動かす

- まずAptana等でプロジェクトを作成し、プロジェクト中にcloneする(gitをダウンロードしといてね)
    - ```$ git clone https://github.com/fridayclub0/website_rep.git```
- 必要なライブラリのインストールを行う。website_rep内で以下のコマンドを叩く(bundleをダウンロードしといてね)
    - ```$ bundle install --path=vendor/bundle```
- cloneしたディレクトリ(website_rep)の親ディレクトリへ移動し、そこでsqliteデータベースを作成、データベース名はsocial.dbとする(sqliteをダウンロードしといてね)
(server.rb,11行のActiveRecord::Base.establish_connection(...)にデータベースファイルへのパスを指定してある。今回はwebsite_repの親ディレクトリ)
    - ```$ cd ..```
    - ```$ sqlite3 social.db```
あとはデータベースのスキーマを設定する。テーブル構造は以下
＊データベース設定がめんどいひとはダウンロードしたsocial.dbをwebsite_repの親ディレクトリにコピーすれば良い
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
   - server.rb中のメールアドレスを設定しないと会員登録機能が使えないので注意
   - あとはcloneしたリポジトリ内で```$ bundle exec ruby server.rb```
   - webブラウザで```localhost:4567```にアクセスすれば入れる
