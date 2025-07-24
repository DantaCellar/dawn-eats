# Dawn Eats 项目文档

欢迎来到 Dawn Eats (旦食) 项目文档！本目录包含了项目的完整技术文档和使用指南。

## 📚 文档索引

### 📖 核心文档

| 文档 | 描述 | 适用对象 |
|------|------|----------|
| [API.md](API.md) | 完整的 API 接口文档 | 前端开发者、集成开发者 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 系统架构和技术栈说明 | 架构师、全栈开发者 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 贡献指南和开发规范 | 所有贡献者 |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 生产环境部署指南 | DevOps 工程师、运维人员 |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 常见问题和故障排除 | 所有开发者、运维人员 |

### 🚀 快速开始

如果你是第一次接触这个项目，推荐按以下顺序阅读文档：

1. **项目概览** → [ARCHITECTURE.md](ARCHITECTURE.md) - 了解整体架构
2. **开发环境** → [CONTRIBUTING.md](CONTRIBUTING.md) - 设置开发环境
3. **API 接口** → [API.md](API.md) - 了解后端接口
4. **问题解决** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 遇到问题时参考

### 📋 文档概览

#### 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md)
**系统架构设计文档**
- 前后端技术栈详解 (React Native + FastAPI)
- 数据库设计 (SQLite/PostgreSQL)
- 目录结构说明
- API 路由设计
- 安全性考虑
- 性能优化策略

#### 🔌 [API.md](API.md)
**API 接口完整文档**
- 基础信息和认证机制
- 用户管理接口 (注册、登录、资料)
- 早餐分享接口 (CRUD 操作)
- 食谱管理接口 (CRUD 操作)
- 数据模型定义
- 错误处理和状态码

#### 🤝 [CONTRIBUTING.md](CONTRIBUTING.md)
**开发者贡献指南**
- 开发环境快速设置
- 代码规范 (Python/TypeScript)
- Git 工作流和提交规范
- Pull Request 流程
- 测试策略
- 问题报告模板

#### 🚀 [DEPLOYMENT.md](DEPLOYMENT.md)
**生产环境部署指南**
- 服务器环境配置
- Docker 容器化部署
- 数据库设置 (PostgreSQL)
- Nginx 反向代理配置
- SSL 证书配置
- CI/CD 自动化部署
- 监控和日志管理

#### 🔧 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
**故障排除和问题解决**
- 开发环境常见问题
- 后端服务问题诊断
- 前端应用问题解决
- 数据库问题处理
- 部署问题排查
- 性能优化建议

## 🛠️ 项目技术栈

### 后端 (Backend)
- **语言**: Python 3.12+
- **框架**: FastAPI
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: SQLAlchemy 2.0
- **认证**: JWT (JSON Web Tokens)
- **包管理**: uv

### 前端 (Frontend)
- **框架**: React Native 0.72.0
- **开发工具**: Expo ~49.0.0
- **语言**: TypeScript 5.1.3
- **导航**: React Navigation v6
- **状态管理**: React Context API
- **平台支持**: iOS / Android / Web

## 🏃‍♂️ 快速启动

### 一键启动开发环境
```bash
# 克隆项目
git clone <repository-url>
cd dawn-eats

# 使用 bootstrap 脚本自动配置
./bootstrap.sh

# 或者指定平台
./bootstrap.sh --ios    # iOS 模拟器
./bootstrap.sh --web    # Web 浏览器
```

### 手动启动
```bash
# 后端
cd backend
uv sync
uv run uvicorn main:app --reload

# 前端
cd frontend
npm install
npm start
```

## 📱 支持平台

- **iOS**: iPhone/iPad 应用 (通过 App Store)
- **Android**: Android 手机/平板应用 (通过 Play Store)
- **Web**: 响应式 Web 应用 (浏览器访问)

## 🌟 主要功能

### 用户功能
- ✅ 用户注册和登录
- ✅ JWT 身份认证
- ✅ 个人资料管理

### 内容分享
- ✅ 早餐照片和描述分享
- ✅ 分享内容浏览和搜索
- ✅ 分页加载优化

### 食谱管理
- ✅ 食谱创建和编辑
- ✅ 食材列表管理
- ✅ 营养信息记录
- ✅ 制作步骤说明

### 技术特性
- ✅ RESTful API 设计
- ✅ 自动 API 文档生成 (Swagger UI)
- ✅ 跨平台支持 (移动端 + Web)
- ✅ 响应式设计
- ✅ 类型安全 (TypeScript)

## 🔗 相关链接

### 开发资源
- **API 文档**: http://localhost:8000/docs (开发环境)
- **前端预览**: http://localhost:19006 (Web 版本)
- **后端健康检查**: http://localhost:8000/health

### 技术文档
- [FastAPI 官方文档](https://fastapi.tiangolo.com/)
- [React Native 官方文档](https://reactnative.dev/)
- [Expo 官方文档](https://docs.expo.dev/)
- [SQLAlchemy 官方文档](https://docs.sqlalchemy.org/)

### 工具链
- [uv - Python 包管理器](https://docs.astral.sh/uv/)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)

## 🤖 开发工具

### 推荐的 IDE 和插件
- **后端开发**: VS Code + Python Extension
- **前端开发**: VS Code + React Native Tools
- **数据库**: DBeaver 或 pgAdmin

### 必要的命令行工具
```bash
# 检查环境
node --version     # >= 18.x
python3 --version  # >= 3.12
uv --version       # 最新版本
```

## 📧 联系和支持

### 获取帮助
1. **文档优先**: 查看相关文档解决问题
2. **搜索 Issues**: 在 GitHub Issues 中搜索类似问题
3. **创建 Issue**: 如果找不到解决方案，创建新的 Issue
4. **社区讨论**: 参与 GitHub Discussions

### 贡献代码
1. Fork 项目到你的 GitHub 账号
2. 阅读 [贡献指南](CONTRIBUTING.md)
3. 创建功能分支进行开发
4. 提交 Pull Request

### 报告 Bug
使用 [问题报告模板](CONTRIBUTING.md#bug-报告模板) 提供详细信息：
- 详细的问题描述
- 完整的复现步骤  
- 期望和实际行为对比
- 环境信息 (OS、版本等)
- 相关截图或日志

---

## 📅 文档更新历史

| 日期 | 变更内容 | 更新者 |
|------|----------|--------|
| 2024-01-XX | 创建完整的项目文档集 | 开发团队 |
| 2024-01-XX | 更新 API 文档以匹配实际实现 | 开发团队 |
| 2024-01-XX | 添加部署指南和故障排除文档 | 开发团队 |

---

**💡 提示**: 文档会随着项目发展持续更新。如果你发现任何过时或不准确的信息，欢迎提交 Issue 或 Pull Request！