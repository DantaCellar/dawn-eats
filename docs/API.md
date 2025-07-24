# Dawn Eats API 文档

## 概述

Dawn Eats 后端 API 基于 FastAPI 构建，提供完整的早餐应用功能支持，包括用户管理、内容分享和食谱管理等功能。

## 基础信息

- **Base URL**: `http://localhost:8000/api/v1`
- **技术栈**: FastAPI + SQLAlchemy + SQLite
- **认证方式**: JWT Token (Bearer)
- **数据格式**: JSON
- **API 文档**: `http://localhost:8000/docs` (Swagger UI)
- **Token 过期时间**: 30分钟

## 认证

需要认证的接口在请求头中包含 JWT token：

```
Authorization: Bearer <your-jwt-token>
```

获取 token 需要先登录，登录成功后会返回 `access_token`。

## 核心接口

### 健康检查
```
GET /health
```
检查服务状态，无需认证。

### 用户管理接口

#### 用户注册
```
POST /users/register
```

**请求体**:
```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string"
}
```

**响应**:
```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00"
}
```

#### 用户登录
```
POST /users/login
```

**请求体** (表单格式):
```
username: user@example.com
password: string
```

**响应**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### 获取用户资料
```
GET /users/profile
```
**需要认证**

**响应**:
```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00"
}
```

### 早餐分享接口

#### 获取所有分享
```
GET /posts/?skip=0&limit=10
```

**查询参数**:
- `skip`: 跳过条数 (默认: 0)
- `limit`: 返回条数 (默认: 10)

**响应**:
```json
[
  {
    "id": 1,
    "title": "美味早餐",
    "description": "今天的早餐很棒",
    "image_url": "http://example.com/image.jpg",
    "user_id": 1,
    "created_at": "2024-01-01T00:00:00",
    "user": {
      "id": 1,
      "username": "用户名"
    }
  }
]
```

#### 创建早餐分享
```
POST /posts/
```
**需要认证**

**请求体**:
```json
{
  "title": "string",
  "description": "string",
  "image_url": "string"
}
```

#### 获取单个分享
```
GET /posts/{post_id}
```

### 食谱管理接口

#### 获取所有食谱
```
GET /recipes/?skip=0&limit=10
```

**查询参数**:
- `skip`: 跳过条数 (默认: 0)
- `limit`: 返回条数 (默认: 10)

**响应**:
```json
[
  {
    "id": 1,
    "title": "简单煎蛋",
    "description": "快手早餐煎蛋",
    "ingredients": ["鸡蛋", "盐", "油"],
    "instructions": "步骤说明",
    "nutrition_info": {
      "calories": 200,
      "protein": 15,
      "carbs": 2
    },
    "user_id": 1,
    "created_at": "2024-01-01T00:00:00",
    "user": {
      "id": 1,
      "username": "用户名"
    }
  }
]
```

#### 创建食谱
```
POST /recipes/
```
**需要认证**

**请求体**:
```json
{
  "title": "string",
  "description": "string",
  "ingredients": ["string"],
  "instructions": "string",
  "nutrition_info": {
    "calories": 200,
    "protein": 15,
    "carbs": 10
  }
}
```

#### 获取单个食谱
```
GET /recipes/{recipe_id}
```

## 错误处理

API 使用标准的 HTTP 状态码：

- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未认证或 token 无效
- `404`: 资源未找到
- `422`: 验证错误
- `500`: 服务器内部错误

**错误响应示例**:
```json
{
  "detail": "错误描述"
}
```

## 数据模型

### User (用户)
```json
{
  "id": "integer",
  "username": "string",
  "email": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Post (早餐分享)
```json
{
  "id": "integer",
  "title": "string",
  "description": "string", 
  "image_url": "string",
  "user_id": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Recipe (食谱)
```json
{
  "id": "integer",
  "title": "string",
  "description": "string",
  "ingredients": ["string"],
  "instructions": "string",
  "nutrition_info": "object",
  "user_id": "integer", 
  "created_at": "datetime",
  "updated_at": "datetime"
}
```