# 贡献指南

感谢你对 Dawn Eats 项目的关注！我们欢迎所有形式的贡献。

## 开发环境设置

### 快速开始

最简单的方式是使用项目根目录的 bootstrap 脚本：

```bash
# 自动安装所有依赖并启动服务
./bootstrap.sh

# 启动 iOS 模拟器版本
./bootstrap.sh --ios

# 启动 Web 浏览器版本 
./bootstrap.sh --web

# 查看帮助
./bootstrap.sh --help
```

### 前端开发环境

#### 系统要求
- Node.js (推荐 v18+)
- npm 或 yarn
- Expo CLI (自动安装)

#### 安装步骤
```bash
cd frontend
npm install

# 启动不同平台
npm start          # Expo 开发服务器
npm run ios        # iOS 模拟器
npm run android    # Android 模拟器/设备  
npm run web        # Web 浏览器

# 代码检查
npm run lint       # ESLint 检查
npm test           # Jest 测试
```

### 后端开发环境

#### 系统要求
- Python 3.12+
- uv (Python 包管理器)

#### 安装步骤
```bash
# 安装 uv (如果未安装)
pip install uv

cd backend
uv sync                    # 安装依赖

# 启动开发服务器
uv run uvicorn main:app --reload

# 数据库迁移
uv run alembic revision --autogenerate -m "description"
uv run alembic upgrade head
```

#### API 文档
启动后端后，访问 `http://localhost:8000/docs` 查看 Swagger UI API 文档。

## 代码规范

### Python/FastAPI 规范
- 使用 Black 格式化代码
- 遵循 PEP 8 代码风格
- 类型提示使用 Python 3.10+ 语法
- Pydantic 模型用于数据验证
- SQLAlchemy 2.0 语法
- 异步函数优先

#### 代码示例
```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.post("/", response_model=schemas.PostResponse)
async def create_post(
    post: schemas.PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return await crud.create_post(db, post, current_user.id)
```

### TypeScript/React Native 规范
- 使用 ESLint + Prettier
- 组件命名使用 PascalCase
- 文件命名使用 camelCase
- 类型优先，减少 any 使用
- 函数组件优先
- Hook 命名以 use 开头

#### 代码示例
```typescript
interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  
  return (
    <View style={styles.container}>
      {/* 组件内容 */}
    </View>
  );
};
```

## 项目结构

### 目录说明
```
dawn-eats/
├── frontend/               # React Native 前端
│   ├── src/
│   │   ├── contexts/      # React Context (认证等)
│   │   ├── screens/       # 页面组件
│   │   ├── navigation/    # 导航配置
│   │   ├── services/      # API 调用服务
│   │   └── types/         # TypeScript 类型
│   └── assets/            # 静态资源
├── backend/               # FastAPI 后端
│   ├── app/
│   │   ├── routers/       # API 路由
│   │   ├── models.py      # 数据库模型
│   │   ├── schemas.py     # Pydantic 模式
│   │   ├── auth.py        # 认证逻辑
│   │   └── database.py    # 数据库配置
│   └── main.py           # 应用入口
├── docs/                  # 项目文档
└── bootstrap.sh          # 开发环境启动脚本
```

## 开发工作流

### 新功能开发
1. **创建 Issue**: 描述要开发的功能
2. **创建分支**: `git checkout -b feature/功能名称`
3. **开发代码**: 按照代码规范进行开发
4. **测试验证**: 本地测试功能是否正常
5. **提交代码**: 使用规范的 commit 信息
6. **创建 PR**: 详细描述变更内容

### 测试策略
- **后端测试**: 使用 pytest 进行 API 测试
- **前端测试**: 使用 Jest + React Native Testing Library
- **集成测试**: 确保前后端协作正常
- **手动测试**: 在不同平台验证功能

## 提交规范

使用 Conventional Commits 格式：

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 类型说明
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整 (不影响功能)
- `refactor`: 重构 (不改变外部行为)
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动

### 作用域示例
- `frontend`: 前端相关
- `backend`: 后端相关
- `auth`: 认证功能
- `api`: API 接口
- `ui`: 用户界面
- `db`: 数据库相关

### 提交示例
```bash
feat(frontend): add user profile screen
fix(backend): resolve jwt token expiration issue
docs(api): update authentication endpoints documentation
style(frontend): format code with prettier
refactor(backend): optimize database query performance
```

## Pull Request 流程

1. **Fork 项目** 到你的 GitHub 账号
2. **Clone 到本地**:
   ```bash
   git clone https://github.com/yourusername/dawn-eats.git
   cd dawn-eats
   ```
3. **创建功能分支**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **开发并测试** 你的功能
5. **提交更改**:
   ```bash
   git add .
   git commit -m 'feat: add amazing feature'
   ```
6. **推送到远程**:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **创建 Pull Request** 并填写详细描述

### PR 检查清单
- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 所有测试通过
- [ ] 更新了相关文档
- [ ] 功能在不同平台测试正常
- [ ] commit 信息符合规范

## 问题报告

使用 GitHub Issues 报告问题时，请包含：

### Bug 报告模板
- **问题描述**: 详细描述遇到的问题
- **复现步骤**: 逐步列出如何重现问题
- **预期行为**: 描述期望的正确行为
- **实际行为**: 描述实际发生的错误行为
- **环境信息**: 
  - 操作系统版本
  - Node.js/Python 版本
  - 设备信息 (iOS/Android/Web)
- **截图/日志**: 如果有助于理解问题

### 功能请求模板
- **功能描述**: 详细描述想要的功能
- **使用场景**: 解释为什么需要这个功能
- **解决方案**: 提出你认为的实现方式
- **替代方案**: 其他可能的解决方案

## 联系方式

如有疑问，请通过以下方式联系：
- **GitHub Issues**: 报告 bug 和功能请求
- **GitHub Discussions**: 技术讨论和问答
- **项目维护者**: 通过 GitHub 私信联系

## 致谢

感谢所有为 Dawn Eats 项目做出贡献的开发者！