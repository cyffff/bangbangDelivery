# BangBang Delivery 开发指南

本文档为BangBang Delivery平台的开发者提供详细的开发指南，包括环境搭建、代码规范、工作流程等内容。

## 目录

1. [开发环境配置](#1-开发环境配置)
2. [项目架构](#2-项目架构)
3. [开发流程](#3-开发流程)
4. [代码规范](#4-代码规范)
5. [测试指南](#5-测试指南)
6. [部署流程](#6-部署流程)
7. [常见问题](#7-常见问题)

## 1. 开发环境配置

### 1.1 必要软件

- JDK 11+
- Maven 3.6+
- Node.js 16+
- Docker & Docker Compose
- Git
- 推荐IDE：IntelliJ IDEA（后端）, VS Code（前端）

### 1.2 环境变量配置

```bash
# 开发环境相关变量
export BANGBANG_ENV=dev
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export REDIS_HOST=localhost
export REDIS_PORT=6379
export ES_HOST=localhost
export ES_PORT=9200
```

### 1.3 数据库配置

```bash
# 创建本地开发数据库
mysql -u root -p
CREATE DATABASE bangbang_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bangbang'@'localhost' IDENTIFIED BY 'bangbang_password';
GRANT ALL PRIVILEGES ON bangbang_dev.* TO 'bangbang'@'localhost';
FLUSH PRIVILEGES;
```

### 1.4 Docker环境配置

使用docker-compose启动依赖服务：

```yaml
# backend/docker-compose.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: bangbang_dev
      MYSQL_USER: bangbang
      MYSQL_PASSWORD: bangbang_password
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:6.2
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.14.0
    ports:
      - "9200:9200"
      - "9300:9300"
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  rabbitmq:
    image: rabbitmq:3.9-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: bangbang
      RABBITMQ_DEFAULT_PASS: bangbang_password
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

volumes:
  mysql_data:
  redis_data:
  es_data:
  rabbitmq_data:
```

运行：

```bash
cd backend
docker-compose up -d
```

## 2. 项目架构

### 2.1 微服务架构

BangBang Delivery采用微服务架构，每个服务负责特定业务领域：

| 服务名称 | 职责 | 关键技术 |
|---------|------|---------|
| gateway | API网关，请求路由，认证 | Spring Cloud Gateway |
| auth-service | 认证鉴权 | Spring Security, JWT |
| user-service | 用户管理 | Spring Boot |
| demand-service | 需求管理 | Spring Boot |
| journey-service | 行程管理 | Spring Boot |
| matching-service | 需求与行程匹配 | Elasticsearch |
| order-service | 订单管理 | Spring Boot |
| payment-service | 支付处理 | 支付接口集成 |
| messaging-service | 即时通讯 | WebSocket |
| kyc-service | 身份验证 | OCR, 人脸识别 |
| review-service | 评价管理 | Spring Boot |
| notification-service | 通知推送 | WebSocket, 短信 |

### 2.2 前端架构

前端采用React + TypeScript + Redux架构：

```
frontend/web/
├── public/               # 静态资源
├── src/
│   ├── api/              # API请求
│   ├── assets/           # 图片等资源
│   ├── components/       # 共用组件
│   ├── config/           # 配置文件
│   ├── hooks/            # 自定义Hooks
│   ├── layouts/          # 页面布局
│   ├── pages/            # 页面组件
│   ├── routes/           # 路由定义
│   ├── store/            # Redux状态
│   ├── types/            # TypeScript类型
│   ├── utils/            # 工具函数
│   ├── App.tsx           # 根组件
│   └── index.tsx         # 入口文件
```

## 3. 开发流程

### 3.1 Git工作流

我们采用GitFlow工作流：

- `main`: 生产环境代码
- `develop`: 开发环境主分支
- `feature/*`: 功能开发分支
- `release/*`: 发布分支
- `hotfix/*`: 紧急修复分支

基本流程：

1. 从`develop`分支创建功能分支：`git checkout -b feature/xxx`
2. 开发并提交代码：`git commit -m "feat: xxx"`
3. 将代码推送到远程：`git push origin feature/xxx`
4. 创建合并请求(PR)到`develop`分支
5. 代码审查通过后合并

### 3.2 分支命名规范

- 功能分支：`feature/module-description`
- 修复分支：`fix/module-description`
- 优化分支：`optimize/module-description`
- 文档分支：`docs/description`

### 3.3 提交信息规范

采用[Conventional Commits](https://www.conventionalcommits.org/)规范：

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

类型(type)：

- `feat`: 新功能
- `fix`: 修复Bug
- `docs`: 文档更新
- `style`: 代码风格修改，不影响功能
- `refactor`: 重构，不新增功能也不修复Bug
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动

示例：

```
feat(matching): 实现基于地理位置的匹配算法

- 添加基于Elasticsearch的地理位置查询
- 优化匹配评分算法

Ref #123
```

### 3.4 Code Review流程

1. 提交PR后，分配至少1名审查者
2. 审查者关注：
   - 代码质量与风格
   - 功能完整性
   - 测试覆盖
   - 性能影响
3. 解决所有评论和反馈
4. 获得批准后合并

## 4. 代码规范

### 4.1 Java编码规范

- 遵循[Google Java风格指南](https://google.github.io/styleguide/javaguide.html)
- 文件编码：UTF-8
- 缩进：4个空格
- 行长度：100字符
- 方法最大长度：50行
- 类最大长度：500行

#### 命名规范

- 包名：小写，如`com.bangbang.user`
- 类名：大驼峰，如`UserService`
- 接口名：大驼峰，通常使用形容词，如`Readable`
- 方法名：小驼峰，如`getUserById`
- 变量名：小驼峰，如`userId`
- 常量名：全大写下划线分隔，如`MAX_COUNT`

#### 代码结构

服务模块基本结构：

```
service/
├── config/           # 配置类
├── controller/       # 控制器
├── service/          # 业务逻辑
│   ├── impl/         # 接口实现
├── repository/       # 数据访问
├── entity/           # 数据实体
├── dto/              # 数据传输对象
├── mapper/           # 对象映射
├── exception/        # 异常类
└── util/             # 工具类
```

### 4.2 TypeScript/React编码规范

- 遵循[Airbnb React/JSX Style Guide](https://airbnb.io/javascript/react/)
- 文件编码：UTF-8
- 缩进：2个空格
- 行长度：80字符
- 文件最大长度：300行

#### 命名规范

- 文件名：组件使用大驼峰，如`UserProfile.tsx`
- 非组件文件使用小驼峰，如`apiService.ts`
- 组件名：大驼峰，如`UserProfile`
- 函数名：小驼峰，如`handleSubmit`
- 变量名：小驼峰，如`userData`
- 常量名：全大写下划线分隔，如`API_URL`

#### 组件结构

```tsx
// 导入依赖
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// 导入类型
import { User } from '@/types';

// 导入组件
import { Card, Avatar } from 'antd';

// 导入样式
import styles from './UserCard.module.css';

// 组件属性定义
interface UserCardProps {
  userId: string;
  showDetails?: boolean;
}

// 组件实现
export const UserCard: React.FC<UserCardProps> = ({ userId, showDetails = false }) => {
  // 状态和钩子
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  // 副作用
  useEffect(() => {
    // 实现逻辑
  }, [userId]);
  
  // 事件处理
  const handleClick = () => {
    // 实现逻辑
  };
  
  // 渲染
  return (
    <Card className={styles.card} onClick={handleClick}>
      {/* 组件内容 */}
    </Card>
  );
};

// 默认导出
export default UserCard;
```

## 5. 测试指南

### 5.1 后端测试

#### 单元测试

使用JUnit 5和Mockito进行单元测试：

```java
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserServiceImpl userService;
    
    @Test
    public void testGetUserById() {
        // Arrange
        String userId = "123";
        User expectedUser = new User();
        expectedUser.setId(userId);
        expectedUser.setUsername("testuser");
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(expectedUser));
        
        // Act
        User result = userService.getUserById(userId);
        
        // Assert
        assertNotNull(result);
        assertEquals(userId, result.getId());
        assertEquals("testuser", result.getUsername());
        
        verify(userRepository).findById(userId);
    }
    
    @Test
    public void testGetUserById_NotFound() {
        // Arrange
        String userId = "nonexistent";
        when(userRepository.findById(userId)).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(userId);
        });
        
        verify(userRepository).findById(userId);
    }
}
```

#### 集成测试

使用Spring Boot Test和TestContainers进行集成测试：

```java
@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
public class UserControllerIntegrationTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
        .withDatabaseName("test")
        .withUsername("test")
        .withPassword("test");
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @BeforeEach
    public void setup() {
        // 初始化测试数据
    }
    
    @Test
    public void testGetUserProfile() {
        // 测试实现
    }
}
```

### 5.2 前端测试

#### 单元测试

使用Jest和React Testing Library：

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import UserCard from './UserCard';

describe('UserCard component', () => {
  test('renders user information correctly', () => {
    render(<UserCard userId="123" username="testuser" />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });
  
  test('shows details when clicked', () => {
    render(<UserCard userId="123" username="testuser" />);
    
    fireEvent.click(screen.getByRole('button', { name: /details/i }));
    
    expect(screen.getByText('User Details')).toBeInTheDocument();
  });
});
```

#### 集成测试

使用Cypress进行端到端测试：

```javascript
describe('User Profile Page', () => {
  beforeEach(() => {
    cy.login('testuser', 'password');
    cy.visit('/profile');
  });
  
  it('displays user information', () => {
    cy.contains('h1', 'User Profile');
    cy.contains('testuser');
  });
  
  it('allows editing profile', () => {
    cy.get('[data-testid=edit-profile-button]').click();
    cy.get('input[name=username]').clear().type('newusername');
    cy.get('[data-testid=save-button]').click();
    
    cy.contains('Profile updated successfully');
    cy.contains('newusername');
  });
});
```

## 6. 部署流程

### 6.1 环境定义

| 环境 | 用途 | 部署周期 |
|-----|-----|---------|
| dev | 开发测试 | 每次提交 |
| test | 测试验证 | 每天 |
| staging | 预发布 | 每周 |
| production | 生产环境 | 每两周 |

### 6.2 CI/CD流程

使用GitHub Actions自动化部署：

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ develop, main ]
  pull_request:
    branches: [ develop ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up JDK 11
        uses: actions/setup-java@v2
        with:
          distribution: 'adopt'
          java-version: '11'
          
      - name: Build and test backend
        run: |
          cd backend
          ./mvnw clean verify
          
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Build and test frontend
        run: |
          cd frontend/web
          npm ci
          npm run build
          npm test
          
  deploy-dev:
    needs: build-and-test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to dev
        # 部署脚本
```

### 6.3 部署架构

```
                     ┌─────────────┐
                     │  CI/CD系统   │
                     └─────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────┐
│              Kubernetes集群                    │
│                                               │
│  ┌─────────┐ ┌─────────┐      ┌─────────┐     │
│  │ 前端Pod  │ │ 网关Pod  │ ... │ 服务Pod  │     │
│  └─────────┘ └─────────┘      └─────────┘     │
│                                               │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │   数据库服务      │  │   Redis/ES服务   │     │
│  └─────────────────┘  └─────────────────┘     │
└───────────────────────────────────────────────┘
```

## 7. 常见问题

### 7.1 开发常见问题

#### Q: 如何处理跨服务调用?
A: 优先使用OpenFeign声明式客户端，定义清晰的API接口。对于复杂交互，考虑使用消息队列实现异步通信。

#### Q: 本地开发如何启动所有服务?
A: 使用项目根目录下的`start-dev.sh`脚本，它会启动必要的Docker容器和核心服务。

#### Q: 如何调试微服务间的调用问题?
A: 使用Zipkin进行分布式追踪，访问`http://localhost:9411`查看调用链。

### 7.2 部署常见问题

#### Q: Kubernetes部署失败如何排查?
A: 检查Pod日志`kubectl logs <pod-name>`，查看事件`kubectl describe pod <pod-name>`，查看服务状态`kubectl get svc`。

#### Q: 数据库迁移策略?
A: 使用Flyway管理数据库版本，迁移脚本存放在`src/main/resources/db/migration`目录。

#### Q: 生产环境出现问题如何回滚?
A: 使用Kubernetes的`kubectl rollout undo deployment/<deployment-name>`命令回滚到上一个版本。

## 附录

### 常用命令

```bash
# 启动开发环境
./start-dev.sh

# 构建所有服务
./mvnw clean package -DskipTests

# 运行单元测试
./mvnw test

# 运行集成测试
./mvnw verify

# 生成API文档
./mvnw spring-doc:generate

# 前端开发
cd frontend/web
npm start

# 前端构建
cd frontend/web
npm run build

# 生成前端分析报告
cd frontend/web
npm run analyze
```

### 有用资源

- [项目Wiki](https://github.com/yourusername/bangbangDelivery/wiki)
- [API文档](http://localhost:8080/swagger-ui.html)
- [开发指南](docs/dev-guide)
- [架构文档](docs/architecture) 