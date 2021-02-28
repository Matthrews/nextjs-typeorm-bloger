---
title: 简易博客系统开发详细文档
tag: nextjs typeorm
date: 2021年2月1日
---

#### 必要条件

 - Next.js
 - TypeORM
 - TS/Babel
 - Cypress

#### 博客系统需求分析v1.0

##### 博客系统
 - 用户可以登录注销，但不可以重置密码
 - 重置密码需要联系管理员
 - 用户可以对博客增删改查
 - 用户可以评论博客，但不可以修改
 - 用户不可以编辑个人信息

##### 可用性要求
 - 手机端也能操作

##### 其他要求
 - SEO


#### 博客系统开发

##### 提供初始化代码
 - yarn install
 - yarn run dev

##### 初始化环境
 - 删除已有的容器  
   - `docker ps`
   - `docker kill 容器id`
   - `docker rm 容器id`
 - 删除已有同名目录 blog-data   
   - `rm -rf blog-data`
 - 删除已有同名数据库
  - `dropdb bloger;`
  - `dropdb bloger_dev;`
  - `dropdb bloger_test;`
  - `dropdb bloger_prod;`


##### 创建表
 - 创建三个表
   1. 创建数据库：`docker run --name psql-blog -v blog-data:/var/lib/postgresql/data 
               -p 5432:5432 -e POSTGRES_USER=bloger
               -e POSTGRES_HOST_AUTH_METHOD=trust -d postgres`
   2. 启动数据库：`docker exec -it psql-blog bash`
   
   3. 查看让其运行状态： `docker ps -a`
   4. 创建数据库
    - 登录：psql -U postgres;
    - 创建用户：CREATE USER bloger;
    - 授权：ALTER USER bloger SUPERUSER CREATEDB;
    - 检查授权：\du
    - 创建数据库：CREATE DATABASE bloger;
    - 查看数据库：\l
    - 退出postgres用户：\q
   
   5. 以blog身份登录数据库：psql -U bloger;
   
   6. 连接数据库：\c
   
   7. 查看数据库表：\dt
   
   8. 创建开发测试生产数据库
    - `CREATE DATABASE bloger_dev ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';`
    - `CREATE DATABASE bloger_test ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';`
    - `CREATE DATABASE bloger_prod ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';`
   
   9. 查看数据库：\l
   
   10. 选择数据库：\c bloger_dev
   
   11. 修改`ormconfig.json`文件，测试连接状态：yarn start
   
   
   12. 启动项目：yarn run dev
   
   13. 创建Users表：yarn migration:create -n CreateUsers
   
   14. 完善up和down
   
   15. 执行：yarn migration:run
   
   16. 验证数据库是否有表： \c bloger_dev   \dt
   
   17. 从11到14步骤，创建 Posts 表和 Comments 表
   
   18. 创建 AddCreatedAtAndUpdatedAt 表用于给 Users 表加字段(同样地11到14步骤)
     - yarn migration:create -n AddCreatedAtAndUpdatedAt
   
   19. 查看字段是否添加成功：\d users;
   
   20. 命名风格不统一: pwd_digest 和 createdAt 
   
   21. 创建 RenameColumns 表用于修改表字段命名(同样地11到14步骤)
     - yarn migration:create -n RenameColumns
   
   22. 创建数据表关联
     - 创建三个实体 Post, User, Comment 并完善字段描述
       - yarn entity:create -n Post
       - yarn entity:create -n User
       - yarn entity:create -n Comment

##### 使用 seed 填充数据
   - 此时确保项目dev窗口是运行着的：yarn run dev
   - 完善 seed.ts
   - yarn seed
   - 填充完了去数据库检查下是否seed成功

##### 在Next.js中创建connection并进行查询
 - 在 `pages/index.tsx` 中通过 `getServerSideProps` 获取 `connection`
 - 遇到bug: `AlreadyHasActiveConnectionError`
 - 解决: `lib/getDatabaseConnection.tsx`

 - 获取到 `connection` 后查询数据库 `findAndCount`
 - 遇到bug: `EntityMetadataNotFound: No metadata for "Post" was found.`  
 - 解决: 在`lib/getDatabaseConnection.tsx`文件中 `createConnection` 的时候传入 `ormconfig.json` 和 `entities`

 - 将从数据库中查询到的 `seed` 数据渲染到页面上

 - `EntityMetadataNotFound: No metadata for "Post" was found.` 问题再次出现
 - 定位到问题出现在`lib/getDatabaseConnection.tsx`文件中第27行

