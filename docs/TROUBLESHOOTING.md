# Dawn Eats 故障排除指南

本文档提供了 Dawn Eats 项目开发和部署过程中常见问题的解决方案。

## 开发环境问题

### Bootstrap 脚本问题

#### 问题：`./bootstrap.sh: Permission denied`
**原因**: 脚本没有执行权限
**解决方案**:
```bash
chmod +x bootstrap.sh
./bootstrap.sh
```

#### 问题：`uv: command not found`
**原因**: 未安装 uv 包管理器
**解决方案**:
```bash
# 使用 pip 安装
pip install uv

# 或使用官方安装脚本
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### 问题：`npm: command not found`
**原因**: 未安装 Node.js 和 npm
**解决方案**:
```bash
# macOS (使用 Homebrew)
brew install node

# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# 或下载官方安装包
# https://nodejs.org/
```

### 后端问题

#### 问题：`ModuleNotFoundError: No module named 'app'`
**原因**: Python 路径或虚拟环境问题
**解决方案**:
```bash
cd backend
uv sync
uv run uvicorn main:app --reload
```

#### 问题：数据库连接失败
**症状**: `sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) no such table`
**解决方案**:
```bash
cd backend
# 创建数据库表
uv run python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"

# 或使用 Alembic 迁移
uv run alembic upgrade head
```

#### 问题：JWT Token 验证失败
**症状**: `401 Unauthorized` 错误
**解决方案**:
1. 确保设置了 `SECRET_KEY` 环境变量：
```bash
export SECRET_KEY="your-secret-key-here"
```

2. 检查 token 格式：
```bash
# 正确格式
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 问题：CORS 错误
**症状**: 前端无法访问后端 API
**解决方案**:
检查 `main.py` 中的 CORS 设置：
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:19006", "http://localhost:3000"],  # 添加前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 前端问题

#### 问题：`Command failed: npm install`
**原因**: 网络问题或 npm 缓存损坏
**解决方案**:
```bash
cd frontend
# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 问题：Expo 开发服务器无法启动
**症状**: `Error: Cannot find module '@expo/cli'`
**解决方案**:
```bash
# 全局安装 Expo CLI
npm install -g @expo/cli

# 或本地安装
cd frontend
npm install @expo/cli
```

#### 问题：iOS 模拟器无法启动
**症状**: `iOS Simulator not found`
**解决方案**:
1. 确保已安装 Xcode
2. 打开 Xcode 并下载 iOS 模拟器
3. 在命令行中运行：
```bash
sudo xcode-select --install
```

#### 问题：Android 模拟器无法连接
**解决方案**:
1. 确保 Android Studio 已安装
2. 创建并启动 AVD (Android Virtual Device)
3. 设置环境变量：
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### 问题：Web 版本依赖缺失
**症状**: `CommandError: It looks like you're trying to use web support but don't have the required dependencies installed`
**解决方案**:
```bash
cd frontend
npx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/webpack-config@^19.0.0
```

### API 调用问题

#### 问题：网络请求失败
**症状**: `Network request failed` 或 `TypeError: Network request failed`
**解决方案**:
1. 检查后端服务是否运行：
```bash
curl http://localhost:8000/health
```

2. 检查前端 API 配置：
```typescript
// src/services/api.ts
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

3. 对于 iOS 模拟器，使用 localhost；对于 Android 模拟器，使用 10.0.2.2

#### 问题：认证 Token 过期
**症状**: `401 Unauthorized` 在已登录状态下
**解决方案**:
实现自动刷新 token 或要求用户重新登录：
```typescript
// 在 API 拦截器中处理
if (response.status === 401) {
  // 清除本地 token
  await AsyncStorage.removeItem('access_token');
  // 跳转到登录页面
  navigation.navigate('Login');
}
```

## 数据库问题

### SQLite 问题

#### 问题：`database is locked`
**原因**: 多个进程同时访问数据库
**解决方案**:
1. 确保没有多个后端进程运行：
```bash
ps aux | grep uvicorn
kill <process_id>
```

2. 删除 `.db-journal` 文件：
```bash
rm -f backend/dawn_eats.db-journal
```

#### 问题：数据库文件权限错误
**解决方案**:
```bash
cd backend
chmod 664 dawn_eats.db
chown $USER:$USER dawn_eats.db
```

### PostgreSQL 问题 (生产环境)

#### 问题：连接被拒绝
**解决方案**:
1. 检查 PostgreSQL 服务状态：
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

