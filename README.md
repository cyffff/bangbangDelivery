# BangBang Delivery 跨境物流平台

BangBang Delivery是一个连接需要国际运输物品的用户与有行程的旅行者的跨境物流平台。我们的使命是让国际物品运输变得更加便捷、安全和高效。

![BangBang Delivery Logo](docs/images/logo.png)

## 项目概述

BangBang Delivery平台提供以下核心功能：

- 物品运输需求发布与搜索
- 旅行者行程发布与搜索
- 智能匹配算法推荐
- 安全支付与担保交易
- 端到端加密实时通讯
- 多级KYC身份验证
- 用户信用评分系统
- 多语言多地区支持

## 技术架构

本项目采用微服务架构，主要技术栈包括：

- **前端**: React + TypeScript + Redux + Ant Design
- **后端**: Spring Boot + Spring Cloud 微服务
- **数据库**: MySQL, Redis, Elasticsearch
- **消息队列**: RabbitMQ
- **搜索引擎**: Elasticsearch
- **容器化**: Docker + Kubernetes
- **缓存**: Redis
- **安全**: JWT, HTTPS, 端到端加密

详细架构请参考 [技术架构文档](docs/architecture/bangbang_technical_design.txt)

## 开发环境搭建

### 前提条件

- Java 11+
- Node.js 16+
- Docker & Docker Compose
- MySQL 8.0+
- Redis 6.0+
- Elasticsearch 7.x

### 本地开发环境设置

1. 克隆代码库

```bash
git clone https://github.com/yourusername/bangbangDelivery.git
cd bangbangDelivery
```

2. 后端服务启动

```bash
cd backend
./mvnw clean install
docker-compose up -d  # 启动MySQL, Redis, RabbitMQ等依赖服务
./mvnw spring-boot:run -pl gateway  # 启动网关服务
# 启动其他所需的微服务
```

3. 前端开发环境

```bash
cd frontend/web
npm install
npm start
```

4. 访问应用

前端开发服务器：http://localhost:3000
API网关：http://localhost:8080

## 项目结构

```
bangbangDelivery/
├── frontend/                # 前端代码
├── backend/                 # 后端微服务
├── infrastructure/          # 基础设施即代码
└── docs/                    # 文档
```

详细项目结构请参考 [cursor_rules.md](cursor_rules.md)

## API文档

API文档通过Swagger UI提供，可在开发环境中访问：

```
http://localhost:8080/swagger-ui.html
```

## 贡献指南

1. Fork项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

请确保您的代码符合我们的代码规范，并且通过所有单元测试。

## 许可证

[MIT License](LICENSE)

## 联系我们

- 官方网站: [https://www.bangbangdelivery.com](https://www.bangbangdelivery.com)
- 邮箱: info@bangbangdelivery.com 