##### 展示 posts，并支持跳转单个 post

##### 注册页面
 - 新建注册页面：pages/sign_up.tsx 
 - 新建注册api：api/v2/users.tsx 
 - 页面填完用户信息点击注册，api收到用户请求body

 - 成功创建用户
 - 生产环境不可使用md5，太容易破解了
 - 还需要做用户名一致性检验

 - 在 src/entity/User.ts类上加`@Unique('users', ['username'])`
 - 同时修改`ormconfig.json`的`synchronize`为`true`才可以
 - 但是开启`synchronize`太危险了
 - 尝试其他办法: `yarn migration:create -n CreateUniqueUsers`
 - 通过`CreateUniqueUsers`在数据库层面检查异常
 - 数据库层面是兜底的，后台引用必须进行异常检查
 - 后台应用层检查，前端可能没法做


 - 代码优化，将数据校验放到Entity Users里面
 - 将md5通过装饰器BeforeInsert放到Entity Users里面

 - 注册成功后返回给前端的数据含有敏感信息需要过滤
 - JS知识：实现对象的toJSON方法即可

##### 登录页面
 - 创建登录页面
 - 创建`api`处理登录
 - 使用`Sign model`优化登录校验(`entity`会被存到数据库，但是`model`不会)
 - 使用`session`记录登录状态
 - 使用`next-iron-session`发现req找不到session这个属性，需要扩展NextApiHandler的属性
 - 在`next-env.d.ts`里面扩展`NextApiRequest`
 - 登录成功后保存用户信息到session里面
 - 从服务器端获取session信息渲染到页面

 - 登陆成功直接跳转到`/posts`
 - 通过`getServerSideProps`获取数据库中的`posts`并展示

 - 秘钥等重要文件需要保存在环境变量里面
 - `next.js`支持`.env.local`(该文件不提交)

 - Live Template
   - fsc: Creates a stateless React component with FlowTypes and ES6 module system
   - nextapi: Create a NextApiHandler
   - nextpage: Create a NextPage
   
  - 封装Form表单

 ##### 創建博客页面
 - 创建新建博客页面

 - 进一步把`Form`抽象成`useForm`

 - 所有的表单替换为`useForm`

 - 完善新建博客页面api

 - Entity之间环形依赖怎么办？
  - https://github.com/typeorm/typeorm/issues/1290#issuecomment-495701473
  - https://github.com/typeorm/typeorm/issues/4190#issue-448493934
  - 结论：使用字符串关联

##### 登录问题处理
 - 后端发现未登录返回401，前端发现未登录提示用户登录，同时在登录页面rul上附上return_to参数


##### 两个页面如何复用
 - `export default Posts;`
 - `export {getServerSideProps};`
##### 如何分页
 - /posts  /posts?page=1  /posts?page=11 /posts?page=10000
 - /posts  /posts?id=  /posts?id=上一页最后一个id&offset=16
  - 后端获取id小于上一页最后一个id的最多offset条数据(隐含条件：id可以比较)
  - 应用场景：微博和Facebook这种数据流，防止在第2页的时候数据更新了，又看到了第一页的旧内容
 -目前本项目选用前一种
 - 封装一个分页器usePager 
  - 需求：<1...4 5 6 7 8 9 10...23> 第7 / 23页  显示首页和最后一页  显示当前页和当前页前三后三页


