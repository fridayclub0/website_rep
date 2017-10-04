# -*- coding: utf-8 -*-
require 'sinatra'
require 'sinatra/reloader'
require 'sqlite3'
require 'active_record'
require 'fileutils'
require 'bcrypt'
require 'json'
require 'net/smtp'

ActiveRecord::Base.establish_connection(
  "adapter" => "sqlite3",
  "database" => "./social.db"
)

class Talk < ActiveRecord::Base
end
class Member < ActiveRecord::Base
end
class Premember < ActiveRecord::Base
end
class Profile < ActiveRecord::Base
end
class Unique_string < ActiveRecord::Base
end
class Info < ActiveRecord::Base
end

#ログイン・メンバー登録関係----------------------------
def sendmail(to,id)
    pass = "********" #Please Setting when you launch this Web site!
    from = "haguluma0master@gmail.com"
    subject = "Please finish the authentication !"
    body = "Please access  https://haguluma.com/confirm?id="+id

content = <<EOS
Date: #{Time::now.strftime("%a, %d %b %Y %X")}
From: #{from}
To: #{to}
Subject: #{subject}
Mine-Version: 1.0
Content-Type: text/plain; charset=utf-8

#{body}
EOS

  puts "Sending Mail ..."
# メール送信部分
  mail = Net::SMTP.new('smtp.gmail.com', 465)
  mail.enable_ssl
  mail.start('localhost', from, pass)
  mail.send_mail(content , from, to)
  mail.finish
 
  puts "end"
end


post '/trylogin' do
  mail = params[:mail]
  pass = params[:pass]
  data = Member.where(:mail=>mail)
  p data
  auth = 'fail'
  info = 0
  sysid = 0
  if data.length != 0 then
    salt = data[0][:salt]
    authobj = BCrypt::Password.new(data[0][:pass])
    if (authobj == salt+pass) then
      auth = 'success'
      sysid = data[0][:sysid]
      profile_data = Profile.where(:sysid=>sysid)
      profile = profile_data[0]
    end
  end
  obj = ['login' => auth,'sysid' => sysid,'profile' => profile]
  obj.to_json
end

post '/registmember' do
  mail = params[:mail]
  pass = params[:pass]
  data = Premember.where(:mail=>mail)
  res = 'failed'
  if data.length == 0 then
    id = uniquestring_maker()
    salt = uniquestring_maker()
    hash = BCrypt::Password.create(salt+pass)
    Premember.create(:sysid=>id,:mail=>mail,:salt=>salt,:pass=>hash)
    sendmail(mail,id)
    res = id
  end
  res
end

post '/upload_profile' do
  sysid = params['sysid']
  mode = params['mode']
  res = 'success'
  if mode == 'ID'
    id = params['id']
    p id
    Profile.where(:sysid=>sysid).update(:ID=>id)
  elsif mode == 'img'
    file = params['file']
    img = uploadfile(file)
    Profile.where(:sysid=>sysid).update(:img=>img)
    res = img
  elsif mode == 'selfintro'
    selfintro = params['selfintro']
    Profile.where(:sysid=>sysid).update(:profile=>selfintro)
  end
  res#レスポンス返さなかったらえらーになったんけどなんで？
end


post '/confirm2' do
  sysid = params[:sysid]
  pass = params[:pass]
  p sysid
  data = Premember.where(:sysid=>sysid)
  p data[0]
  auth = 'failed'
  info = 0
  id = 0
  if data.length != 0 then
    salt = data[0][:salt]
    authobj = BCrypt::Password.new(data[0][:pass])
    if (authobj == salt+pass) then
      auth = 'success'
      pass = data[0][:pass]
      mail = data[0][:mail]
      Member.create(:sysid=>sysid,:mail=>mail,:salt=>salt,:pass=>pass)
      Profile.create(:sysid=>sysid,:ID=>'Guest',:img=>'no_image.png',:profile=>'')
    end
  end
  auth
end

get '/confirm' do
  sysid = params[:id]
  data = Premember.where(:sysid=>sysid)
  res = 'failed'
  if data.length != 0 then
    res = sysid
  end
  @res = "'"+res+"'"
  erb :confirm
end

#--------------------------------------------





def uniquestring_maker()
    loop {
      list = [('a'..'z'), ('A'..'Z'), ('0'..'9')].map { |i| i.to_a }.flatten
      unique = (0...10).map { list[rand(list.length)] }.join
      data = Unique_string.where(:uniquestr=>unique)
      if data.length == 0 then
        Unique_string.create(:uniquestr=>unique)
        return unique
      end
    }
end


get '/' do
  list_num = 5
  members_info = {}
  talks = Talk.order('No DESC').limit(list_num)
  for talk in talks do
    search_id = talk['author']
    if members_info[search_id]==nil then
      info = Profile.where(:sysid=>search_id)
      members_info[search_id] = info
    end
  end
  @talks = talks.to_json
  @members_info = members_info.to_json
  
  erb :index
end


#Talk機能関係===================================

post '/check_theme' do
   theme_sysid = params['sysid']
   ret = 3456;
      File.open('./public/ver_files/'+theme_sysid+'_ver.txt','r:utf-8') do |file|
      ret = file.read
      file.close
   end
   ret.to_json
