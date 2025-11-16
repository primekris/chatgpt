# 🚀 Complete Deployment Guide for Render (Free Tier)

## Quick Overview
This guide will help you deploy your ChatGPT clone to Render's free tier using GitHub.

**Time Required**: 10-15 minutes  
**Cost**: $0 (Free tier)

---

## Step 1: Prepare Your Code

### 1.1 Verify Environment Variables
Make sure your `.env` file has:
```env
TOGETHER_API_KEY=tgp_v1_UDj9FvOUFoGo8r5DILfuH1Ic2vV3DB4URirwmd4Mmmw
```

⚠️ **IMPORTANT**: Do NOT commit `.env` file to GitHub!

---

## Step 2: Push to GitHub

### 2.1 Create a GitHub Account
- Go to [github.com](https://github.com)
- Sign up for free if you don't have an account

### 2.2 Create a New Repository
1. Click the "+" icon in top right → "New repository"
2. Repository name: `chatgpt-clone` (or any name)
3. Description: "ChatGPT-style AI chat application"
4. Choose **Public** (required for free tier) or **Private**
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

### 2.3 Push Your Code to GitHub

Open terminal in your project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - ChatGPT clone app"

# Add GitHub as remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/chatgpt-clone.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Example**:
```bash
git remote add origin https://github.com/johnsmith/my-chatgpt.git
git push -u origin main
```

✅ Your code is now on GitHub!

---

## Step 3: Deploy to Render

### 3.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up using **GitHub** (recommended - makes deployment easier)
4. Authorize Render to access your GitHub repositories

### 3.2 Create a New Web Service

1. **Click "New +"** in the top right
2. Select **"Web Service"**
3. Click **"Connect repository"** (or "Build and deploy from Git")
4. Find and select your `chatgpt-clone` repository
5. Click **"Connect"**

### 3.3 Configure Your Web Service

Fill in the following details:

| Field | Value | Description |
|-------|-------|-------------|
| **Name** | `chatgpt-clone-app` | Your app's URL will be this + `.onrender.com` |
| **Region** | `Oregon (US West)` | Choose closest to your users |
| **Branch** | `main` | Git branch to deploy |
| **Root Directory** | (leave empty) | Project is in root folder |
| **Runtime** | `Node` | Auto-detected |
| **Build Command** | `npm install` | Installs dependencies |
| **Start Command** | `npm run dev` | Starts the server |
| **Instance Type** | `Free` | Free tier with limitations |

### 3.4 Add Environment Variables

1. Scroll down to **"Environment Variables"** section
2. Click **"Add Environment Variable"**
3. Add your API key:
   - **Key**: `TOGETHER_API_KEY`
   - **Value**: `tgp_v1_UDj9FvOUFoGo8r5DILfuH1Ic2vV3DB4URirwmd4Mmmw`
4. Click **"Save"**

### 3.5 Deploy!

1. Click **"Create Web Service"** at the bottom
2. Render will start building your app
3. Wait 3-5 minutes for first deployment
4. Watch the logs for any errors

---

## Step 4: Access Your Live App

### 4.1 Get Your URL
After deployment completes:
- Your app URL: `https://chatgpt-clone-app.onrender.com`
- Replace `chatgpt-clone-app` with whatever name you chose

### 4.2 Test Your App
1. Open the URL in your browser
2. Wait 30-50 seconds if it's sleeping (free tier)
3. Start chatting with the AI!

✅ **Congratulations!** Your app is live! 🎉

---

## Understanding Render Free Tier

### What You Get (FREE) ✅
- ✅ 750 hours/month of runtime
- ✅ Automatic HTTPS (SSL certificate)
- ✅ Automatic deployments on Git push
- ✅ Custom domain support
- ✅ Environment variables
- ✅ Access to logs

### Limitations ⚠️
- ⚠️ App sleeps after 15 minutes of inactivity
- ⚠️ Cold start takes 30-50 seconds
- ⚠️ Limited to 512 MB RAM
- ⚠️ Shared CPU

### Keeping Your App Awake (Optional)

**Option 1: UptimeRobot (Free)**
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Sign up for free
3. Add new monitor:
   - Type: HTTP(s)
   - URL: Your Render app URL
   - Interval: 14 minutes
4. UptimeRobot will ping your app every 14 minutes to keep it awake

**Option 2: Upgrade to Paid ($7/month)**
- No sleep
- Faster
- More resources
- Recommended for production

---

## Updating Your App

### Making Changes

1. **Edit your code locally**
2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Updated feature X"
   ```
3. **Push to GitHub**:
   ```bash
   git push
   ```
4. **Automatic deployment**: Render automatically deploys when you push!

---

## Troubleshooting

### Problem: Build Failed ❌

**Solution**:
1. Check Render build logs
2. Common issues:
   - Missing dependencies in `package.json`
   - Environment variable not set
   - Node version mismatch

**Fix**:
```bash
# Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Updated dependencies"
git push
```

### Problem: App Returns 500 Error ❌

**Solution**:
1. Check Render runtime logs
2. Verify `TOGETHER_API_KEY` is set correctly
3. Check Together AI account has credits

### Problem: Can't Access API Key ❌

**Solution**:
1. Go to Render dashboard
2. Click your web service
3. Go to "Environment" tab
4. Verify `TOGETHER_API_KEY` is there
5. Click "Save Changes" if you edited it

### Problem: Voice Input Not Working ❌

**Solution**:
- Voice input requires HTTPS (Render provides this automatically)
- Only works in Chrome/Edge browsers
- Browser must grant microphone permission

### Problem: App is Slow ❌

**Reason**: Free tier has limited resources and cold starts

**Solutions**:
1. Use UptimeRobot to prevent sleep (free)
2. Upgrade to paid tier ($7/month)
3. Optimize your code to use less memory

---

## Custom Domain (Optional)

### Add Your Own Domain

1. **In Render Dashboard**:
   - Go to your web service
   - Click "Settings"
   - Scroll to "Custom Domain"
   - Click "Add Custom Domain"
   - Enter: `chat.yourdomain.com`

2. **In Your Domain Provider**:
   - Add CNAME record:
     - Name: `chat`
     - Value: `your-app.onrender.com`

3. **Wait for DNS**: Can take 1-48 hours

---

## Monitoring Your App

### View Logs
1. Go to Render dashboard
2. Click your web service
3. Click "Logs" tab
4. See real-time logs

### Check Health
- Visit: `https://your-app.onrender.com/api/health`
- Should return: `{"status":"ok","timestamp":"...","models":{"together":true}}`

---

## Cost Breakdown

| Tier | Cost | Features |
|------|------|----------|
| **Free** | $0/month | 750 hrs, sleeps after 15 min |
| **Starter** | $7/month | Always on, 512 MB RAM |
| **Standard** | $25/month | 2 GB RAM, better CPU |
| **Pro** | $85/month | 4 GB RAM, dedicated CPU |

**Recommendation**: Start with Free, upgrade to Starter if you need always-on.

---

## Security Checklist ✅

Before going live, ensure:

- ✅ API keys in environment variables (not in code)
- ✅ `.env` file in `.gitignore`
- ✅ HTTPS enabled (automatic on Render)
- ✅ No sensitive data in logs
- ✅ Rate limiting implemented (if needed)

---

## Next Steps

After deployment:

1. ✅ Test all features (chat, voice, file upload, export)
2. ✅ Share your app URL with friends
3. ✅ Set up UptimeRobot to prevent sleep
4. ✅ Consider custom domain
5. ✅ Monitor usage and logs

---

## Support & Resources

### Need Help?
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Together AI Docs**: [docs.together.ai](https://docs.together.ai)
- **GitHub Issues**: Create an issue in your repo

### Useful Links
- Render Dashboard: [dashboard.render.com](https://dashboard.render.com)
- Together AI Console: [api.together.xyz](https://api.together.xyz)
- UptimeRobot: [uptimerobot.com](https://uptimerobot.com)

---

**🎉 That's it! Your ChatGPT clone is now live on the internet!**

Enjoy your AI chat application! If you have questions, check the main README.md for more details.
