#!/bin/bash

# ===========================================
# iGame Lab 数据库自动化设置脚本
# 自动创建MySQL数据库、表和视图
# ===========================================

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 输出函数
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}=================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=================================${NC}"
}

# 默认配置
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-igame_lab}"
DB_APP_USER="${DB_APP_USER:-igame_app}"
DB_APP_PASSWORD="${DB_APP_PASSWORD:-}"

# 脚本开始
print_header "iGame Lab 数据库自动化设置脚本"

echo ""
print_info "开始检查系统环境..."
echo ""

# 检查是否为Linux系统
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    print_error "此脚本仅支持Linux系统"
    exit 1
fi

# 检查MySQL客户端是否安装
print_info "检查MySQL客户端..."
if ! command -v mysql &> /dev/null; then
    print_error "MySQL客户端未找到"
    echo ""
    echo "请先安装MySQL客户端："
    echo "  Ubuntu/Debian: sudo apt-get update && sudo apt-get install mysql-client"
    echo "  CentOS/RHEL: sudo yum install mysql"
    echo "  Fedora: sudo dnf install mysql"
    exit 1
fi
print_success "MySQL客户端已安装"

# 检查Node.js是否安装
print_info "检查Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js未找到"
    echo ""
    echo "请先安装Node.js："
    echo "  Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo "  CentOS/RHEL: curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash - && sudo yum install -y nodejs"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
if [[ "$(printf '%s\n' "$NODE_VERSION" "18.0.0" | sort -V | head -n1)" != "18.0.0" ]]; then
    print_warning "建议使用Node.js 18.0.0或更高版本，当前版本: $NODE_VERSION"
fi
print_success "Node.js已安装 (版本: $NODE_VERSION)"

# 检查npm是否安装
print_info "检查npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm未找到"
    exit 1
fi
print_success "npm已安装"

# 检查项目依赖
print_info "检查项目依赖..."
if [ ! -f "package.json" ]; then
    print_error "未找到package.json文件，请确保在项目根目录运行此脚本"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    print_info "安装项目依赖..."
    npm install
fi
print_success "项目依赖已准备就绪"

echo ""
print_header "开始数据库配置"
echo ""

# 测试数据库连接
print_info "测试数据库连接..."
if ! mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null; then
    print_error "数据库连接失败"
    echo ""
    echo "请检查以下配置："
    echo "  主机: $DB_HOST"
    echo "  端口: $DB_PORT"
    echo "  用户: $DB_USER"
    echo "  密码: [已设置]"
    echo ""
    echo "或者设置环境变量："
    echo "  export DB_HOST=your_host"
    echo "  export DB_PORT=your_port"
    echo "  export DB_USER=your_username"
    echo "  export DB_PASSWORD=your_password"
    exit 1
fi
print_success "数据库连接成功"

# 检查MySQL版本
MYSQL_VERSION=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT VERSION();" 2>/dev/null | tail -n1)
print_info "MySQL版本: $MYSQL_VERSION"

# 创建数据库
print_info "创建数据库 '$DB_NAME'..."
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
" 2>/dev/null

# 验证数据库创建
if ! mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "USE \`$DB_NAME\`; SELECT DATABASE();" | grep -q "$DB_NAME"; then
    print_error "数据库创建失败"
    exit 1
fi
print_success "数据库 '$DB_NAME' 已创建/已存在"

# 设置数据库用户权限
if [ -n "$DB_APP_USER" ] && [ -n "$DB_APP_PASSWORD" ]; then
    print_info "设置应用专用用户 '$DB_APP_USER'..."

    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "
    -- 创建用户（如果不存在）
    CREATE USER IF NOT EXISTS '$DB_APP_USER'@'localhost' IDENTIFIED BY '$DB_APP_PASSWORD';
    CREATE USER IF NOT EXISTS '$DB_APP_USER'@'%' IDENTIFIED BY '$DB_APP_PASSWORD';

    -- 授予权限
    GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_APP_USER'@'localhost';
    GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_APP_USER'@'%';

    -- 刷新权限
    FLUSH PRIVILEGES;
    " 2>/dev/null && print_success "应用用户配置完成" || print_warning "用户配置可能存在问题，请手动检查"
else
    print_info "跳过应用用户创建（未设置DB_APP_USER或DB_APP_PASSWORD）"
fi

echo ""
print_header "创建数据库表和视图"
echo ""

# 创建表和视图
print_info "运行数据库初始化脚本..."
if npx tsx scripts/init-database.ts; then
    print_success "数据库表和视图创建成功"
else
    print_error "数据库初始化失败"
    exit 1
fi

echo ""
print_header "验证数据库设置"
echo ""

# 验证表是否存在
print_info "验证表结构..."
TABLES=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "USE \`$DB_NAME\`; SHOW TABLES;" 2>/dev/null)

if echo "$TABLES" | grep -q "memory_documents"; then
    print_success "表 'memory_documents' 已创建"
else
    print_error "表 'memory_documents' 创建失败"
    exit 1
fi

if echo "$TABLES" | grep -q "memory_stats"; then
    print_success "视图 'memory_stats' 已创建"
else
    print_warning "视图 'memory_stats' 创建失败（可选）"
fi

# 显示表结构信息
echo ""
print_info "数据库表结构信息："
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "
USE \`$DB_NAME\`;
DESCRIBE memory_documents;
" 2>/dev/null

# 显示统计信息
echo ""
print_info "数据库统计信息："
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "
USE \`$DB_NAME\`;
SELECT * FROM memory_stats;
" 2>/dev/null || echo "统计视图暂无数据"

echo ""
print_header "配置环境变量"
echo ""

# 生成环境变量配置
ENV_FILE=".env.local"
if [ ! -f "$ENV_FILE" ]; then
    print_info "创建环境变量文件..."
    cat > "$ENV_FILE" << EOF
# 数据库配置
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=${DB_APP_USER:-$DB_USER}
DB_PASSWORD=${DB_APP_PASSWORD:-$DB_PASSWORD}
EOF
    print_success "环境变量文件已创建: $ENV_FILE"
else
    print_warning "环境变量文件已存在，请手动更新以下配置："
fi

echo ""
echo "请确保以下环境变量已设置："
echo "  DB_HOST=$DB_HOST"
echo "  DB_PORT=$DB_PORT"
echo "  DB_NAME=$DB_NAME"
echo "  DB_USER=${DB_APP_USER:-$DB_USER}"
echo "  DB_PASSWORD=[已设置]"

echo ""
print_header "🎉 数据库设置完成！"
echo ""

print_success "您的iGame Lab数据库已完全配置"
echo ""
echo "📋 配置摘要:"
echo "  🗄️  数据库: $DB_NAME"
echo "  🖥️  主机: $DB_HOST:$DB_PORT"
echo "  👤 用户: ${DB_APP_USER:-$DB_USER}"
echo "  📊 表: memory_documents"
echo "  👁️  视图: memory_stats"
echo ""
echo "🚀 接下来可以运行:"
echo "  npm run dev          # 启动开发服务器"
echo "  npm run test-db      # 测试数据库连接"
echo ""

# 最后的检查
print_info "执行最终验证..."
if npx tsx scripts/test-database.ts &> /dev/null; then
    print_success "数据库连接测试通过"
else
    print_warning "数据库连接测试失败，请检查配置"
fi

echo ""
print_info "设置完成！如有问题，请查看上述错误信息或联系技术支持。"
