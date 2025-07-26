# Dawn Eats 架构设计

## 系统架构概览

Dawn Eats 采用前后端分离的架构设计，包含以下主要组件：

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │ FastAPI Backend │    │     SQLite      │
│    Frontend     │◄──►│   (Python)      │◄──►│    Database     │
│   (Expo + TS)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                        │
          │              ┌─────────────────┐
          └─────────────►│  Swagger UI     │
                         │  API Docs       │
                         └─────────────────┘
```

## 前端架构

### 技术栈
- **React Native**: 跨平台移动应用框架 (0.72.0)
- **TypeScript**: 类型安全的 JavaScript (5.1.3)
- **Expo**: 开发工具链和平台服务 (~49.0.0)
- **React Navigation**: 底部标签页导航 (v6)
- **React Native Web**: Web 平台支持
- **Context API**: 全局状态管理

### 目录结构
```
frontend/
├── src/
│   ├── contexts/       # React Context (Auth)
│   ├── screens/        # 页面组件
│   │   ├── auth/       # 认证相关页面
│   │   └── main/       # 主要功能页面
│   ├── navigation/     # 导航配置
│   ├── services/       # API 服务层
│   └── types/          # TypeScript 类型定义
├── assets/             # 静态资源 (图标、启动页)
├── App.tsx            # 应用入口
└── package.json       # 依赖配置
```

### 核心页面
- **WelcomeScreen**: 欢迎页面
- **LoginScreen / RegisterScreen**: 用户认证
- **HomeScreen**: 早餐分享信息流
- **PostScreen**: 创建分享内容
- **DiscoverScreen**: 发现食谱和美食
- **ProfileScreen**: 用户个人资料

## 后端架构

### 技术栈
- **Python**: 现代后端开发语言 (3.12+)
- **FastAPI**: 高性能 Web 框架
- **SQLAlchemy**: ORM 框架 (2.0)
- **Alembic**: 数据库迁移工具
- **SQLite**: 轻量级数据库 (开发环境)
- **JWT**: 身份认证 (python-jose)
- **BCrypt**: 密码哈希
- **Pydantic**: 数据验证和序列化
- **uv**: 现代 Python 包管理器

### 目录结构
```
backend/
├── app/
│   ├── routers/        # API 路由模块
│   │   ├── users.py    # 用户管理接口
│   │   ├── posts.py    # 早餐分享接口
│   │   └── recipes.py  # 食谱管理接口
│   ├── models.py       # SQLAlchemy 数据模型
│   ├── schemas.py      # Pydantic 验证模式
│   ├── database.py     # 数据库连接配置
│   └── auth.py         # JWT 认证工具
├── main.py            # FastAPI 应用入口
├── pyproject.toml     # uv 项目配置
└── dawn_eats.db      # SQLite 数据库文件
```

### API 路由设计
- **用户管理**: `/api/v1/users/` - 注册、登录、个人资料
- **早餐分享**: `/api/v1/posts/` - CRUD 操作，支持分页
- **食谱管理**: `/api/v1/recipes/` - CRUD 操作，支持分页
- **系统**: `/health` - 健康检查

## 数据库设计

### 核心表结构

#### 用户表 (users)
- `id` (Integer, Primary Key, Auto Increment)
- `username` (String, Unique, Not Null)
- `email` (String, Unique, Not Null)
- `password_hash` (String, Not Null)
- `created_at` (DateTime, Default: 当前时间)
- `updated_at` (DateTime, Auto Update)

#### 早餐分享表 (posts)
- `id` (Integer, Primary Key, Auto Increment)
- `title` (String, Not Null)
- `description` (Text, Nullable)
- `image_url` (String, Nullable)
- `user_id` (Integer, Foreign Key → users.id)
- `created_at` (DateTime, Default: 当前时间)
- `updated_at` (DateTime, Auto Update)

#### 食谱表 (recipes)
- `id` (Integer, Primary Key, Auto Increment)
- `title` (String, Not Null)
- `description` (Text, Nullable)
- `ingredients` (JSON Array, 食材列表)
- `instructions` (Text, 制作步骤)
- `nutrition_info` (JSON Object, 营养信息)
- `user_id` (Integer, Foreign Key → users.id)
- `created_at` (DateTime, Default: 当前时间)
- `updated_at` (DateTime, Auto Update)

### 关系设计
- 用户与分享：一对多关系 (User → Posts)
- 用户与食谱：一对多关系 (User → Recipes)
- 支持级联查询，返回用户基本信息

## 开发环境

### 启动方式
```bash
# 完整环境启动
./bootstrap.sh

# 仅 iOS 模拟器
./bootstrap.sh --ios

# 仅 Web 浏览器
./bootstrap.sh --web

# 手动启动后端
cd backend && uv run uvicorn main:app --reload

# 手动启动前端
cd frontend && npm start
```

### 服务端口
- **后端 API**: `http://localhost:8000`
- **API 文档**: `http://localhost:8000/docs`
- **前端 Web**: `http://localhost:19006`
- **前端 Metro**: `http://localhost:8081`

## API 设计原则

1. **RESTful**: 遵循 REST 架构风格
2. **版本控制**: 使用 URL 路径版本控制 (`/api/v1/`)
3. **统一响应格式**: FastAPI 自动序列化为 JSON
4. **错误处理**: HTTP 状态码 + 详细错误信息
5. **认证授权**: JWT Bearer Token 机制
6. **数据验证**: Pydantic 模型自动验证
7. **API 文档**: 自动生成 Swagger UI 文档

## 安全考虑

### 认证安全
- 密码使用 BCrypt 哈希存储 (成本因子: 12)
- JWT Token 30分钟过期时间
- 从环境变量读取密钥 (`SECRET_KEY`)

### 数据安全
- Pydantic 模型进行输入验证
- SQLAlchemy ORM 防止 SQL 注入
- CORS 中间件配置跨域访问

### 部署安全
- 数据库连接支持环境变量配置
- 敏感信息不硬编码
- 支持 HTTPS 部署

## 性能优化

### 数据库优化
- SQLAlchemy 连接池管理
- 自动创建必要索引 (主键、外键、唯一约束)
- 分页查询避免大量数据传输

### API 优化  
- FastAPI 异步处理提升并发能力
- 关联查询减少 N+1 问题
- 响应模型优化传输数据

### 前端优化
- TypeScript 类型检查减少运行时错误
- Context API 避免不必要的重渲染
- Expo 优化的构建和热更新