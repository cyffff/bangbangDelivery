# BangBang Delivery Platform - Cursor Rules

## 项目概述

BangBang Delivery是一个跨境物流平台，连接需要国际运输物品的用户与有行程的旅行者，类似Airmule的商业模式。本文档为Cursor IDE提供项目结构和开发指南。

## 技术栈

- **前端**：React + TypeScript + Redux + Ant Design
- **后端**：Spring Boot + Spring Cloud微服务架构
- **数据库**：MySQL + Redis + Elasticsearch
- **运维**：Docker + Kubernetes + 全球CDN + 阿联酋本地节点
- **安全**：全链路HTTPS、端到端加密聊天、KYC人脸识别

## 项目结构

```
bangbangDelivery/
├── frontend/                           # 前端代码
│   ├── web/                            # React Web应用
│   │   ├── public/                     # 静态资源
│   │   ├── src/                        # 源代码
│   │   │   ├── api/                    # API客户端
│   │   │   ├── components/             # UI组件
│   │   │   ├── pages/                  # 页面组件
│   │   │   ├── store/                  # Redux状态管理
│   │   │   ├── hooks/                  # 自定义Hooks
│   │   │   ├── utils/                  # 工具函数
│   │   │   └── App.tsx                 # 应用入口
│   │   ├── package.json                # 依赖管理
│   │   └── tsconfig.json               # TypeScript配置
│   └── wechat-miniprogram/             # 微信小程序(未来实现)
│
├── backend/                            # 后端微服务
│   ├── common/                         # 公共模块
│   │   ├── common-core/                # 核心工具类
│   │   ├── common-redis/               # Redis工具
│   │   └── common-security/            # 安全工具
│   │
│   ├── gateway/                        # API网关服务
│   │   ├── src/main/java/com/bangbang/gateway/
│   │   │   ├── config/                 # 网关配置
│   │   │   ├── filter/                 # 过滤器
│   │   │   └── handler/                # 异常处理器
│   │
│   ├── auth-service/                   # 认证授权服务
│   │   ├── src/main/java/com/bangbang/auth/
│   │   │   ├── controller/             # API控制器
│   │   │   ├── service/                # 业务逻辑
│   │   │   ├── repository/             # 数据访问
│   │   │   ├── entity/                 # 数据实体
│   │   │   ├── dto/                    # 数据传输对象
│   │   │   ├── config/                 # 配置
│   │   │   └── security/               # 安全配置
│   │
│   ├── user-service/                   # 用户服务
│   │   ├── src/main/java/com/bangbang/user/
│   │   │   ├── controller/             # API控制器
│   │   │   ├── service/                # 业务逻辑
│   │   │   ├── repository/             # 数据访问
│   │   │   ├── entity/                 # 数据实体
│   │   │   ├── dto/                    # 数据传输对象
│   │   │   ├── mapper/                 # 对象映射
│   │   │   ├── config/                 # 配置
│   │   │   └── security/               # 安全配置
│   │
│   ├── demand-service/                 # 需求服务
│   │   ├── src/main/java/com/bangbang/demand/
│   │   │   ├── controller/             # API控制器
│   │   │   ├── service/                # 业务逻辑
│   │   │   ├── repository/             # 数据访问
│   │   │   ├── entity/                 # 数据实体
│   │   │   ├── dto/                    # 数据传输对象
│   │   │   ├── mapper/                 # 对象映射
│   │   │   ├── client/                 # 微服务客户端
│   │   │   └── config/                 # 配置
│   │
│   ├── journey-service/                # 行程服务
│   │   ├── src/main/java/com/bangbang/journey/
│   │   │   ├── controller/             # API控制器
│   │   │   ├── service/                # 业务逻辑
│   │   │   ├── repository/             # 数据访问
│   │   │   ├── entity/                 # 数据实体
│   │   │   ├── dto/                    # 数据传输对象
│   │   │   ├── mapper/                 # 对象映射
│   │   │   ├── client/                 # 微服务客户端
│   │   │   └── config/                 # 配置
│   │
│   ├── matching-service/               # 匹配服务
│   │   ├── src/main/java/com/bangbang/matching/
│   │   │   ├── controller/             # API控制器
│   │   │   ├── service/                # 业务逻辑
│   │   │   ├── repository/             # 数据访问
│   │   │   ├── entity/                 # 数据实体
│   │   │   ├── dto/                    # 数据传输对象
│   │   │   ├── mapper/                 # 对象映射
│   │   │   ├── client/                 # 微服务客户端
│   │   │   ├── algorithm/              # 匹配算法
│   │   │   └── config/                 # 配置
│   │
│   ├── order-service/                  # 订单服务 
│   │   ├── src/main/java/com/bangbang/order/
│   │   │   ├── controller/             # API控制器
│   │   │   ├── service/                # 业务逻辑
│   │   │   ├── repository/             # 数据访问
│   │   │   ├── entity/                 # 数据实体
│   │   │   ├── dto/                    # 数据传输对象
│   │   │   ├── mapper/                 # 对象映射
│   │   │   ├── client/                 # 微服务客户端
│   │   │   ├── state/                  # 订单状态管理
│   │   │   └── config/                 # 配置
│   │
│   ├── payment-service/                # 支付服务
│   │   ├── src/main/java/com/bangbang/payment/
│   │   │   ├── controller/             # API控制器
│   │   │   ├── service/                # 业务逻辑
│   │   │   ├── repository/             # 数据访问
│   │   │   ├── entity/                 # 数据实体
│   │   │   ├── dto/                    # 数据传输对象
│   │   │   ├── mapper/                 # 对象映射
│   │   │   ├── client/                 # 微服务客户端
│   │   │   ├── provider/               # 支付渠道
│   │   │   └── config/                 # 配置
│   │
│   ├── messaging-service/              # 消息服务
│   │   ├── src/main/java/com/bangbang/messaging/
│   │   │   ├── controller/             # API控制器
│   │   │   ├── service/                # 业务逻辑
│   │   │   ├── repository/             # 数据访问
│   │   │   ├── entity/                 # 数据实体
│   │   │   ├── dto/                    # 数据传输对象
│   │   │   ├── mapper/                 # 对象映射
│   │   │   ├── client/                 # 微服务客户端
│   │   │   ├── websocket/              # WebSocket处理
│   │   │   └── config/                 # 配置
│   │
│   ├── kyc-service/                    # KYC服务
│   │   ├── src/main/java/com/bangbang/kyc/
│   │   │   ├── controller/             # API控制器
│   │   │   ├── service/                # 业务逻辑
│   │   │   ├── repository/             # 数据访问
│   │   │   ├── entity/                 # 数据实体
│   │   │   ├── dto/                    # 数据传输对象
│   │   │   ├── mapper/                 # 对象映射
│   │   │   ├── client/                 # 微服务客户端
│   │   │   ├── processor/              # 身份验证处理
│   │   │   └── config/                 # 配置
│   │
│   ├── review-service/                 # 评价服务
│   │   ├── src/main/java/com/bangbang/review/
│   │   │   ├── controller/             # API控制器
│   │   │   ├── service/                # 业务逻辑
│   │   │   ├── repository/             # 数据访问
│   │   │   ├── entity/                 # 数据实体
│   │   │   ├── dto/                    # 数据传输对象
│   │   │   ├── mapper/                 # 对象映射
│   │   │   ├── client/                 # 微服务客户端
│   │   │   └── config/                 # 配置
│   │
│   ├── notification-service/           # 通知服务
│   │   ├── src/main/java/com/bangbang/notification/
│   │   │   ├── controller/             # API控制器
│   │   │   ├── service/                # 业务逻辑
│   │   │   ├── repository/             # 数据访问
│   │   │   ├── entity/                 # 数据实体
│   │   │   ├── dto/                    # 数据传输对象
│   │   │   ├── mapper/                 # 对象映射
│   │   │   ├── client/                 # 微服务客户端
│   │   │   ├── template/               # 通知模板
│   │   │   └── config/                 # 配置
│   │
│   └── search-service/                 # 搜索服务
│       ├── src/main/java/com/bangbang/search/
│       │   ├── controller/             # API控制器
│       │   ├── service/                # 业务逻辑
│       │   ├── repository/             # 数据访问
│       │   ├── entity/                 # 数据实体
│       │   ├── dto/                    # 数据传输对象
│       │   ├── mapper/                 # 对象映射
│       │   ├── client/                 # 微服务客户端
│       │   ├── index/                  # 索引管理
│       │   └── config/                 # 配置
│
├── infrastructure/                     # 基础设施即代码
│   ├── docker/                         # Docker配置
│   │   ├── docker-compose.yml          # 容器编排
│   │   ├── start.sh                    # 启动脚本
│   │   └── stop.sh                     # 停止脚本
│   ├── kubernetes/                     # Kubernetes配置
│   │   ├── deployments/                # 部署配置
│   │   ├── services/                   # 服务配置
│   │   └── ingress/                    # 入口配置
│   └── terraform/                      # 云资源管理
│       ├── aws/                        # AWS资源
│       └── aliyun/                     # 阿里云资源
│
└── docs/                               # 文档
    ├── api/                            # API文档
    │   ├── swagger/                    # Swagger接口文档
    │   └── postman/                    # Postman测试集合
    ├── architecture/                   # 架构文档
    │   ├── diagrams/                   # 架构图
    │   └── design/                     # 设计文档
    └── dev-guide/                      # 开发指南
        ├── setup.md                    # 环境搭建
        ├── coding-standards.md         # 编码规范
        └── workflow.md                 # 工作流程
```

