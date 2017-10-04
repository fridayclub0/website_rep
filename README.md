# ウェブサイト制作用GITHUBへようこそ
## とりあえず手元で動かす

- まずAptana等でプロジェクトを作成し、プロジェクト中にcloneする(※ gitをダウンロードしといてね)
    - ```$ git clone https://github.com/fridayclub0/website_rep.git```
- 必要なライブラリのインストールを行う。website_rep内で以下のコマンドを叩く(※ bundleをダウンロードしといてね)
    - ```$ bundle install --path=vendor/bundle```
    
- server.rb中のメールアドレスを設定しないと会員登録機能が使えないので注意
- あとはcloneしたリポジトリ内で```$ bundle exec ruby server.rb```
- webブラウザで```localhost:4567```にアクセスすれば入れる
