# 🚀 DealSprints OKC Membership System - Implementation Guide

## 👥 Your Expert Team

**Product Manager** - Strategy, prioritization, user experience  
**Technical Architect** - System design, database schema, API design  
**Next.js Engineer** - Frontend, routing, React components  
**Backend Engineer** - API routes, Supabase, authentication  
**DevOps Engineer** - Vercel deployment, monitoring, cron jobs  
**Stripe Integration Specialist** - Payment flows, webhooks, subscriptions  
**Legal Advisor** - Terms of Service, Privacy Policy, compliance  
**Growth Strategist** - Pricing, positioning, go-to-market  

---

## 📋 PHASE 1: Authentication Foundation

### 🤖 **What the Agent Will Do:**

1. **Create Supabase members table** (SQL schema)
2. **Build authentication utilities** (`src/lib/auth.ts`)
3. **Create login page** (`/login`)
4. **Create signup page** (`/signup`)
5. **Create member dashboard** (`/dashboard`)
6. **Add session management** (middleware)
7. **Test and verify** everything works

### 👤 **What You Need to Do:**

#### **Before We Start:**
- [ ] Open Supabase dashboard: https://supabase.com/dashboard/project/cshnrqhtwwuombfoqqws
- [ ] Have access to your Vercel dashboard
- [ ] Be ready to test signup/login flows

#### **Step 1.1: Enable Supabase Auth (5 minutes)**
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Email" provider
3. Configure email templates (or use defaults)
4. **IMPORTANT:** Under "Auth" → "URL Configuration":
   - Site URL: `https://dealsprints.com`
   - Redirect URLs: Add `https://dealsprints.com/auth/callback`

#### **Step 1.2: Run SQL to Create Members Table (2 minutes)**
I'll provide the SQL - you'll paste it into Supabase SQL Editor and run it.

#### **After Agent Builds (Testing):**
- [ ] Try signing up at `/signup`
- [ ] Check your email for confirmation (if enabled)
- [ ] Try logging in at `/login`
- [ ] Visit `/dashboard` while logged in
- [ ] Verify you see your profile
- [ ] Try logging out

#### **Safety Check:**
- [ ] Visit `/api/cron/scrape-okc?secret=YOUR_SECRET` → Should still work
- [ ] Visit `/admin/review` → Should still show posts
- [ ] Visit `/okc/feed` → Should still display feed

**If ANY of these fail, we STOP and debug before Phase 2.**

---

## 💳 PHASE 2: Stripe Integration

### 🤖 **What the Agent Will Do:**

1. **Create Stripe checkout API** (`/api/stripe/checkout`)
2. **Create Stripe webhook handler** (`/api/stripe/webhook`)
3. **Build pricing page** (`/pricing`)
4. **Add "Upgrade" buttons** throughout site
5. **Handle subscription status** updates
6. **Test with Stripe test mode**

### 👤 **What You Need to Do:**

#### **Step 2.1: Set Up Stripe Account (15 minutes)**
1. Go to https://stripe.com and create/login to account
2. Navigate to: **Products** → **Add Product**
   - Name: "DealSprints OKC Member"
   - Description: "Monthly membership to OKC business directory"
   - Pricing: **$9.00 USD / month**
   - Billing period: **Monthly**
   - Click **Save**
3. Copy the **Price ID** (starts with `price_...`)

#### **Step 2.2: Get Stripe API Keys (5 minutes)**
1. Go to: **Developers** → **API keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - **KEEP SECRET!**

