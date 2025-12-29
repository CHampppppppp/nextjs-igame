# PowerShell脚本：测试uiuiapi连接

# 读取环境变量
$envContent = Get-Content .env.local
$apiKey = ($envContent | Where-Object { $_ -match 'OPENAI_API_KEY=' } | ForEach-Object { $_.Split('=')[1] })
$apiUrl = ($envContent | Where-Object { $_ -match 'OPENAI_API_BASE_URL=' } | ForEach-Object { $_.Split('=')[1] })

Write-Host "🔍 测试uiuiapi API连接..." -ForegroundColor Cyan
if ($apiKey) {
    Write-Host "API Key: 已设置" -ForegroundColor Yellow
} else {
    Write-Host "API Key: 未设置" -ForegroundColor Red
}
Write-Host "API URL: $apiUrl" -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $apiKey"
    }

    $body = @{
        input = "test message"
        model = "text-embedding-3-small"
    } | ConvertTo-Json

    Write-Host "📡 发送请求到: $apiUrl/embeddings" -ForegroundColor Green

    $response = Invoke-WebRequest -Uri "$apiUrl/embeddings" -Method POST -Headers $headers -Body $body -TimeoutSec 30

    Write-Host "✅ 请求成功! 状态码: $($response.StatusCode)" -ForegroundColor Green

    if ($response.Content) {
        $jsonResponse = $response.Content | ConvertFrom-Json
        if ($jsonResponse.data -and $jsonResponse.data[0].embedding) {
            Write-Host "✅ 向量嵌入成功! 维度: $($jsonResponse.data[0].embedding.Count)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  API响应格式异常" -ForegroundColor Yellow
            Write-Host "响应内容: $($response.Content)" -ForegroundColor Gray
        }
    }

} catch {
    Write-Host "❌ 请求失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""

    if ($_.Exception.Response) {
        Write-Host "HTTP状态码: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        try {
            $errorContent = $_.Exception.Response.GetResponseStream() | %{ $reader = New-Object System.IO.StreamReader($_); $reader.ReadToEnd() }
            Write-Host "错误详情: $errorContent" -ForegroundColor Red
        } catch {
            Write-Host "无法读取错误详情" -ForegroundColor Gray
        }
    }

    Write-Host ""
    Write-Host "🔧 故障排除建议:" -ForegroundColor Cyan
    Write-Host "1. 检查API密钥是否正确" -ForegroundColor White
    Write-Host "2. 确认账户有足够余额" -ForegroundColor White
    Write-Host "3. 检查网络连接" -ForegroundColor White
    Write-Host "4. 尝试更换API端点" -ForegroundColor White
}
