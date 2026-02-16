# DealSprints Deployment Script
# Automates git commit and push to Vercel
# Usage: .\deploy.ps1 [commit-message]

param(
    [string]$Message = ""
)

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Cyan "🚀 DealSprints Deployment Script"
Write-Output ""

# Check if git is available
try {
    $gitVersion = git --version
    Write-ColorOutput Green "✅ Git found: $gitVersion"
} catch {
    Write-ColorOutput Red "❌ Git not found. Please install Git first."
    exit 1
}

# Check if we're in a git repository
if (-not (Test-Path .git)) {
    Write-ColorOutput Red "❌ Not a git repository. Run this script from the project root."
    exit 1
}

# Check git status
Write-ColorOutput Yellow "📋 Checking git status..."
$status = git status --porcelain

if ([string]::IsNullOrWhiteSpace($status)) {
    Write-ColorOutput Yellow "⚠️  No changes to commit."
    Write-Output ""
    Write-Output "Current branch: $(git branch --show-current)"
    Write-Output "Last commit: $(git log -1 --oneline)"
    Write-Output ""
    Write-Output "Push anyway? (y/n)"
    $response = Read-Host
    if ($response -ne 'y' -and $response -ne 'Y') {
        Write-ColorOutput Yellow "Deployment cancelled."
        exit 0
    }
} else {
    Write-ColorOutput Green "✅ Found changes to commit"
    Write-Output ""
    
    # Show what will be committed
    Write-ColorOutput Cyan "Files to be committed:"
    git status --short
    Write-Output ""
    
    # Stage all changes
    Write-ColorOutput Yellow "📦 Staging changes..."
    git add .
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "❌ Failed to stage changes"
        exit 1
    }
    
    Write-ColorOutput Green "✅ Changes staged"
    Write-Output ""
    
    # Generate commit message
    if ([string]::IsNullOrWhiteSpace($Message)) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        $branch = git branch --show-current
        $Message = "Deploy: $timestamp - $branch"
    }
    
    # Commit changes
    Write-ColorOutput Yellow "💾 Committing changes..."
    Write-ColorOutput Cyan "   Message: $Message"
    git commit -m $Message
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "❌ Failed to commit changes"
        exit 1
    }
    
    Write-ColorOutput Green "✅ Changes committed"
    Write-Output ""
}

# Get current branch
$currentBranch = git branch --show-current
Write-ColorOutput Cyan "🌿 Current branch: $currentBranch"
Write-Output ""

# Push to remote
Write-ColorOutput Yellow "📤 Pushing to remote..."
git push origin $currentBranch

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "❌ Failed to push to remote"
    Write-Output ""
    Write-ColorOutput Yellow "💡 Tip: Make sure you have push access and remote is configured"
    exit 1
}

Write-ColorOutput Green "✅ Successfully pushed to remote"
Write-Output ""

# Check if Vercel is connected
Write-ColorOutput Cyan "🔍 Checking Vercel connection..."
$vercelCheck = git remote -v | Select-String "vercel"

if ($vercelCheck) {
    Write-ColorOutput Green "✅ Vercel remote detected"
    Write-Output ""
    Write-ColorOutput Cyan "📡 Vercel will auto-deploy on push"
    Write-Output "   Check deployment status at: https://vercel.com/dashboard"
} else {
    Write-ColorOutput Yellow "⚠️  No Vercel remote detected"
    Write-Output ""
    Write-ColorOutput Cyan "💡 To connect Vercel:"
    Write-Output "   1. Run: vercel"
    Write-Output "   2. Or connect via Vercel dashboard"
}

Write-Output ""
Write-ColorOutput Green "✨ Deployment complete!"
Write-Output ""
Write-ColorOutput Cyan "📊 Summary:"
Write-Output "   Branch: $currentBranch"
Write-Output "   Commit: $(git log -1 --oneline)"
Write-Output "   Remote: origin"
Write-Output ""
Write-ColorOutput Yellow "⏳ Vercel deployment usually takes 2-3 minutes"
Write-Output "   Monitor at: https://vercel.com/dashboard"
