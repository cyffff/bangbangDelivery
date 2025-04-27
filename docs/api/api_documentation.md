# BangBang Delivery API 文档

## API概述

BangBang Delivery API采用RESTful架构，所有请求和响应均使用JSON格式。API基础URL为：

```
https://api.bangbangdelivery.com/api/v1
```

测试环境URL：

```
https://api-test.bangbangdelivery.com/api/v1
```

## 认证

除了公开的API外，所有API调用都需要身份验证。认证使用JWT令牌，在请求头中添加：

```
Authorization: Bearer {jwt_token}
```

获取令牌的方式：

```
POST /auth/login
```

## 错误处理

API使用标准HTTP状态码表示请求状态，并在响应体中提供详细错误信息：

```json
{
  "code": "ERROR_CODE",
  "message": "错误描述",
  "details": {
    "field1": "字段相关错误信息"
  },
  "timestamp": "2023-08-10T12:34:56Z"
}
```

## 主要API端点

### 用户服务

#### 注册新用户

```
POST /users/register
```

请求体：

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phoneNumber": "string"
}
```

#### 获取用户信息

```
GET /users/{userId}/profile
```

#### 更新用户信息

```
PUT /users/{userId}/profile
```

### 需求服务

#### 创建需求

```
POST /demands
```

请求体：

```json
{
  "title": "string",
  "description": "string",
  "itemType": "string",
  "weightKg": 0.0,
  "estimatedValue": 0.0,
  "originCountry": "string",
  "originCity": "string",
  "destinationCountry": "string",
  "destinationCity": "string",
  "deadline": "2023-12-31",
  "rewardAmount": 0.0
}
```

#### 获取需求列表

```
GET /demands
```

查询参数：

- `page`: 页码，默认0
- `size`: 每页数量，默认20
- `sort`: 排序字段
- `originCountry`: 起始国家
- `destinationCountry`: 目的国家
- `itemType`: 物品类型
- `status`: 需求状态

### 行程服务

#### 创建行程

```
POST /journeys
```

请求体：

```json
{
  "departureCountry": "string",
  "departureCity": "string",
  "destinationCountry": "string",
  "destinationCity": "string",
  "departureDate": "2023-08-15",
  "arrivalDate": "2023-08-20",
  "availableWeightKg": 0.0,
  "preferredItemTypes": ["string"],
  "notes": "string"
}
```

#### 搜索行程

```
GET /journeys/search
```

查询参数：

- `departureCountry`: 出发国家
- `destinationCountry`: 目的国家
- `fromDate`: 起始日期
- `toDate`: 结束日期
- `minWeight`: 最小重量
- `page`: 页码
- `size`: 每页数量

### 匹配服务

#### 获取需求匹配的行程

```
GET /matching/demands/{demandId}/journeys
```

#### 获取行程匹配的需求

```
GET /matching/journeys/{journeyId}/demands
```

#### 获取推荐匹配

```
POST /matching/suggest
```

### 订单服务

#### 创建订单

```
POST /orders
```

请求体：

```json
{
  "demandId": "string",
  "journeyId": "string",
  "itemDescription": "string",
  "weightKg": 0.0,
  "itemValue": 0.0,
  "notes": "string"
}
```

#### 更新订单状态

```
PUT /orders/{orderId}/status
```

请求体：

```json
{
  "status": "string",
  "comment": "string"
}
```

### 支付服务

#### 创建支付

```
POST /payments/create
```

请求体：

```json
{
  "orderId": "string",
  "paymentMethod": "string",
  "currency": "string"
}
```

#### 查询支付状态

```
GET /payments/{paymentId}
```

### 消息服务

#### 获取会话列表

```
GET /messages/conversations
```

#### 获取会话历史消息

```
GET /messages/history/{conversationId}
```

查询参数：

- `before`: 时间戳
- `limit`: 消息数量

### KYC服务

#### 上传身份证明文件

```
POST /kyc/upload-documents
```

#### 人脸验证

```
POST /kyc/face-verification
```

### 评价服务

#### 提交评价

```
POST /reviews
```

请求体：

```json
{
  "orderId": "string",
  "revieweeId": "string",
  "rating": 5,
  "reliabilityScore": 5,
  "communicationScore": 5,
  "comment": "string"
}
```

#### 获取用户评价

```
GET /reviews/user/{userId}
```

## 分页响应格式

分页查询统一返回格式：

```json
{
  "content": [
    // 数据项
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "sorted": true,
      "unsorted": false
    }
  },
  "totalElements": 100,
  "totalPages": 5,
  "last": false,
  "first": true,
  "size": 20,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false
  },
  "numberOfElements": 20,
  "empty": false
}
```

## API版本控制

API版本控制通过URL路径实现，当前版本为v1。未来可能会引入新版本，如：

```
https://api.bangbangdelivery.com/api/v2/...
```

## 速率限制

为保护平台安全，API实施速率限制：

- 匿名IP：每分钟60个请求
- 已认证用户：每分钟300个请求

超出限制将返回HTTP 429状态码。 