### 服务模块说明

每个微服务模块遵循相似的分层架构，主要包括：

1. **Controller层**: 提供API接口，处理HTTP请求和响应
2. **Service层**: 实现业务逻辑，处理事务
3. **Repository层**: 数据访问层，与数据库交互
4. **Entity层**: 定义JPA实体，映射数据库表
5. **DTO层**: 数据传输对象，用于API请求和响应
6. **Mapper层**: 使用MapStruct进行对象映射转换
7. **Client层**: 使用OpenFeign进行微服务间通信
8. **Config层**: 服务特定配置

所有微服务共享以下特性：

- **统一异常处理**: 提供一致的错误响应
- **API文档**: 使用SpringDoc自动生成Swagger文档
- **健康检查**: 暴露健康检查端点
- **服务发现**: 通过Eureka注册和发现服务
- **配置管理**: 支持本地和远程配置

## 代码规范

### 通用规范

1. 使用UTF-8编码
2. 使用LF作为行结束符
3. 文件末尾添加空行
4. 移除行尾空格
5. 最大行长度120字符

### Java规范

1. 遵循Google Java风格指南
2. 使用Java 11 LTS版本
3. Service层添加事务注解
4. 使用Lombok减少样板代码
5. REST API遵循RESTful规范
6. 统一异常处理
7. 使用Spring Validation进行参数校验

