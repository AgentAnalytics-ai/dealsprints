# 🚀 Deployment Guide - DealSprints

## Quick Deploy Scripts

Two PowerShell scripts are available for smooth deployment to Vercel:

### 1. **Full Deploy Script** (`deploy.ps1`)
Interactive script with prompts and checks.

**Usage:**
```powershell
.\deploy.ps1
```

**Or with custom commit message:**
```powershell
.\deploy.ps1 -Message "Add realtor dashboard"
```

**Features:**
- ✅ Checks git status
- ✅ Shows what will be committed
- ✅ Prompts for confirmation
- ✅ Auto-generates commit message
- ✅ Pushes to remote
- ✅ Checks Vercel connection

### 2. **Quick Deploy Script** (`deploy-quick.ps1`)
Fast, no-prompts version for quick deployments.

**Usage:**
```powershell
.\deploy-quick.ps1
```

**Or with custom commit message:**
```powershell
.\deploy-quick.ps1 -Message "Fix map bug"
```

**Features:**
- ⚡ No prompts
- ⚡ Auto-commits all changes
- ⚡ Auto-pushes to current branch
- ⚡ Perfect for quick fixes

---

## Using npm Scripts

You can also use npm scripts:

```bash
npm run deploy          # Full deploy script
npm run deploy:quick    # Quick deploy script
```

---

## Manual Deployment

If you prefer manual deployment:

```powershell
# 1. Stage changes
git add .

# 2. Commit
git commit -m "Your commit message"

# 3. Push
git push origin main

# Vercel will auto-deploy on push
```

---

## Vercel Auto-Deployment

Once connected to Vercel:
- ✅ Every push to `main` branch → Auto-deploys
- ✅ Every push to other branches → Preview deployment
- ✅ No manual steps needed after push

---

## Troubleshooting

### Script won't run?
```powershell
# Allow PowerShell scripts to run
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Git not found?
- Install Git: https://git-scm.com/download/win
- Or use Git Bash instead

### Vercel not deploying?
- Check Vercel dashboard: https://vercel.com/dashboard
- Verify git remote: `git remote -v`
- Connect Vercel: Run `vercel` command

---

## Best Practices

1. **Test locally first**: `npm run dev`
2. **Check for errors**: `npm run lint`
3. **Commit meaningful messages**: Describe what changed
4. **Push to feature branch first**: Test before merging to main
5. **Monitor Vercel dashboard**: Check deployment status

---

## Quick Reference

```powershell
# Full deploy (with prompts)
.\deploy.ps1

# Quick deploy (no prompts)
.\deploy-quick.ps1

# Custom message
.\deploy.ps1 -Message "Add new feature"

# Check status
git status

# View recent commits
git log --oneline -5
```
