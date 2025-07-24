# Dawn Eats 部署指南

本文档描述了如何将 Dawn Eats 应用部署到生产环境。

## 部署架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │  Web Frontend   │    │   Backend API   │
│   (iOS/Android) │    │   (React Web)   │    │   (FastAPI)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   │
                        ┌─────────────────┐
                        │   Database      │
                        │ (PostgreSQL)    │
                        └─────────────────┘
```

## 后端部署

### 环境要求

- Python 3.12+
- PostgreSQL 14+
- Redis (可选，用于缓存)
- Nginx (反向代理)

### 1. 服务器设置

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Python 3.12
sudo apt install python3.12 python3.12-venv python3-pip

# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib

# 安装 Nginx
sudo apt install nginx

# 安装 uv
pip install uv
```

### 2. 数据库配置

```bash
# 创建数据库用户和数据库
sudo -u postgres psql

CREATE USER dawn_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE dawn_eats OWNER dawn_user;
GRANT ALL PRIVILEGES ON DATABASE dawn_eats TO dawn_user;
\q
```

### 3. 应用部署

```bash
# 创建应用目录
sudo mkdir -p /opt/dawn-eats
sudo chown $USER:$USER /opt/dawn-eats
cd /opt/dawn-eats

# 克隆代码
git clone https://github.com/yourusername/dawn-eats.git .

# 安装依赖
cd backend
uv sync --frozen

# 配置环境变量
cp .env.example .env
```

### 4. 环境变量配置

编辑 `/opt/dawn-eats/backend/.env`：

```env
# 数据库配置
DATABASE_URL=postgresql://dawn_user:your_secure_password@localhost/dawn_eats

# JWT 配置
SECRET_KEY=your-super-secret-jwt-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 应用配置
ENVIRONMENT=production
DEBUG=False

# CORS 配置 (生产环境域名)
ALLOWED_ORIGINS=["https://yourdomain.com", "https://app.yourdomain.com"]
```

### 5. 数据库迁移

```bash
cd /opt/dawn-eats/backend
uv run alembic upgrade head
```

### 6. 系统服务配置

创建 systemd 服务文件 `/etc/systemd/system/dawn-eats.service`：

```ini
[Unit]
Description=Dawn Eats FastAPI App
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/opt/dawn-eats/backend
Environment=PATH=/opt/dawn-eats/backend/.venv/bin
ExecStart=/opt/dawn-eats/backend/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable dawn-eats
sudo systemctl start dawn-eats
sudo systemctl status dawn-eats
```

### 7. Nginx 配置

创建 Nginx 配置文件 `/etc/nginx/sites-available/dawn-eats`：

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API 文档
    location /docs {
        proxy_pass http://localhost:8000/docs;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/dawn-eats /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. SSL 证书配置

使用 Let's Encrypt：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

## 前端部署

### Web 版本部署

#### 1. 构建应用

```bash
cd /opt/dawn-eats/frontend

# 安装依赖
npm install

# 配置 API 端点
echo "export const API_BASE_URL = 'https://api.yourdomain.com/api/v1';" > src/config.ts

# 构建 Web 版本
npm run build:web
```

#### 2. Nginx 配置

添加到现有的 Nginx 配置：

```nginx
server {
    listen 80;
    server_name app.yourdomain.com;

    root /opt/dawn-eats/frontend/web-build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 移动应用部署

#### iOS App Store 部署

1. **配置生产环境**：
```bash
cd frontend
# 更新 app.json 中的配置
```

2. **构建应用**：
```bash
npx expo build:ios
```

3. **提交到 App Store Connect**

#### Android Play Store 部署

1. **构建 APK/AAB**：
```bash
npx expo build:android
```

2. **签名和上传到 Play Console**

## 监控和日志

### 日志配置

1. **应用日志**：
```bash
# 查看服务日志
sudo journalctl -u dawn-eats -f

# 设置日志轮转
sudo nano /etc/logrotate.d/dawn-eats
```

2. **Nginx 日志**：
```bash
# 访问日志
tail -f /var/log/nginx/access.log

# 错误日志
tail -f /var/log/nginx/error.log
```

### 性能监控

推荐使用以下工具：

- **Application Performance Monitoring**: New Relic, DataDog
- **服务器监控**: Prometheus + Grafana
- **错误追踪**: Sentry
- **正常运行时间监控**: Uptime Robot

## 数据库维护

### 备份策略

1. **自动备份脚本**：
```bash
#!/bin/bash
# /opt/dawn-eats/scripts/backup.sh

BACKUP_DIR="/opt/backups/dawn-eats"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 数据库备份
pg_dump -h localhost -U dawn_user dawn_eats > $BACKUP_DIR/dawn_eats_$DATE.sql

# 保留最近 7 天的备份
find $BACKUP_DIR -name "dawn_eats_*.sql" -mtime +7 -delete
```

2. **设置定时任务**：
```bash
# 添加到 crontab
0 2 * * * /opt/dawn-eats/scripts/backup.sh
```

### 数据库优化

1. **索引优化**：
```sql
-- 创建常用查询索引
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
```

2. **性能监控**：
```sql
-- 查看慢查询
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

## 安全配置

### 防火墙设置

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### SSL/TLS 配置

更新 Nginx 配置以增强安全性：

```nginx
# 强制 HTTPS
server {
    listen 80;
    server_name api.yourdomain.com app.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL 配置
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # 其他配置...
}
```

## 故障排除

### 常见问题

1. **服务无法启动**：
```bash
# 检查服务状态
sudo systemctl status dawn-eats

# 查看详细日志
sudo journalctl -u dawn-eats --no-pager -l
```

2. **数据库连接问题**：
```bash
# 测试数据库连接
cd /opt/dawn-eats/backend
uv run python -c "from app.database import engine; print('Database connection OK')"
```

3. **权限问题**：
```bash
# 确保正确的文件权限
sudo chown -R www-data:www-data /opt/dawn-eats
sudo chmod -R 755 /opt/dawn-eats
```

### 性能优化

1. **数据库连接池**：
在生产环境中调整数据库连接池参数

2. **静态文件服务**：
使用 CDN 来提供静态资源

3. **缓存策略**：
实现 Redis 缓存来提升 API 响应速度

## 更新部署

### 自动化部署脚本

```bash
#!/bin/bash
# /opt/dawn-eats/scripts/deploy.sh

set -e

echo "Starting deployment..."

# 拉取最新代码
git pull origin main

# 更新后端
cd backend
uv sync
uv run alembic upgrade head

# 重启服务
sudo systemctl restart dawn-eats

# 更新前端
cd ../frontend
npm install
npm run build:web

echo "Deployment completed!"
```

使用 GitHub Actions 进行 CI/CD 自动部署：

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /opt/dawn-eats
            ./scripts/deploy.sh
```

## 联系支持

如果在部署过程中遇到问题：
- 查看项目 Issues
- 参考 [故障排除指南](TROUBLESHOOTING.md)
- 联系项目维护者