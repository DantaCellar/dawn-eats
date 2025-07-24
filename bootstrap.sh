#!/bin/bash

# Dawn Eats Bootstrap Script
# 自动安装依赖并启动前后端服务

set -e  # 遇到错误时退出

# 参数解析
LAUNCH_IOS=false
LAUNCH_WEB=false
AUTO_START=false

# 显示帮助信息
show_help() {
    echo "🌅 Dawn Eats Bootstrap Script"
    echo "================================"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --ios     启动后自动打开 iOS 模拟器"
    echo "  --web     启动后自动打开 Web 浏览器"
    echo "  --help    显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0              # 默认模式，询问是否启动服务"
    echo "  $0 --ios        # 安装依赖并自动启动 iOS 模拟器"
    echo "  $0 --web        # 安装依赖并自动启动 Web 浏览器"
    echo ""
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --ios)
            LAUNCH_IOS=true
            AUTO_START=true
            shift
            ;;
        --web)
            LAUNCH_WEB=true
            AUTO_START=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo "未知参数: $1"
            show_help
            exit 1
            ;;
    esac
done

echo "🌅 Dawn Eats Bootstrap Script"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 未安装，请先安装 $1"
        return 1
    fi
    return 0
}

# 检查必要的工具
log_info "检查必要工具..."

if ! check_command "node"; then
    log_error "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

if ! check_command "npm"; then
    log_error "请先安装 npm (通常随 Node.js 一起安装)"
    exit 1
fi

if ! check_command "python3"; then
    log_error "请先安装 Python 3.12+: https://www.python.org/"
    exit 1
fi

if ! check_command "uv"; then
    log_warning "uv 未安装，尝试安装..."
    if command -v pip3 &> /dev/null; then
        pip3 install uv
    else
        log_error "请先安装 uv: https://docs.astral.sh/uv/getting-started/installation/"
        exit 1
    fi
fi

log_success "所有必要工具已就绪"

# 安装后端依赖
log_info "安装后端依赖..."
cd backend

if [ ! -f ".python-version" ]; then
    log_info "设置 Python 版本..."
    echo "3.12" > .python-version
fi

log_info "使用 uv 安装 Python 依赖..."
uv sync

log_success "后端依赖安装完成"
cd ..

# 安装前端依赖
log_info "安装前端依赖..."
cd frontend

log_info "安装 npm 依赖..."
npm install

# 检查是否需要安装 Expo CLI
if ! command -v expo &> /dev/null; then
    log_info "安装 Expo CLI..."
    npm install -g @expo/cli
fi

log_success "前端依赖安装完成"
cd ..

log_success "所有依赖安装完成！"

# 询问是否启动服务（除非使用了自动启动参数）
if [ "$AUTO_START" = false ]; then
    echo ""
    read -p "是否现在启动前后端服务？(y/N): " -n 1 -r
    echo ""
    START_SERVICES=$([[ $REPLY =~ ^[Yy]$ ]] && echo "true" || echo "false")
else
    START_SERVICES=true
fi

if [ "$START_SERVICES" = "true" ]; then
    log_info "启动服务..."
    
    # 清理函数
    cleanup() {
        echo ""
        log_info "正在停止服务..."
        if [ ! -z "$BACKEND_PID" ] && kill -0 $BACKEND_PID 2>/dev/null; then
            log_info "停止后端服务 (PID: $BACKEND_PID)..."
            kill $BACKEND_PID
        fi
        if [ ! -z "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
            log_info "停止前端服务 (PID: $FRONTEND_PID)..."
            kill $FRONTEND_PID
        fi
        # 清理 PID 文件
        rm -f .backend.pid .frontend.pid
        log_success "所有服务已停止"
        exit 0
    }
    
    # 设置信号处理
    trap cleanup INT TERM
    
    # 启动后端服务
    log_info "启动后端服务 (端口 8000)..."
    cd backend
    uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
    
    # 等待后端启动
    sleep 3
    
    # 检查后端是否启动成功
    if kill -0 $BACKEND_PID 2>/dev/null; then
        log_success "后端服务已启动 (PID: $BACKEND_PID)"
        log_info "后端 API: http://localhost:8000"
        log_info "API 文档: http://localhost:8000/docs"
    else
        log_error "后端服务启动失败"
        exit 1
    fi
    
    # 启动前端服务
    log_info "启动前端服务..."
    cd frontend
    
    # 根据参数选择启动方式
    if [ "$LAUNCH_IOS" = true ]; then
        log_info "启动 iOS 模拟器模式..."
        npm run ios &
        FRONTEND_PID=$!
    elif [ "$LAUNCH_WEB" = true ]; then
        log_info "启动 Web 浏览器模式..."
        npm run web &
        FRONTEND_PID=$!
    else
        npm start &
        FRONTEND_PID=$!
    fi
    
    cd ..
    
    # 等待前端启动
    sleep 5
    
    # 检查前端是否启动成功
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        log_success "前端服务已启动 (PID: $FRONTEND_PID)"
        if [ "$LAUNCH_IOS" = true ]; then
            log_info "iOS 模拟器正在启动..."
        elif [ "$LAUNCH_WEB" = true ]; then
            log_info "Web 浏览器正在启动..."
        else
            log_info "Expo 开发服务器已启动"
        fi
    else
        log_error "前端服务启动失败"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    echo ""
    log_success "🎉 Dawn Eats 启动成功！"
    echo ""
    echo "服务信息:"
    echo "  后端 API: http://localhost:8000"
    echo "  API 文档: http://localhost:8000/docs"
    if [ "$LAUNCH_IOS" = true ]; then
        echo "  前端: iOS 模拟器"
    elif [ "$LAUNCH_WEB" = true ]; then
        echo "  前端: Web 浏览器 (http://localhost:19006)"
    else
        echo "  前端: Expo 开发服务器"
    fi
    echo ""
    echo "服务进程:"
    echo "  后端 PID: $BACKEND_PID"
    echo "  前端 PID: $FRONTEND_PID"
    echo ""
    echo "按 Ctrl+C 停止所有服务并退出"
    
    # 保存 PID 到文件以便后续管理
    echo "$BACKEND_PID" > .backend.pid
    echo "$FRONTEND_PID" > .frontend.pid
    
    # 等待用户中断或进程结束
    while kill -0 $BACKEND_PID 2>/dev/null && kill -0 $FRONTEND_PID 2>/dev/null; do
        sleep 1
    done
    
    # 如果循环结束，说明有进程意外退出
    log_warning "检测到服务进程意外退出，正在清理..."
    cleanup
else
    echo ""
    log_info "依赖已安装完成，可以手动启动服务:"
    echo ""
    echo "启动后端:"
    echo "  cd backend"
    echo "  uv run uvicorn main:app --reload"
    echo ""
    echo "启动前端:"
    echo "  cd frontend"
    echo "  npm start          # Expo 开发服务器"
    echo "  npm run ios        # iOS 模拟器"
    echo "  npm run web        # Web 浏览器"
fi