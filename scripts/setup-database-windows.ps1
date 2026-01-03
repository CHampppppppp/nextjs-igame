# ===========================================
# iGame Lab 数据库自动化设置脚本 (Windows)
# 自动创建MySQL数据库、表和视图
# ===========================================

param(
    [string]$DB_HOST = "localhost",
    [int]$DB_PORT = 3306,
    [string]$DB_USER = "root",
    [string]$DB_PASSWORD = "",
    [string]$DB_NAME = "igame_lab",
    [string]$DB_APP_USER = "igame_app",
    [string]$DB_APP_PASSWORD = ""
)

# 颜色输出函数
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    $ColorMap = @{
        "Red" = [ConsoleColor]::Red
        "Green" = [ConsoleColor]::Green
        "Yellow" = [ConsoleColor]::Yellow
        "Blue" = [ConsoleColor]::Blue
        "Cyan" = [ConsoleColor]::Cyan
        "Magenta" = [ConsoleColor]::Magenta
    }
    if ($ColorMap.ContainsKey($Color)) {
        Write-Host $Message -ForegroundColor $ColorMap[$Color]
    } else {
        Write-Host $Message
    }
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ️  $Message" "Blue"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✅ $Message" "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "⚠️  $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "❌ $Message" "Red"
}

function Write-Header {
    param([string]$Title)
    Write-ColorOutput "=================================" "Blue"
    Write-ColorOutput $Title "Blue"
    Write-ColorOutput "=================================" "Blue"
}

# 脚本开始
Write-Header "iGame Lab 数据库自动化设置脚本 (Windows)"

Write-Host ""
Write-Info "开始检查系统环境..."
Write-Host ""

# 检查MySQL是否安装
Write-Info "检查MySQL客户端..."
try {
    $mysqlVersion = mysql --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "MySQL客户端已安装"
        Write-Info "MySQL版本信息: $mysqlVersion"
    } else {
        throw "MySQL not found"
    }
} catch {
    Write-Error "MySQL客户端未找到"
    Write-Host ""
    Write-Host "请先安装MySQL："
    Write-Host "1. 下载MySQL Installer: https://dev.mysql.com/downloads/installer/"
    Write-Host "2. 安装MySQL Server和MySQL Shell"
    Write-Host "3. 确保mysql命令在PATH中可用"
    Write-Host ""
    Write-Host "或者使用Chocolatey安装："
    Write-Host "choco install mysql"
    exit 1
}

# 检查Node.js是否安装
Write-Info "检查Node.js..."
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Node.js已安装 (版本: $nodeVersion)"

        # 检查版本
        $versionNumber = $nodeVersion -replace '^v', ''
        $minVersion = [version]"16.0.0"
        $currentVersion = [version]$versionNumber

        if ($currentVersion -lt $minVersion) {
            Write-Warning "建议使用Node.js 16.0.0或更高版本，当前版本: $nodeVersion"
        }
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Error "Node.js未找到"
    Write-Host ""
    Write-Host "请先安装Node.js："
    Write-Host "1. 下载: https://nodejs.org/"
    Write-Host "2. 安装LTS版本"
    Write-Host ""
    Write-Host "或者使用Chocolatey安装："
    Write-Host "choco install nodejs"
    exit 1
}

# 检查npm是否安装
Write-Info "检查npm..."
try {
    npm --version >$null 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "npm已安装"
    } else {
        throw "npm not found"
    }
} catch {
    Write-Error "npm未找到"
    exit 1
}

# 检查项目依赖
Write-Info "检查项目依赖..."
if (!(Test-Path "package.json")) {
    Write-Error "未找到package.json文件，请确保在项目根目录运行此脚本"
    exit 1
}

if (!(Test-Path "node_modules")) {
    Write-Info "安装项目依赖..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "依赖安装失败"
        exit 1
    }
}
Write-Success "项目依赖已准备就绪"

Write-Host ""
Write-Header "开始数据库配置"
Write-Host ""

# 构建MySQL连接字符串
$connectionString = "-h$DB_HOST -P$DB_PORT -u$DB_USER"
if ($DB_PASSWORD) {
    $connectionString += " -p$DB_PASSWORD"
}

# 测试数据库连接
Write-Info "测试数据库连接..."
$testQuery = "SELECT 1;" | mysql $connectionString.Split() 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "数据库连接失败"
    Write-Host ""
    Write-Host "请检查以下配置："
    Write-Host "  主机: $DB_HOST"
    Write-Host "  端口: $DB_PORT"
    Write-Host "  用户: $DB_USER"
    if ($DB_PASSWORD) {
        Write-Host "  密码: [已设置]"
    } else {
        Write-Host "  密码: [未设置]"
    }
    Write-Host ""
    Write-Host "或者设置参数："
    Write-Host "  .\setup-database-windows.ps1 -DB_HOST your_host -DB_PORT your_port -DB_USER your_username -DB_PASSWORD your_password"
    exit 1
}
Write-Success "数据库连接成功"

# 获取MySQL版本
Write-Info "获取MySQL版本信息..."
$mysqlVersionQuery = "SELECT VERSION();" | mysql $connectionString.Split() 2>$null | Select-Object -Skip 1
Write-Info "MySQL版本: $mysqlVersionQuery"

# 创建数据库
Write-Info "创建数据库 '$DB_NAME'..."
$sql = "CREATE DATABASE IF NOT EXISTS `$DB_NAME` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
$sql | mysql $connectionString.Split() 2>$null