#### **Step 2.3: Add Stripe Keys to Vercel (5 minutes)**
1. Go to Vercel → DealSprints → Settings → Environment Variables
2. Add these 3 new variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PRICE_ID=price_...
   ```
3. Click "Redeploy" after adding

#### **Step 2.4: Set Up Stripe Webhook (10 minutes)**
1. Go to Stripe: **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://dealsprints.com/api/stripe/webhook`
4. Listen to events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_...`)
6. Add to Vercel env vars:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

#### **After Agent Builds (Testing):**
- [ ] Visit `/pricing` page
- [ ] Click "Join Now" button
- [ ] Use Stripe test card: `4242 4242 4242 4242`
- [ ] Complete checkout
- [ ] Verify you're redirected to `/dashboard`
- [ ] Check Supabase: Your `members.plan` should be `'member'`
- [ ] Check Stripe Dashboard: Payment should appear

#### **Safety Check:**
- [ ] Verify cron still works
- [ ] Verify admin still works
- [ ] Verify feed still works

---

## 🔒 PHASE 3: Content Gating & Directory

### 🤖 **What the Agent Will Do:**

1. **Update `/okc/members`** to fetch real Supabase data
2. **Add session checks** to profile pages
3. **Hide contact info** for non-members
4. **Add "Join to Connect"** CTAs
5. **Build profile editor** for members
6. **Add member verification badges**

### 👤 **What You Need to Do:**

#### **Step 3.1: Create Your First Real Member Profile (10 minutes)**
After auth is built, you'll:
1. Sign up as a test member at `/signup`
2. Pay $9 (use test card if still in test mode)
3. Complete your profile:
   - Business name
   - Logo upload
   - Bio
   - Social links
   - Contact info
4. This becomes the template for other members

#### **After Agent Builds (Testing):**
**As logged-out user:**
- [ ] Visit `/okc/members` → See directory
- [ ] Click on a member → See profile but contact info is blurred/hidden
- [ ] See "Join to Connect" button
- [ ] Click button → Redirected to `/pricing`

**As logged-in member:**
- [ ] Visit `/okc/members` → See directory
- [ ] Click on a member → See FULL profile with contact info
- [ ] See phone, email, website links (all clickable)
- [ ] No "Join to Connect" button

**Edit your own profile:**
- [ ] Visit `/dashboard/profile/edit`
- [ ] Update your bio
- [ ] Upload new logo
- [ ] Save changes
- [ ] Verify changes appear on public profile

---

## 🚀 PHASE 4: Launch Prep

### 🤖 **What the Agent Will Do:**

1. **Polish UI/UX** across all pages
2. **Add onboarding flow** for new members
3. **Create email templates** (welcome, profile approved, etc.)
4. **Add analytics tracking** (optional)
5. **Final testing** across all flows

### 👤 **What You Need to Do:**

#### **Step 4.1: Write Copy (30 minutes)**
- [ ] Homepage hero text (why join?)
- [ ] Pricing page descriptions
- [ ] Member testimonials (if you have any)
- [ ] FAQ section
- [ ] Email templates (welcome, tips, etc.)

#### **Step 4.2: Design Assets (1 hour)**
- [ ] Verified badge design (or use default)
- [ ] Social media graphics
- [ ] Email header/footer
- [ ] Directory thumbnail images

#### **Step 4.3: Legal Compliance (Important!)**
- [ ] Review Terms of Service
- [ ] Review Privacy Policy (mention Stripe, Supabase)
- [ ] Add refund policy (Stripe requires this)
- [ ] Add cancellation policy

#### **Step 4.4: Switch Stripe to Live Mode (10 minutes)**
1. Go to Stripe → Toggle to "Live mode"
2. Get new API keys (start with `pk_live_...` and `sk_live_...`)
3. Update Vercel env vars with live keys
4. Update webhook endpoint to live mode
5. **Test one live payment yourself** ($9 charged to your card)

#### **Step 4.5: Recruit Founding Members (1-2 weeks)**
- [ ] Make list of 20 OKC businesses you know
- [ ] Send personal outreach (email/DM)
- [ ] Offer: "Founding member - first 3 months free" (use Stripe coupon)
- [ ] Goal: Get 5-10 to sign up
- [ ] Collect testimonials

---

## 🎯 Success Metrics

### **Phase 1 Complete When:**
- ✅ You can sign up, log in, log out
- ✅ Dashboard shows your profile
- ✅ Cron automation still works
- ✅ Admin review still works

### **Phase 2 Complete When:**
- ✅ You can complete a test payment
- ✅ Stripe webhook updates your plan to "member"
- ✅ Dashboard reflects your membership status

### **Phase 3 Complete When:**
- ✅ Non-members see blurred contact info
- ✅ Members see full contact info
- ✅ Profile editing works
- ✅ Directory shows real members

### **Phase 4 Complete When:**
- ✅ Live Stripe payments work
- ✅ 5+ founding members signed up
- ✅ All pages polished and tested
- ✅ Ready to announce publicly

---

## 📞 Communication Protocol

### **During Each Phase:**
1. **Agent will:** Announce start of task, explain what's being built
2. **Agent will:** Show code snippets as work progresses
3. **Agent will:** Deploy and provide testing instructions
4. **You will:** Test and confirm it works
5. **Agent will:** Mark TODO as complete
6. **Both:** Agree to move to next phase

### **If Something Breaks:**
1. **STOP IMMEDIATELY** - Don't proceed to next phase
2. Agent will debug and show logs
3. Agent will propose fix
4. Test fix
5. If still broken: Rollback via Git
6. Re-attempt fix in dev environment first

---

## 🛠️ Emergency Rollback

If at ANY point something breaks:

```bash
# Check what commit we're on
git log --oneline -5

# Rollback to previous working version
git revert HEAD
git push

# Vercel will auto-deploy the rollback
```

Your cron automation is in separate files, so it will keep running even if we rollback.

---

## ⏱️ Estimated Timeline

**Phase 1 (Auth):** 2-3 hours of agent work + 30 min your setup  
**Phase 2 (Stripe):** 1-2 hours of agent work + 45 min your setup  
**Phase 3 (Directory):** 2-3 hours of agent work + 30 min your testing  
**Phase 4 (Launch Prep):** 1-2 hours of agent work + 2-3 days your outreach  

**Total:** ~3 days of development, 1-2 weeks to recruit first members

---

## 🎓 What You'll Learn

By the end of this, you'll understand:
- ✅ How Supabase Auth works
- ✅ How Stripe subscription webhooks work
- ✅ How to gate content based on user roles
- ✅ How to manage a membership business
- ✅ How to deploy updates without breaking production

---

## 🚦 Current Status

**Ready to start Phase 1?**

When you say **"Start Phase 1"**, I will:
1. Mark the first TODO as in-progress
2. Show you the Supabase SQL to create members table
3. Build all auth pages and utilities
4. Deploy and give you testing instructions
5. Wait for your confirmation before Phase 2

**Are you ready to begin?** 🚀

