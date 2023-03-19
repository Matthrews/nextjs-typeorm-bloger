### 简易博客系统

#### 主要功能

- 用户可以登录注销，但不可以重置密码
- 重置密码需要联系管理员
- 用户可以对博客增删改查
- 用户可以评论博客，但不可以修改
- 用户不可以编辑个人信息

#### 在线demo

http://8.130.28.152:3000/

#### 主要技术

- Next.js
- TypeORM
- TS/Babel
- Cypress

> [benchmark-prisma-vs-typeorm](https://dev.to/josethz00/benchmark-prisma-vs-typeorm-3873)

#### 开发

1. docker 上数据库环境安装测试

2. 创建数据库`CREATE DATABASE bloger_dev ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';`

3. 创建表`yarn migration:run`

4. mock 数据`yarn seed`

5. 启动项目`yarn dev`

#### 部署

```bash
    # 执行远程脚本
    ssh bloger@bloger_dev 'sh /home/bloger/app/bin/deploy.sh'
    # 或者直接发送并执行本地脚本
    ssh bloger@bloger_dev 'bash -s' < /home/bloger/app/bin/deploy.sh
```

#### 详细文档

- docs/note.md