2. 检查连接配置：
```bash
# 编辑 pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# 添加或修改
local   all             all                                     md5
```

#### 问题：密码认证失败
**解决方案**:
```sql
-- 连接到 PostgreSQL
sudo -u postgres psql

-- 修改密码
ALTER USER dawn_user WITH PASSWORD 'new_password';
```

## 部署问题

### 服务器配置问题

#### 问题：systemd 服务无法启动
**解决方案**:
1. 检查服务状态：
```bash
sudo systemctl status dawn-eats
sudo journalctl -u dawn-eats --no-pager -l
```

2. 检查文件权限：
```bash
sudo chown -R www-data:www-data /opt/dawn-eats
sudo chmod +x /opt/dawn-eats/backend/.venv/bin/uvicorn
```

3. 测试手动启动：
```bash
cd /opt/dawn-eats/backend
.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
```

#### 问题：Nginx 配置错误
**解决方案**:
1. 测试配置：
```bash
sudo nginx -t
```

2. 检查错误日志：
```bash
sudo tail -f /var/log/nginx/error.log
```

3. 重载配置：
```bash
sudo systemctl reload nginx
```

### SSL 证书问题

#### 问题：Let's Encrypt 证书申请失败
**解决方案**:
1. 确保域名正确解析到服务器
2. 临时停止 Nginx：
```bash
sudo systemctl stop nginx
sudo certbot certonly --standalone -d api.yourdomain.com
sudo systemctl start nginx
```

3. 检查防火墙：
```bash
sudo ufw status
sudo ufw allow 'Nginx Full'
```

## 性能问题

### 应用响应缓慢

#### 数据库查询优化
**问题**: API 响应时间过长
**解决方案**:
1. 检查数据库查询：
```sql
-- 启用查询统计
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 查看慢查询
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

2. 添加索引：
```sql
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
```

#### 内存使用过高
**解决方案**:
1. 监控内存使用：
```bash
free -h
top -p $(pgrep -f uvicorn)
```

2. 调整 uvicorn worker 数量：
```bash
uvicorn main:app --workers 2 --host 0.0.0.0 --port 8000
```

### 前端性能问题

#### 应用启动缓慢
**解决方案**:
1. 检查 bundle 大小：
```bash
cd frontend
npx expo export --platform web --dev false
du -sh web-build/
```

2. 启用代码分割和懒加载

#### 网络请求超时
**解决方案**:
配置合理的超时时间：
```typescript
// src/services/api.ts
const fetchWithTimeout = (url: string, options: any = {}, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};
```

## 日志和调试

### 启用详细日志

#### 后端调试
```python
# main.py
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# 在关键位置添加日志
logger.debug(f"Received request: {request.method} {request.url}")
```

#### 前端调试
```typescript
// 开启 React Native Debugger
// 在代码中添加调试信息
console.log('API Response:', response);
console.log('Current user:', user);
```

### 监控工具

#### 系统监控
```bash
# 实时监控系统资源
htop

# 磁盘使用情况
df -h

# 网络连接
netstat -tlnp | grep :8000
```

#### 应用监控
使用工具如：
- **Sentry**: 错误追踪
- **New Relic**: 应用性能监控
- **Grafana**: 指标可视化

## 获取帮助

如果以上解决方案都无法解决问题：

1. **检查项目文档**:
   - [API 文档](API.md)
   - [架构设计](ARCHITECTURE.md)
   - [贡献指南](CONTRIBUTING.md)

2. **查看项目 Issues**: 
   - 搜索类似问题
   - 创建新的 Issue 并提供详细信息

3. **联系开发团队**:
   - GitHub Discussions
   - 项目维护者

4. **提供问题信息**:
   - 操作系统和版本
   - Node.js/Python 版本
   - 完整的错误日志
   - 复现步骤
   - 期望的行为

## 预防措施

### 定期维护
1. **依赖更新**:
```bash
# 检查过期依赖
cd frontend && npm audit
cd backend && uv sync --upgrade
```

2. **数据库备份**:
```bash
# 设置定期备份
crontab -e
0 2 * * * /opt/dawn-eats/scripts/backup.sh
```

3. **日志轮转**:
```bash
# 配置 logrotate
sudo nano /etc/logrotate.d/dawn-eats
```

### 监控告警
1. 设置服务可用性监控
2. 配置磁盘空间告警
3. 监控 API 响应时间
4. 数据库连接池监控

通过遵循这些故障排除步骤和预防措施，可以大大减少系统问题的发生，并快速解决出现的问题。