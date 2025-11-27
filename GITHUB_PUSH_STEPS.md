# How to Push Code to GitHub - Step by Step Guide

## Prerequisites
- Git installed on your computer
- GitHub account (RawanMohamed1)
- Personal Access Token (you already have one)

## Step 1: Open Terminal/Command Prompt
- Press `Win + R`
- Type `cmd` and press Enter
- Navigate to your project folder:
  ```bash
  cd "C:\Users\lenovo\OneDrive\Desktop\united-company-website"
  ```

## Step 2: Check Git Status
```bash
git status
```
This shows if there are any uncommitted changes.

## Step 3: Initialize Git (if not already done)
```bash
git init
```

## Step 4: Add All Files
```bash
git add .
```
This stages all files for commit.

## Step 5: Create Initial Commit
```bash
git commit -m "Initial commit: United Company ANA website"
```

## Step 6: Set Branch to Main
```bash
git branch -M main
```

## Step 7: Add GitHub Remote
```bash
git remote add origin https://github.com/RawanMohamed1/united-company-website.git
```

**Note:** If you get an error saying remote already exists, use:
```bash
git remote set-url origin https://github.com/RawanMohamed1/united-company-website.git
```

## Step 8: Push to GitHub

### Option A: Using Personal Access Token in URL (Easiest)
```bash
git remote set-url origin https://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@github.com/RawanMohamed1/united-company-website.git
git push -u origin main
```

### Option B: Using Credential Helper (More Secure)
```bash
git remote set-url origin https://github.com/RawanMohamed1/united-company-website.git
git push -u origin main
```
When prompted:
- Username: `RawanMohamed1`
- Password: `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`

## Step 9: Verify Push
Go to: https://github.com/RawanMohamed1/united-company-website
You should see all your files there!

## Troubleshooting

### If repository doesn't exist:
1. Go to https://github.com/new
2. Repository name: `united-company-website`
3. Description: (optional)
4. Choose Public or Private
5. **DO NOT** check "Initialize this repository with a README"
6. Click "Create repository"
7. Then run Step 8 again

### If you get authentication errors:
- Make sure your Personal Access Token is correct
- Token should have `repo` permissions
- Try using GitHub Desktop app instead

### If you get "remote already exists" error:
```bash
git remote remove origin
git remote add origin https://github.com/RawanMohamed1/united-company-website.git
```

## Quick Command Summary (Copy & Paste)
```bash
cd "C:\Users\lenovo\OneDrive\Desktop\united-company-website"
git init
git add .
git commit -m "Initial commit: United Company ANA website"
git branch -M main
git remote add origin https://github.com/RawanMohamed1/united-company-website.git
git remote set-url origin https://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@github.com/RawanMohamed1/united-company-website.git
git push -u origin main
```

## After Successful Push
Your code is now on GitHub! You can:
- View it at: https://github.com/RawanMohamed1/united-company-website
- Share the repository link
- Set up GitHub Pages for hosting
- Continue making changes and pushing updates

