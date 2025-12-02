# 🔐 EXPENZO Environment Variables Setup Guide

## 📋 Quick Setup for Vercel Deployment

### **Step 1: In Vercel Dashboard**

After importing your project to Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

---

## ✅ Required Environment Variables

### **For Production (Vercel):**

```bash
# JWT Authentication
JWT_SECRET=expenzo_prod_secret_key_2024_CHANGE_THIS_TO_RANDOM_STRING

# JWT Token Expiry
JWT_EXPIRE=7d

# Password Hashing Rounds
BCRYPT_ROUNDS=12

# Node Environment
NODE_ENV=production

# Frontend URL (Auto-detected by Vercel, but you can override)
FRONTEND_URL=https://your-project.vercel.app

# API URL for Frontend (MUST start with VITE_)
VITE_API_URL=https://your-project.vercel.app/api

# App Info
VITE_APP_NAME=EXPENZO
VITE_APP_VERSION=1.0.0
```

---

## 🎯 How to Set in Vercel Dashboard

### **Method 1: Via Vercel UI**

1. Open your project in Vercel: https://vercel.com/dashboard
2. Select your **EXPENZO** project
3. Click **Settings** tab
4. Click **Environment Variables** in sidebar
5. For each variable:
   - **Name:** `JWT_SECRET`
   - **Value:** `your-random-secure-string-here`
   - **Environment:** Select **Production**, **Preview**, and **Development**
   - Click **Save**

### **Method 2: Via Vercel CLI** (If installed)

```powershell
# From your project directory
vercel env add JWT_SECRET production
# Enter value when prompted

vercel env add VITE_API_URL production
# Enter: https://your-project.vercel.app/api
```

---

## 🔑 Generate Secure JWT_SECRET

Use one of these methods:

### **PowerShell:**
```powershell
# Generate random 32-character string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### **Node.js:**
```javascript
require('crypto').randomBytes(32).toString('hex')
```

### **Online Generator:**
Visit: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")

---

## 📝 Complete Environment Variables List

### **Backend Variables:**
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `NODE_ENV` | `production` | ✅ | Node environment |
| `JWT_SECRET` | `abc123...` | ✅ | JWT signing key (min 32 chars) |
| `JWT_EXPIRE` | `7d` | ✅ | Token expiry time |
| `BCRYPT_ROUNDS` | `12` | ✅ | Password hashing rounds |
| `FRONTEND_URL` | `https://expenzo.vercel.app` | ✅ | Frontend URL for CORS |
| `PORT` | `5000` | ⚪ | Port (auto-set by Vercel) |

### **Frontend Variables (VITE_*):**
| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `VITE_API_URL` | `https://expenzo.vercel.app/api` | ✅ | Backend API endpoint |
| `VITE_APP_NAME` | `EXPENZO` | ⚪ | App display name |
| `VITE_APP_VERSION` | `1.0.0` | ⚪ | App version |

---

## 🚀 After Adding Variables

1. **Trigger Redeploy:**
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**
   - Select **Use existing Build Cache: No**

2. **Verify Variables:**
   ```bash
   # Check logs in Vercel dashboard
   # Look for successful environment variable loading
   ```

---

## 🔧 Local Development Setup

Create these files:

### **backend/.env:**
```bash
NODE_ENV=development
PORT=5000
JWT_SECRET=dev_secret_key_for_local_testing_only
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
FRONTEND_URL=http://localhost:5173
DEBUG=true
```

### **frontend/.env:**
```bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=EXPENZO
VITE_APP_VERSION=1.0.0
```

---

## ⚠️ Important Security Notes

1. **Never commit .env files to Git** (already in .gitignore)
2. **Use different secrets for production vs development**
3. **Regenerate JWT_SECRET** if compromised
4. **Keep BCRYPT_ROUNDS at 12** for security
5. **Update FRONTEND_URL** to your actual Vercel domain

---

## 🔍 Troubleshooting

### **Issue: API calls failing**
- ✅ Check `VITE_API_URL` matches your Vercel domain
- ✅ Ensure it ends with `/api`
- ✅ Redeploy after changing variables

### **Issue: Authentication not working**
- ✅ Verify `JWT_SECRET` is set
- ✅ Check `JWT_EXPIRE` format (e.g., `7d`, `24h`)
- ✅ Ensure variable is in **Production** environment

### **Issue: CORS errors**
- ✅ Set `FRONTEND_URL` to your Vercel URL
- ✅ Include `https://` prefix
- ✅ No trailing slash

---

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [JWT Best Practices](https://jwt.io/introduction)

---

## ✅ Checklist Before Deploying

- [ ] Set `JWT_SECRET` (secure random string)
- [ ] Set `VITE_API_URL` (your Vercel domain + `/api`)
- [ ] Set `FRONTEND_URL` (your Vercel domain)
- [ ] Verified all variables in Production environment
- [ ] Triggered redeploy after adding variables
- [ ] Tested authentication after deployment

---

**Need help?** Check Vercel deployment logs for environment variable errors.