end
 

post '/talk_list' do
  list_num = 5
  mode = params[:mode]
  talk_no = params[:talk_no].to_i
  if mode == 'back'
    talk_no = talk_no - list_num
  elsif mode == 'next'
    talk_no = talk_no + list_num
  else
  end
  members_info = {}
  talks = Talk.order('No DESC').offset(talk_no).limit(list_num)
  for talk in talks do
    search_id = talk['author']
    if members_info[search_id]==nil then
      info = Profile.where(:sysid=>search_id)
      members_info[search_id] = info
    end
  end
  [talk_no,talks,members_info].to_json
end

post '/submit' do
  uploadfile = params[:file]
  imgpass = uploadfile(uploadfile)#識別子つきで保存
  title = params[:title]
  comment = params[:comment]
  author = params['author_sysid'];
  uniquestr = uniquestring_maker()
  Talk.create(:sysid=>uniquestr,:title=>title,:comment=>comment,:title_img=>imgpass,:author=>author)
  data = Talk.where(:sysid=>uniquestr)
  time=data[0]['date']
  array = Array.new
  File.open('./public/files/'+uniquestr+'.txt','w+') do |file|
    file.close
  end
  File.open('./public/ver_files/'+uniquestr+'_ver.txt','w+') do |file|
    file.write(file.mtime);
    file.close
  end
end

post '/fetch_theme' do
   theme_sysid = params['sysid']
   header = Talk.where(:sysid=>theme_sysid)
   comments = Array.new
   check_no = 0
   File.open('./public/files/'+theme_sysid+'.txt','r:utf-8') do |file|
     file.each_line do |line|
        json = JSON.parse(line)
        comments << json
      end
      file.close
   end
   File.open('./public/ver_files/'+theme_sysid+'_ver.txt','r:utf-8') do |file|
      check_no = file.read
      file.close
   end
   
   members_info = {}
   author_sysid = header[0]['author']
   info = Profile.where(:sysid=>author_sysid)
   members_info[author_sysid] = info[0]
    for comment in comments do
      search_id = comment['commenter_sysid']
      if members_info[search_id]==nil then
        info = Profile.where(:sysid=>search_id)
        members_info[search_id] = info[0]
      end
    end
   p members_info
   data = [header[0],comments,members_info,check_no]
   return data.to_json
end

post '/submit_comment' do
  uploadfile = params['file']
  imgpass = uploadfile(uploadfile)#識別子つきで保存
  p 'test : ' + imgpass
  theme_sysid = params['sysid']
  comment = params['comment']
  commenter_sysid = params['author_sysid']
  hash = params['hash']
  t = Time.now
  date = t.strftime("%Y-%m-%d %H:%M:%S")
  File.open('./public/files/'+theme_sysid+'.txt','a') do |file|
    comments = {:date=>date,:commenter_sysid=>commenter_sysid,:comment=>comment,:imgpass=>imgpass,:hash=>hash}
    file.write(comments.to_json+"\n")
    file.close
  end
  File.open('./public/ver_files/'+theme_sysid+'_ver.txt','w+:utf-8') do |file|
      check_no = file.mtime
      file.write(file.mtime)
      file.close
   end
  return imgpass
end

#==================================================================

post '/upload' do
  img = uniquestring_maker()
  file = params[:file]
  pass = file[:tempfile]
  type = file[:type]
  pass = file[:tempfile].path
  
  if type == "image/gif"
    path = './public/img/'+img+'.gif'
    path2 = img+'.gif'
    FileUtils.cp(pass,path)
  elsif type == "image/png"
    path = './public/img/'+img+'.png'
    path2 = img + '.png'
    FileUtils.cp(pass,path)
  elsif type == "image/jpeg"
    path = './public/img/'+img+'.jpeg'
    path2 = img+'.jpeg'
    FileUtils.cp(pass,path)
  else
  end
  path2
end


post '/upload' do
  img = uniquestring_maker()
  file = params[:file]
  pass = file[:tempfile]
  type = file[:type]
  pass = file[:tempfile].path
  
  if type == "image/gif"
    path = './public/img/'+img+'.gif'
    path2 = img+'.gif'
    FileUtils.cp(pass,path)
  elsif type == "image/png"
    path = './public/img/'+img+'.png'
    path2 = img + '.png'
    FileUtils.cp(pass,path)
  elsif type == "image/jpeg"
    path = './public/img/'+img+'.jpeg'
    path2 = img+'.jpeg'
    FileUtils.cp(pass,path)
  else
  end
  path2
end

def uploadfile(file)
  
  if file == 'none' 
    return 'no_image.png'
  end
  img = uniquestring_maker()
  pass = file[:tempfile]
  type = file[:type]
  pass = file[:tempfile].path
  
  if type == "image/gif"
    path = './public/img/'+img+'.gif'
    path2 = img+'.gif'
    FileUtils.cp(pass,path)
  elsif type == "image/png"
    path = './public/img/'+img+'.png'
    path2 = img + '.png'
    FileUtils.cp(pass,path)
  elsif type == "image/jpeg"
    path = './public/img/'+img+'.jpeg'
    path2 = img+'.jpeg'
    FileUtils.cp(pass,path)
  else
  end
  return path2
end