### TypeScript/React规范

1. 使用函数组件和Hooks
2. 使用TypeScript严格模式
3. 按特性组织文件，而非按类型
4. 使用ESLint和Prettier进行代码格式化
5. 使用React Query管理API状态
6. Redux仅用于全局状态管理
7. 组件使用Ant Design设计规范

## 数据库规范

1. 表名使用小写下划线命名
2. 主键使用uuid类型
3. 所有表包含created_at和updated_at时间戳
4. 使用软删除而非物理删除
5. 索引命名规范: idx_{table}_{column}
6. 外键命名规范: fk_{table}_{reference_table}_{column}

## 安全指南

1. 所有API通过HTTPS访问
2. 敏感数据加密存储
3. 使用JWT进行无状态身份验证
4. 实现请求限流防止DoS攻击
5. 输入数据严格验证
6. 密码使用BCrypt加密
7. API访问权限RBAC控制

## 微服务开发指南

1. 服务间通信使用RESTful API
2. 使用OpenFeign进行服务调用
3. 实现服务熔断和降级
4. 遵循单一职责原则
5. 维护API版本
6. 实现健康检查接口
7. 适当使用异步消息通信

## 国际化指南

1. 所有用户界面文本使用i18n资源文件
2. 支持中文、英文和阿拉伯语
3. 日期时间考虑时区差异
4. 货币支持多币种显示
5. 支持RTL布局

## 测试要求

1. 单元测试覆盖率目标80%+
2. 集成测试覆盖所有微服务间调用
3. 端到端测试覆盖核心业务流程
4. 性能测试确保响应时间<300ms
5. 安全测试包括OWASP Top 10 

## 本地部署要求

1.使用docker环境
2.生成docker的compose.yml文件
3.生成一键启动所有服务的sh脚本
4.生成一键关闭所有服务的sh脚本