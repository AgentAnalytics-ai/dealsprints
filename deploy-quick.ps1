# Quick Deploy Script - No prompts, just push
# Usage: .\deploy-quick.ps1 [commit-message]

param(
    [string]$Message = ""
)

# Auto-generate commit message if not provided
if ([string]::IsNullOrWhiteSpace($Message)) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $branch = git branch --show-current
    $Message = "Deploy: $timestamp"
}

Write-Host "🚀 Quick Deploy" -ForegroundColor Cyan
Write-Host ""

# Stage, commit, push
git add . 2>&1 | Out-Null
git commit -m $Message 2>&1 | Out-Null
git push origin $(git branch --show-current) 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployed successfully!" -ForegroundColor Green
    Write-Host "   Commit: $Message" -ForegroundColor Gray
} else {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    exit 1
}
