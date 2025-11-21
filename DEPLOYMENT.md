# 🚀 GitHub Pages Deployment Guide

This guide explains how to deploy your Tic-Tac-Toe game to GitHub Pages.

## Prerequisites

- Git installed on your computer
- A GitHub account
- Your code already in a Git repository (✅ You have this!)

---

## 📝 Step-by-Step Deployment Instructions

### Step 1: Push Your Code to GitHub

If you haven't already created a GitHub repository:

1. **Go to GitHub** and create a new repository:
   - Visit [https://github.com/new](https://github.com/new)
   - Repository name: `TicTacToe` (or any name you prefer)
   - Keep it **Public** (required for free GitHub Pages)
   - **Do NOT** initialize with README (you already have one)
   - Click "Create repository"

2. **Link your local repository to GitHub** (if not already done):

   ```powershell
   # Check if you already have a remote
   git remote -v
   
   # If no remote exists, add it (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/TicTacToe.git
   
   # If remote exists but is wrong, update it
   git remote set-url origin https://github.com/YOUR_USERNAME/TicTacToe.git
   ```

3. **Push your code to GitHub**:

   ```powershell
   # Make sure you're on the main branch
   git branch -M main
   
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Add GitHub Pages deployment workflow"
   
   # Push to GitHub
   git push -u origin main
   ```

---

### Step 2: Enable GitHub Pages

1. **Go to your repository on GitHub**:
   - Navigate to `https://github.com/YOUR_USERNAME/TicTacToe`

2. **Go to Settings**:
   - Click the **Settings** tab (⚙️ icon at the top)

3. **Configure GitHub Pages**:
   - In the left sidebar, click **"Pages"** (under "Code and automation")
   - Under **"Build and deployment"**:
     - **Source**: Select "GitHub Actions"
   - Click **Save**

---

### Step 3: Deploy!

Once you've pushed your code with the workflow file (`.github/workflows/deploy.yml`), GitHub Actions will automatically:

1. ✅ Install dependencies
2. ✅ Run tests
3. ✅ Build your project
4. ✅ Deploy to GitHub Pages

**Monitor the deployment**:
- Go to the **"Actions"** tab in your GitHub repository
- You should see a workflow run called "Deploy to GitHub Pages"
- Wait for it to complete (usually takes 1-2 minutes)

---

### Step 4: Access Your Deployed Website

Your website will be available at:

```
https://YOUR_USERNAME.github.io/TicTacToe/
```

🎉 **That's it!** Your Tic-Tac-Toe game is now live on the internet!

---

## 🔄 Continuous Deployment

The best part: **Every time you push to the `main` branch**, GitHub will automatically rebuild and redeploy your site!

```powershell
# Make some changes to your code
git add .
git commit -m "Update game UI"
git push

# GitHub Actions will automatically deploy the changes!
```

---

## 🛠️ Manual Deployment Trigger

You can also trigger a deployment manually:

1. Go to the **Actions** tab in your GitHub repository
2. Click on **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** dropdown
4. Click the green **"Run workflow"** button

---

## 📋 Checklist

Before deployment, make sure:

- [ ] All your changes are committed
- [ ] Tests are passing locally (`npm test`)
- [ ] Build works locally (`npm run build`)
- [ ] `.github/workflows/deploy.yml` exists
- [ ] GitHub repository is **Public**
- [ ] GitHub Pages is configured to use "GitHub Actions"

---

## ❓ Troubleshooting

### Build fails on GitHub Actions

**Check the Actions log:**
1. Go to the Actions tab
2. Click on the failed workflow run
3. Check the error messages
4. Common issues:
   - Failed tests: Fix the failing tests
   - Build errors: Make sure `npm run build` works locally
   - Missing dependencies: Make sure all dependencies are in `package.json`

### Website shows 404

1. Make sure GitHub Pages is enabled in repository settings
2. Check that the deployment completed successfully
3. Wait a few minutes (sometimes it takes time to propagate)
4. Clear your browser cache

### Website shows blank page

1. Check browser console for errors (F12)
2. Make sure all assets are loading correctly
3. Verify the build output in the `dist` folder contains `index.html`

---

## 🎯 Quick Commands Reference

```powershell
# Build locally to test
npm run build

# Run tests
npm test

# Start dev server
npm start

# Check git status
git status

# Push to GitHub (triggers deployment)
git add .
git commit -m "Your commit message"
git push
```

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Webpack Documentation](https://webpack.js.org/)

---

**Happy Deploying! 🎮✨**