#### 部署到阿里云
 ##### 准备工作
   - 编译项目：yarn build
   - 开启数据库
   - 测试生产环境：yarn start
   
 ##### Docker化
   - Building your image: docker build -t rfzhu/node-web-app .
   - Run the image: docker run -p 3000:3000 -d rfzhu/node-web-app
   - Get container ID: $ docker ps -a
   - Print app output: $ docker logs <container id>
   - Example: Running on http://localhost:3000
   - Enter the container: docker exec -it <container id> /bin/bash
   - Test: curl -i localhost:3000
   - Restart: docker start -a <container id> 
   
 ##### Docker化之后，遇到EADDRINUSE的问题
   -修改ormconfig.json中的host解决
   - host设置为localhost是docker中的localhost，应该设置为本机ip，因为docker实际上也是通过WSL运行在本机上的
   
 ##### 购买阿里云服务器
   - 购买
   - 登录
 ##### 使用SSH登录机器
   - 使用用户名和密码登录：ssh root@xxx.xxx.xx.xx
   - 使用ssh pub秘钥登录：ssh-copy-id root@xxx.xxx.xx.xx
     - 可以跳过登录
     - 使用随机数再修改下密码(passwd)：https://linuxize.com/post/how-to-change-user-password-in-linux/#:~:text=How%20to%20Change%20User%20Password%20in%20Linux%201,to%20never%20expire.%20...%205%20Conclusion%20%23..%20
     - 如此任何其他人想要登陆你的机器只有两种方式：有你的新密码和你把他的公钥加到你的authorized_keys列表里面
       - cd ~/.ssh
       - ls
       - cat authorized_keys
       - vi authorized_keys 加入想要登录你机器的人的公钥
       - 然后他就可以通过公钥登陆你的机器了
     - Windows的话没有ssh-copy-id命令，可以自行搜索脚本实现
     - 我的：python ssh-copy-id.py root@xxx.xxx.xx.xx
     - 生成pub key一次就好
   - 修改windows的host(https://www.jianshu.com/p/154860a8ce57)，因为我们不可能每次都是用ip登录
   - `C:\Windows\System32\drivers\etc\hosts`文件里面加上一行`xxx.xxx.xx.xx    bloger_dev`
   - 然后我们再次登陆就直接使用：ssh root@bloger_dev

 ##### 为应用单独创建user
 - root权限过大
 - which adduser
 - adduser bloger
 - 一路回车
 ##### 使用bloger登录机器
 - 直接在当前root下切换：su - bloger
 - 查看home目录：cd ~ 回车后继续pwd回车
 - 退出：logout
 - 直接使用bloger用户登录：ssh bloger@bloger_dev  然后使用账号密码登录
 - 当然也可以使用ssh-copy-id上传公钥，下次就不用输密码了：python ssh-copy-id.py bloger@bloger_dev
 - 同样通过passwd修改密码
 - 用root安装docker然后bloger使用
 - 参考文章：https://docs.docker.com/engine/install/ubuntu/
 - 固定工具版本：`sudo apt-get install docker-ce=5:19.03.12~3-0~ubuntu-bionic docker-ce-cli=5:19.03.12~3-0~ubuntu-bionic containerd.io=1.2.13-2`
 - 配置docker,将bloger加入docker分组
 - 切到bloger用户，此时的bloger连：docker run hello-world都运行不了
 - 查看分组(https://linuxize.com/post/how-to-list-groups-in-linux/)：less /etc/group  
 - 添加用户到分组(https://www.howtogeek.com/50787/add-a-user-to-a-group-or-second-group-on-linux/): 先切回root，然后：usermod -a -G docker bloger
 - 切到bloger用户，运行：docker run hello-world  成功
 ##### 上传代码到docker
 - 发布docker到公开版本，可能很慢，私有的话需要钱
 - 本次使用另一种方式：使用github做中转将代码拉到bloger下，然后在这个docker下创建一个docker运行代码
 - 登录bloger: ssh bloger@bloger_dev    
 - mkdir app
 - cd app
 - git clone git@github.com:Matthrews/nextjs-typeorm-bloger.git
 - 失败，因为你没有秘钥
 - 生成秘钥(https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#:~:text=Generating%20a%20new%20SSH%20key%201%20Open%20Terminal,At%20the%20prompt%2C%20type%20a%20secure%20passphrase.%20)：
 在bloger下：ssh-keygen -t ed25519 -C "matthrews@outlook.com"，连续回车
 - 查询秘钥： cat ~/.ssh/id_ed25519.pub
 - 复制秘钥到github的SSH公钥下
 - 到app目录下拉代码：git clone git@github.com:Matthrews/nextjs-typeorm-bloger.git
 - 成功
 ##### 在阿里云上 build 应用
 - 在app同级创建目录存放数据：mkdir blog-data
 - 到nextjs-typeorm-bloger下运行docker: docker run --name psql-blog -v /home/bloger/blog-data/:/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_USER=bloger -e POSTGRES_HOST_AUTH_METHOD=trust -d postgres
 - 下载太慢，使用Cmder设置代理：https://www.cnblogs.com/QinTO/p/13443708.html
 - 推荐设置国内镜像(https://cr.console.aliyun.com/cn-wulanchabu/instances/mirrors)

 ##### 阿里云上Docker化
  - 编译：yarn build发现没有yarn
    - 切到root下载nodejs和yarn
    - node文档：https://github.com/nodesource/distributions/blob/master/README.md#debinstall
    - nodejs>12,yarn<2
    - which node
    - which yarn
    - node -v  ==> v12.21.0
    - yarn -v  ==> 1.22.5
  - 切回bloger用户build项目
  - 手动编辑.env.local
    - touch .env.local
    - vim .env.local
    - 将.env.local内容拷过来
    - 查看下内容：cat .env.local
  - Building your image: docker build -t rfzhu/node-web-app .
  - Run the image: docker run --network=host -p 3000:3000 -d rfzhu/node-web-app
  - --network=host特别重要
  - Get container ID: $ docker ps -a
  - Print app output: $ docker logs <container id>
  - Example: Running on http://localhost:3000
  - Enter the container: docker exec -it <container id> /bin/bash
  - Test: curl -i localhost:3000
  - Prune stopped or dangling containers: docker system prune
 ##### 阿里云上创建数据库和表
   - 创建数据库和之前的相同
   - 修改ormconfig的host和database为:
     "host": "localhost",
     "database": "bloger_prod",
   - yarn migration:run
   - yarn build提示`devDependencies`没安装可以设置NODE_ENV为开发环境，就会安装`devDependencies`
 ##### 添加阿里云安全策略
  - 前提：此时你开启`yarn start`，应该可以在阿里云上`curl -iL http://localhost:3000`成功了
  - 将`3000`端口添加到安全组，如此浏览器就可以访问了

#### 细节优化
 - 页面美化
 - 新增博客修改和删除功能
 - 重新手动部署
 
#### Nginx自动化部署 

##### 重新部署应用
 - 开启服务器
 - 开启 psql 容器 docker start xxx
 - 更新代码 git stash; git pull; git stash pop; yarn build
 - 构建 app 容器 docker build
 - 开启 app 容器 docker run
 - 自动化部署脚本
##### 自动化部署
 - ssh 远程执行脚本
   - 测试本地执行远程脚本：
     - 让脚本有可执行权限：chmod +x deploy.sh
     - 执行脚本：ssh bloger@bloger_dev 'sh /home/bloger/app/nextjs-typeorm-bloger/bin/deploy.sh' 测试成功
     - 删除nextjs-typeorm-bloger目录，这个本不该创建：
       - 到app下：`mv -f nextjs-typeorm-bloger/* ./` 
       - 回车然后在执行：`mv -f nextjs-typeorm-bloger/.* ./` 把.开头的文件移过来
       - 删除`nextjs-typeorm-bloger`目录：`rm -rf nextjs-typeorm-bloger`
 - 添加 yarn m:run，并解决 TypeORM 的 bug
   - 使用patch方案
   ```git
    git apply migrate.patch;
    yarn compile &&
    yarn m:run &&
    git reset --hard HEAD &&
  ```
 
 - 如何使用nginx静态代理？
  - 使用node-app处理api请求
  - 使用ngix处理静态请求(html/css等)
  - 最终实现动静分离，nginx好处：
    - 动静分离，nginx处理静态文件比node快
    - 负载均衡（多容器的时候）
  - nginx下载并运行：
    ```bash 
    docker run --name bloger-nginx --network=host -v /home/bloger/nginx.conf:/etc/nginx/conf.d/default.conf -v /home/
    bloger/app/.next/static/:/usr/share/nginx/html/_next/static/ -d nginx:1.19.7
    ```
  - 检验：浏览器地址栏输入：bloger_dev:80
 - 纠错：--network=host 会导致端口映射失效，端口直接就是阿里云机器的端口，但这种模式比较容易理解
 
 
 ##### 常见问题
  - 问题：`yarn install` 之后 `yarn dev` 的发现 `babel not fund`
  - 解答：`yarn install` 不会安装 `devDependencies` ，要用 `yarn install --production=false` 安装
  - 此外建议换下淘宝源：`npm config set registry https://registry.npm.taobao.org`
  - 问题：Cannot find module '@babel/plugin-proposal-decorators'
  - 解决：babel-loader和@babel/core版本不对应所产生的
       - babel-loader 8.x对应@babel/core 7.x
       - babel-loader 7.x对应@babel/core 6.x
  - 问题：Error: listen EADDRINUSE: address already in use 0.0.0.0:3000
  - 解决：docker 的 3000 端口在运行，所以我们的 yarn start 运行不了，先关了,然后 docker build, docker run

