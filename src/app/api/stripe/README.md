# Payment Flow - How Accounts Are Linked

## 🔑 Key Answer: **YES, Your Account Status WILL Change**

When you pay (even in incognito), the webhook automatically:
1. ✅ Gets your email from Stripe
2. ✅ Finds or creates your account
3. ✅ Upgrades you to Pro (`plan='member'`)
4. ✅ Sends magic link email (if configured)

---

## 📋 How It Works

### **Step 1: You Pay**
- Click "Unlock" → Stripe checkout
- Enter email: `your@email.com`
- Pay $9/month
- **Stripe collects your email**

### **Step 2: Webhook Receives Payment**
- Stripe sends webhook to `/api/stripe/webhook`
- Webhook gets: `customerEmail` from Stripe checkout

### **Step 3: Account Matching**
```typescript
// Webhook checks: Does member exist with this email?
const existingMember = await supabaseAdmin
  .from('members')
  .select('*')
  .eq('email', customerEmail)  // ← EMAIL IS THE KEY
  .single();
```

### **Step 4A: Account EXISTS (Same Email)**
- ✅ **Upgrades existing account**
- Sets `plan='member'`
- Links Stripe customer ID
- **You can log in with existing account → See Pro access**

### **Step 4B: Account DOESN'T Exist (New Email)**
- ✅ **Creates new account**
- Creates Supabase auth user
- Creates member record with `plan='member'`
- Sends magic link email
- **You log in with new account → See Pro access**

---

## 🎯 Real-World Scenarios

### **Scenario 1: You Have Account, Pay with Same Email**
```
You: Have account with grant@example.com
Payment: Pay with grant@example.com in incognito
Result: ✅ Existing account upgraded to Pro
Action: Log in with grant@example.com → See Pro access
```

### **Scenario 2: You Have Account, Pay with Different Email**
```
You: Have account with old@example.com
Payment: Pay with new@example.com in incognito
Result: ⚠️ NEW account created with new@example.com
Action: Log in with new@example.com → See Pro access
Note: You now have TWO accounts (old@example.com = free, new@example.com = Pro)
```

### **Scenario 3: No Account, Pay Anonymously**
```
You: No account
Payment: Pay with test@example.com in incognito
Result: ✅ New account created with test@example.com
Action: Check email for magic link → Log in → See Pro access
```

---

## 🔍 How to Verify It Worked

### **After Payment:**

1. **Check Supabase Database:**
   ```sql
   SELECT * FROM members 
   WHERE email = 'your@email.com';
   ```
   - Should see: `plan='member'`
   - Should see: `stripe_customer_id` and `stripe_subscription_id`

2. **Check Email:**
   - Look for magic link email from Supabase
   - Subject: "Confirm your signup" or similar

3. **Log In:**
   - Use magic link OR password reset
   - Go to `/okc/feed`
   - Should see ALL posts (no paywall)

---

## ⚠️ Important Notes

### **Email Matching:**
- ✅ **Same email = Same account** (upgrades existing)
- ⚠️ **Different email = New account** (creates separate account)

### **Magic Link Email:**
- Supabase sends automatically if email is configured
- If email doesn't arrive:
  - Check spam folder
  - Use "Forgot Password" to reset
  - Account is still upgraded (just need to log in)

### **Incognito Mode:**
- ✅ **Works perfectly** - No login required to pay
- ✅ **Account created/upgraded automatically**
- ✅ **Email sent for login**

---

## 🧪 Test It Yourself

1. **Go incognito** → Visit `/okc/feed`
2. **Click "Unlock"** → Go to Stripe checkout
3. **Enter email** (use test email or your real email)
4. **Pay $9/month** (use Stripe test card: `4242 4242 4242 4242`)
5. **After payment:**
   - Check Supabase `members` table
   - Should see account with `plan='member'`
   - Check email for magic link
   - Log in → See Pro access

---

## 💡 Best Practice

**Recommendation:** Always use the same email you want to log in with. If you have an existing account, use that email when paying.

