# 智能 BI 系统

## 项目简介

区别于传统的 BI（Business Intelligence） 系统，智能 BI 系统依靠 AI 的能力，用户只需要提供原始数据，并输入一个分析目的，就能让 AI 智能选取图表进行展示并分析。

## 功能分析

1. 智能分析：用户输入目标和原始数据（图表类型），可以自动生成图表和分析结论
2. 图表管理（增删改查）
3. 图表生成的异步化（消息队列）
4. 对接 AI 能力

## 技术栈

### 前端

1. React
2. Umi + Ant Design Pro
3. 可视化开发库（**Echarts** + HighCharts + AntV）
4. umi openapi 代码生成（自动生成后端调用代码）

### 后端

1. Spring Boot（万用 Java 后端项目模板，快速搭建基础框架，避免重复写代码）
2. MySQL 数据库
3. MyBatis Plus 数据访问框架
4. 消息队列（RabbitMQ）
5. AI 能力（OpenAI 接口开发）/ 提供现成的 AI 接口）
6. Excel 的上传和数据的解析（Easy Excel）
7. Swagger + Knife4j 项目接口文档
8. Hutool 开发工具库

## 项目初始化

### 前端

1. 访问 Ant Design Pro 官网，按照官网创建项目

安装 pro-cli

```shell
npm i @ant-design/pro-cli -g
```

创建项目

```shell
pro create yubi-frontend
```

使用 Umi4 版本（据说坑很多）：

![使用 Umi4 版本](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com/imgs/image-20230911164817665.png)

2. 安装依赖

```shell
cd yubi-frontend
yarn
```

3. 启动项目，查看示例页面

```shell
yarn start
```

![示例项目启动页面](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com/imgs/image-20230911165831971.png)

4. 移除国际化（i18n-remove）

这里执行官方提供的命令进行移除

```shell
yarn i18n-remove
```

报错：

```shell
Error: Failed to load config "prettier" to extend from.
Referenced from: BaseConfig
```

查看 Github [issue](https://github.com/ant-design/ant-design-pro/issues/10452)，找到解决方案：

依次执行操作：

```shell
# 1 执行命令
yarn add eslint-config-prettier --dev yarn add eslint-plugin-unicorn --dev 
# 2 修改文件
修改 node_modules/@umijs/lint/dist/config/eslint/index.js 文件注释
// es2022: true
```

成功移除国际化：

![成功移除国际化](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com/imgs/image-20230911171303286.png)

5. 再次启动项目

```shell
yarn start
```

发现启动界面中左侧导航栏消失：

![启动界面中左侧导航栏消失](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com/imgs/image-20230911171448746.png)

6. 修改路由配置，恢复导航栏

找到项目文件：config/routes.ts，为每个导航项添加一个 name 属性即可

![修改routes.ts](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com/imgs/image-20230911172440662.png)

7. 重新启动项目，检查页面

![前端项目初始化完成](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com/imgs/image-20230911172535379.png)

8. 初始化 git 仓库

创建完成的仓库地址：https://github.com/AmbitiousJun/yubi

初始化本地 git 仓库：

```shell
git init
# 添加 Github 仓库为远程仓库，命名 origin，并设置自己的 ApiKey 鉴权
git remote add origin https://ghp_CVkqGqJe4******jYHmQRV0OVcDQ@github.com/AmbitiousJun/yubi.git
git add .
git commit -m "first init"
git push origin main
```

### 后端

1. 拉取 springboot-init 初始化项目
2. 创建示例数据库 my_db，跑通初始化项目
3. 提交 git 后端初始化

4. 设计数据库表

**用户表**：

```sql
-- 用户表
create table if not exists user
(
	id bigint auto_increment comment 'id' primary key,
  userAccount varchar(256) not null comment '账号',
  userPassword varchar(512) not null comment '密码',
  userName varchar(256) null comment '用户昵称',
  userAvatar varchar(1024) null comment '用户头像',
  userRole varchar(256) default 'user' not null comment '用户角色：user/admin',
  createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
  updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
  isDelete tinyint default 0 not null comment '是否删除',
  index idx_userAccount (userAccount)
) comment '用户' collate = utf8mb4_unicode_ci;
```

**图表信息表**：

```sql
-- 图表信息表
create table if not exists chart
(
	id bigint auto_increment comment 'id' primary key,
  userId bigint null comment 'userId',
  goal text null comment '分析目标',
  chartData text null comment '图表数据',
  chartType varchar(128) null comment '图表类型',
  genChart text null comment '生成的图表数据',
  genResult text null comment '生成的分析结论',
  createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
  updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
  isDelete tinyint default 0 not null comment '是否删除'
) comment '图表信息' collate = utf8mb4_unicode_ci;
```

5. 修改项目中的 `create_table.sql`，粘贴以上的两段表结构代码，更改数据库名为 `yubi`，创建数据库

![修改sql](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com/imgs/image-20230918163920332.png)

6. 使用 MybatisX 插件生成增删改查代码
7. 将生成的代码合并到项目中，解决冲突后尝试运行调通登录接口
8. 为 Chart 实体准备增删改查 DTO 类

![Chart的增删改查DTO类](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com/imgs/image-20230919114802662.png)

9. 复制 PostController 模板，修改为 ChartController 模版，并进行适配
10. 启动服务，测试添加图表和查询图表功能是否正常

### 前端对接后端增删改查接口

快捷工具：使用 openAPI，配合后端的 Swagger Json 接口，快速生成接口请求代码。

1. 获取后端 Swagger Json 接口

```text
http://localhost:8101/api/v2/api-docs
```

2. 在前端项目中，进入到 `config/config.ts` 文件中，找到 openAPI 的配置，并进行修改：

```json
/**
 * @name openAPI 插件的配置
 * @description 基于 openapi 的规范生成serve 和mock，能减少很多样板代码
 * @doc https://pro.ant.design/zh-cn/docs/openapi/
 */
openAPI: [
  {
    requestLibPath: "import { request } from '@umijs/max'",
    projectName: "yubi",
    schemaPath: "http://localhost:8101/api/v2/api-docs",
    // schemaPath: join(__dirname, 'oneapi.json'),
    mock: false,
  },
  // {
  //   requestLibPath: "import { request } from '@umijs/max'",
  //   schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
  //   projectName: 'swagger',
  // },
]
```

3. 在终端中运行 `yarn openapi` 生成接口代码

![使用openapi命令生成接口代码](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com/imgs/image-20230919155112010.png)

4. 在 `src/app.ts` 文件下，修改 request 对象的配置，添加 `baseURL` 参数

5. 在页面中的任意文件中调用接口，验证连通性

![验证前端对接后端接口是否成功](https://ambitious-bucket1-1305921962.cos.ap-guangzhou.myqcloud.com/imgs/image-20230919155534272.png)



