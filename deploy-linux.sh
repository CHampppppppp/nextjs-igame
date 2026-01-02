#!/bin/bash

# iGame Lab AI Assistant - Linux 自动部署脚本
# 此脚本会自动设置数据库、安装依赖、初始化数据并启动应用

set -e  # 遇到错误立即退出

# 默认配置
APP_NAME="igame-lab-ai"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_VERSION="${NODE_VERSION:-18}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-igame_lab}"

echo "🚀 iGame Lab AI Assistant - Linux Auto Deployment"
echo "=================================================="
echo ""
echo "App Directory: $APP_DIR"
echo "Node Version: $NODE_VERSION"
echo "Database: $DB_NAME"
echo ""

# 检查是否为root用户（某些操作可能需要）
if [[ $EUID -eq 0 ]]; then
   echo "⚠️ Running as root - this is not recommended for production"
   echo "Consider using a regular user with sudo privileges"
   echo ""
fi

# 检查操作系统
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ This script is designed for Linux systems only"
    exit 1
fi

# 函数：检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 函数：安装包（根据发行版）
install_package() {
    local package=$1

    if command_exists apt-get; then
        # Debian/Ubuntu
        echo "📦 Installing $package via apt-get..."
        sudo apt-get update && sudo apt-get install -y "$package"
    elif command_exists yum; then
        # CentOS/RHEL
        echo "📦 Installing $package via yum..."
        sudo yum install -y "$package"
    elif command_exists dnf; then
        # Fedora
        echo "📦 Installing $package via dnf..."
        sudo dnf install -y "$package"
    else
        echo "❌ Package manager not found. Please install $package manually."
        return 1
    fi
}

# 检查并安装Node.js
echo "🔍 Checking Node.js..."
if ! command_exists node; then
    echo "Node.js not found, installing..."
    if command_exists curl; then
        # 使用NodeSource仓库
        curl -fsSL https://deb.nodesource.com/setup_"$NODE_VERSION".x | sudo -E bash -
        install_package nodejs
    else
        echo "❌ curl not found. Please install Node.js manually."
        exit 1
    fi
else
    local node_version=$(node --version | sed 's/v//')
    echo "✅ Node.js found: $node_version"
fi

# 检查npm
if ! command_exists npm; then
    echo "❌ npm not found. Please install npm."
    exit 1
fi

# 检查并安装MySQL
echo "🔍 Checking MySQL..."
if ! command_exists mysql; then
    echo "MySQL not found, installing..."
    install_package mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
else
    echo "✅ MySQL found"
fi

# 设置MySQL root密码（如果没有设置）
if [ -z "$DB_PASSWORD" ]; then
    echo "⚠️ MySQL root password not set in environment variables"
    echo "Please set DB_PASSWORD or configure MySQL manually"
    echo ""
    echo "You can set a password with:"
    echo "sudo mysql_secure_installation"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 设置数据库
echo "🗄️ Setting up database..."
cd "$APP_DIR"

if [ -n "$DB_PASSWORD" ]; then
    export DB_HOST DB_PORT DB_USER DB_PASSWORD DB_NAME
    bash setup-database.sh
else
    echo "⚠️ Skipping automated database setup due to missing password"
    echo "Please run the following manually:"
    echo "export DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=your_password DB_NAME=$DB_NAME"
    echo "bash setup-database.sh"
fi

# 安装依赖
echo "📦 Installing dependencies..."
cd "$APP_DIR"
npm install

# 构建应用
echo "🔨 Building application..."
npm run build

# 初始化数据库
echo "🗃️ Initializing database schema..."
npm run init-db

# 测试数据库连接
echo "🧪 Testing database connection..."
npm run test-db

# 设置环境变量文件（如果不存在）
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️ Please edit .env file with your actual API keys and database credentials"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your API keys:"
echo "   nano .env"
echo ""
echo "2. Start the application:"
echo "   npm run dev"
echo ""
echo "3. Access the application:"
echo "   http://localhost:3000"
echo ""
echo "4. For production deployment, consider using PM2:"
echo "   npm install -g pm2"
echo "   pm2 start npm --name '$APP_NAME' -- run start"
echo ""
echo "🔧 Useful commands:"
echo "- View logs: pm2 logs $APP_NAME"
echo "- Restart app: pm2 restart $APP_NAME"
echo "- Check status: pm2 status"
echo ""
echo "📚 Documentation:"
echo "- Admin panel: http://localhost:3000/admin/memories"
echo "- API endpoints: /api/memories"
echo ""
echo "Happy deploying! 🎊"