# 验证数据库创建
Write-Info "验证数据库创建..."
$useDbQuery = "USE `$DB_NAME`; SELECT DATABASE();" | mysql $connectionString.Split() 2>$null | Select-Object -Skip 1
if ($useDbQuery -notmatch $DB_NAME) {
    Write-Error "数据库创建失败"
    exit 1
}
Write-Success "数据库 '$DB_NAME' 已创建/已存在"

# 设置数据库用户权限
if ($DB_APP_USER -and $DB_APP_PASSWORD) {
    Write-Info "设置应用专用用户 '$DB_APP_USER'..."

    $userSql = @"
-- 创建用户（如果不存在）
CREATE USER IF NOT EXISTS '$DB_APP_USER'@'localhost' IDENTIFIED BY '$DB_APP_PASSWORD';
CREATE USER IF NOT EXISTS '$DB_APP_USER'@'%' IDENTIFIED BY '$DB_APP_PASSWORD';

-- 授予权限
GRANT ALL PRIVILEGES ON `$DB_NAME`.* TO '$DB_APP_USER'@'localhost';
GRANT ALL PRIVILEGES ON `$DB_NAME`.* TO '$DB_APP_USER'@'%';

-- 刷新权限
FLUSH PRIVILEGES;
"@

    $userSql | mysql $connectionString.Split() 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "应用用户配置完成"
    } else {
        Write-Warning "用户配置可能存在问题，请手动检查"
    }
} else {
    Write-Info "跳过应用用户创建（未设置DB_APP_USER或DB_APP_PASSWORD）"
}

Write-Host ""
Write-Header "创建数据库表和视图"
Write-Host ""

# 创建表和视图
Write-Info "运行数据库初始化脚本..."
npx tsx scripts/init-database.ts
if ($LASTEXITCODE -ne 0) {
    Write-Error "数据库初始化失败"
    exit 1
}
Write-Success "数据库表和视图创建成功"

Write-Host ""
Write-Header "验证数据库设置"
Write-Host ""

# 验证表是否存在
Write-Info "验证表结构..."
$tablesQuery = "USE `$DB_NAME`; SHOW TABLES;" | mysql $connectionString.Split() 2>$null | Select-Object -Skip 1

$tables = $tablesQuery -split "`n" | Where-Object { $_ -and $_.Trim() }

if ($tables -contains "memory_documents") {
    Write-Success "表 'memory_documents' 已创建"
} else {
    Write-Error "表 'memory_documents' 创建失败"
    exit 1
}

if ($tables -contains "students") {
    Write-Success "表 'students' 已创建"
} else {
    Write-Error "表 'students' 创建失败"
    exit 1
}

if ($tables -contains "memory_stats") {
    Write-Success "视图 'memory_stats' 已创建"
} else {
    Write-Warning "视图 'memory_stats' 创建失败（可选）"
}

# 显示表结构信息
Write-Host ""
Write-Info "数据库表结构信息："

Write-Host "`n内存文档表 (memory_documents):"
"DESC memory_documents;" | mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD $DB_NAME 2>$null

Write-Host "`n学生信息表 (students):"
"DESC students;" | mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD $DB_NAME 2>$null

# 显示统计信息
Write-Host ""
Write-Info "数据库统计信息："
"SELECT * FROM memory_stats;" | mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD $DB_NAME 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "统计视图暂无数据"
}

Write-Host ""
Write-Header "配置环境变量"
Write-Host ""

# 生成环境变量配置
$envFile = ".env.local"
if (!(Test-Path $envFile)) {
    Write-Info "创建环境变量文件..."

    $envContent = @"
# 数据库配置
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$($DB_APP_USER ? $DB_APP_USER : $DB_USER)
DB_PASSWORD=$($DB_APP_PASSWORD ? $DB_APP_PASSWORD : $DB_PASSWORD)
"@

    $envContent | Out-File -FilePath $envFile -Encoding UTF8
    Write-Success "环境变量文件已创建: $envFile"
} else {
    Write-Warning "环境变量文件已存在，请手动更新以下配置："
}

Write-Host ""
Write-Host "请确保以下环境变量已设置："
Write-Host "  DB_HOST=$DB_HOST"
Write-Host "  DB_PORT=$DB_PORT"
Write-Host "  DB_NAME=$DB_NAME"
Write-Host "  DB_USER=$($DB_APP_USER ? $DB_APP_USER : $DB_USER)"
Write-Host "  DB_PASSWORD=[已设置]"

Write-Host ""
Write-Header "🎉 数据库设置完成！"
Write-Host ""

Write-Success "您的iGame Lab数据库已完全配置"
Write-Host ""
Write-Host "📋 配置摘要:"
Write-Host "  🗄️  数据库: $DB_NAME"
Write-Host "  🖥️  主机: $DB_HOST`:$DB_PORT"
Write-Host "  👤 用户: $($DB_APP_USER ? $DB_APP_USER : $DB_USER)"
Write-Host "  📊 表: memory_documents, students"
Write-Host "  👁️  视图: memory_stats"
Write-Host ""
Write-Host "🚀 接下来可以运行:"
Write-Host "  npm run dev          # 启动开发服务器"
Write-Host "  npm run test-db      # 测试数据库连接"
Write-Host ""

# 最后的检查
Write-Info "执行最终验证..."
npx tsx scripts/test-database.ts >$null 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Success "数据库连接测试通过"
} else {
    Write-Warning "数据库连接测试失败，请检查配置"
}

Write-Host ""
Write-Info "设置完成！如有问题，请查看上述错误信息或联系技术支持。"
