# 📸 DealSprints OKC Content Workflow

**Goal:** Legal, consistent, professional content  
**Method:** Your photos + AI rewriting  
**Time:** 15-20 minutes/week

---

## ✅ 100% Legal Strategy

### Your Approach (Perfect):
1. **Take YOUR photos** → No copyright issues
2. **Read articles** → Get the facts
3. **AI rewrites** → Original content
4. **Link to source** → Attribution

**Why this works:**
- ✅ Photos = you own copyright
- ✅ Text = transformative AI (fair use)
- ✅ Facts = not copyrightable
- ✅ Attribution = good faith

---

## 📸 Weekly Photo Hunt (30 minutes)

### Locations to Visit:

**Development Sites:**
- Chisholm Creek (ongoing expansion)
- Wheeler District (mixed-use)
- First National Center (renovation)
- Innovation District (startups)

**New Openings:**
- Check OKC Biz Journal for "grand opening"
- Drive by locations mentioned
- Take exterior photos

**What to Capture:**
- ✅ Building exteriors
- ✅ Construction sites (with signage)
- ✅ Street view context
- ✅ "Coming Soon" signs
- ❌ Don't trespass on private property
- ❌ Avoid people's faces (privacy)

**Photo Specs:**
- Format: JPG or PNG
- Size: 1200x800px (or larger)
- Orientation: Landscape (horizontal)
- Quality: iPhone standard is fine

**Where to Store:**
```
/public/images/
  ├─ chisholm-creek-nov-2024.jpg
  ├─ revive-medspa-exterior.jpg
  ├─ wheeler-district-construction.jpg
  └─ plaza-cafe-opening.jpg
```

---

## ✍️ AI Rewriting Process

### Manual Method (Right Now):

**1. Find Article:**
```
Visit: journalrecord.com or oklahoman.com
Find: "Chisholm Creek expansion"
```

**2. Copy Key Facts:**
```
- What: Retail expansion
- Where: Chisholm Creek, Edmond
- Size: 200,000 sqft
- Timeline: Q4 2025
- Cost: $45M
```

**3. Use ChatGPT/Claude:**
```
Prompt: "Rewrite this as if I heard about it locally in OKC. 
Make it 2-3 sentences, casual but professional, mention the 
neighborhood. Don't copy the article, use your own words:

[paste key facts]"

Output: "Major retail expansion coming to Chisholm Creek in 
Edmond. The 200,000 sqft development includes upscale retail 
anchor and 15 boutique spaces, with completion targeted for 
late 2025. Expected to bring 200+ jobs to north OKC metro."
```

**4. Add to mockFeed.ts:**
```typescript
{
  id: '21',
  kind: 'development',
  title: 'Chisholm Creek Phase 3 expansion announced',
  location: 'Chisholm Creek, Edmond',
  date: '2024-11-05',
  summary: '[YOUR AI-GENERATED TEXT]',
  source: 'Journal Record',
  sourceUrl: 'https://journalrecord.com/article-link',
  imageUrl: '/images/chisholm-creek-nov-2024.jpg', // YOUR photo
  tags: ['retail', 'edmond', 'development'],
}
```

---

## 🎨 How Posts Stay Consistent (The Expert Way)

### Secret: `FeedCard.tsx` Component

Every post uses the **same component** = guaranteed consistency:

```typescript
// FeedCard.tsx enforces:
✅ Image: ALWAYS 224px height (h-56)
✅ Image: ALWAYS full-width
✅ Image: ALWAYS object-cover (cropped to fit)
✅ Title: ALWAYS 2 lines max (line-clamp-2)
✅ Summary: ALWAYS 3 lines max (line-clamp-3)
✅ Badges: ALWAYS same colors per type
✅ Footer: ALWAYS same layout (location | date)
✅ Spacing: ALWAYS same padding (p-6)
✅ Hover: ALWAYS same scale effect
```

### What This Means:

**Even if you add:**
- Short title or long title → Always 2 lines
- Short summary or long summary → Always 3 lines
- Small image or huge image → Always 224px height
- Any tags → Always same badge style

**Result:** Every post looks professional and uniform!

---

## 🎨 Design System Rules

### Image Guidelines:
```css
All post images:
- Height: 224px (h-56) - FIXED
- Width: 100% (w-full) - RESPONSIVE
- Crop: object-cover - AUTO-CROP CENTER
- Background: gray-100 if loading
```

**This means:**
- Vertical photos → auto-crop sides
- Horizontal photos → auto-crop top/bottom
- Square photos → auto-crop to fit
- **Always looks good!**

### Typography Rules:
```css
Title: 
  - Font: text-xl (20px)
  - Weight: font-bold
  - Lines: max 2 (line-clamp-2)
  - Color: text-gray-900

Summary:
  - Font: text-base (16px)
  - Weight: font-normal
  - Lines: max 3 (line-clamp-3)
  - Color: text-gray-600
```

### Badge Rules:
```css
Kind badges:
  - Development: Blue
  - Opening: Green
  - Expansion: Purple
  - Event: Orange
  - Data: Gray

Tag badges:
  - Background: gray-100
  - Text: gray-700
  - Size: text-xs
```

---

## 🤖 AI Rewriting Prompt Template

**Save this for ChatGPT/Claude:**

```
You are writing brief, local news updates for Oklahoma City 
business owners. Read the following article and rewrite it in 
your own words.

Requirements:
- 2-3 sentences maximum
- Mention the specific OKC neighborhood/area
- Professional but conversational tone
- Include key facts: what, where, size/scope, timeline
- No hype or editorial opinion
- Write as if you heard about it from a friend in the industry

Original article facts:
[PASTE KEY FACTS HERE]

Write the rewrite now:
```

**Example output:**
> "Whole Foods confirmed they're opening a 45,000 sqft flagship 
> store in Classen Curve this spring. It'll be their second 
> Oklahoma location, featuring prepared foods, outdoor seating, 
> and a beer/wine bar. Expected to bring 80+ jobs to north OKC."

---

## 📱 Your Weekly Workflow (15 minutes)

### Monday Morning Routine:

**1. Photo Hunt (10 min):**
```
- Check OKC Biz Journal for "new" stories
- Note 3-5 locations
- Drive by and snap photos
- Upload to /public/images/
```

**2. Content Creation (5 min):**
```
For each story:
  ├─ Copy key facts from article
  ├─ Paste into ChatGPT with prompt template
  ├─ Get AI rewrite (10 seconds)
  ├─ Add to mockFeed.ts with YOUR photo
  └─ Done!
```

**3. Deploy (1 min):**
```bash
git add .
git commit -m "Add 5 new OKC updates"
git push
# Vercel auto-deploys
```

**Total time:** 15-20 minutes for 5 professional posts!

---

## 🎨 Branding Consistency Guide

### How Experts Keep Everything Looking Same:

#### **1. Component-Based Design** (You already have this!)
```
Every post uses: <FeedCard post={post} />
  ↓
Automatically gets: same image size, same font, same spacing
```

#### **2. Design Tokens** (In your Tailwind config)
```typescript
// tailwind.config.ts already has:
colors: {
  brand: "#6A7CFF",   // Used everywhere
  deal: "#10B981",
  ink: "#0B1220",
}

// So every button using "bg-brand" = same color
```

#### **3. Utility Classes** (Tailwind pattern)
```typescript
// Instead of custom CSS, use standard classes:
rounded-2xl      // All cards same roundness
shadow-lg        // All cards same shadow
p-6              // All cards same padding
hover:scale-105  // All cards same hover effect
```

#### **4. Line Clamping** (Keeps uniform height)
```css
line-clamp-2  // Title always 2 lines
line-clamp-3  // Summary always 3 lines
h-56          // Images always 224px
```

**Result:** Even with different content, everything aligns!

---

## 🎨 Branding Thoughts

### Current Brand Identity: ✅ STRONG

**What's Working:**
1. **Logo** - Distinctive "D" shape, memorable
2. **Colors** - Blue/purple = professional + innovative
3. **Name** - "DealSprints OKC" = clear local focus
4. **Tagline** - "Your pulse on..." = dynamic, timely

### Enhancements for Launch:

#### **1. Voice & Tone:**
```
Write posts like:
"Just heard [business] is opening in [neighborhood]. 
They're bringing [what makes it special] to the area. 
Opens [when]."

NOT like:
"[Business] announced today they are pleased to..."

↑ Friendly, local, insider voice
```

#### **2. Photo Style:**
```
Keep consistent:
- Natural lighting (daytime)
- Street-level perspective
- Show context (not just building)
- Capture signage if visible
- Similar color grading
```

#### **3. Content Categories:**
```
80% - Developments & Openings (core value)
15% - Data insights (authority)
5%  - Events (engagement)
```

#### **4. Publishing Cadence:**
```
Mon: 3-5 new posts (start of week)
Wed: 2-3 updates (mid-week)
Fri: 1-2 posts (weekend preview)

= 8-10 posts/week
```

---

## 📐 Technical Specs for Consistency

### Post Card Dimensions:
```css
Component: <FeedCard />

Desktop (md:):
  - Width: 50% grid (2 columns)
  - Image: 100% width × 224px height
  - Card: auto height (clamped content)

Mobile:
  - Width: 100% (1 column)
  - Image: 100% width × 224px height
  - Card: auto height
```

### Content Limits:
```
Title: 80 characters max (2 lines)
Summary: 280 characters max (3 lines)
Tags: 3 visible (more hidden)
Source: 1 link
```

### Color Consistency:
```
Gradients: Always indigo→purple→blue
Buttons: Always gradient or white
Cards: Always white bg
Text: Always gray-900 (headings) / gray-600 (body)
Badges: Always type-specific colors
```

---

## 🚀 Logo Size Update

**Changed:**
- Mobile: 256px (was 192px)
- Tablet: 320px (was 256px)
- Desktop: **384px** (was 256px) ✅

**Now MUCH bigger and more prominent!**

---

## 📊 Quality Checklist

Before adding post to mockFeed.ts:

- [ ] Photo taken by you (legal)
- [ ] Photo is 800px+ wide (quality)
- [ ] Photo shows the location/building (relevant)
- [ ] Summary is AI-rewritten (not copied)
- [ ] Summary is 2-3 sentences (consistent)
- [ ] Summary mentions neighborhood (local)
- [ ] Source linked (attribution)
- [ ] Tags are relevant (findability)
- [ ] Date is accurate (trust)
- [ ] Title is clear (SEO)

---

## 💎 Example Perfect Post

```typescript
{
  id: '21',
  kind: 'opening',
  title: 'Revive MedSpa opens fourth Oklahoma City location',
  location: 'Classen Curve, OKC',
  address: 'Grand Blvd, Oklahoma City, OK',
  date: '2024-11-05',
  summary: 'Just heard Revive MedSpa is expanding again with a new 6,000 sqft facility in Classen Curve. They're bringing IV therapy, aesthetics, and wellness services to northwest OKC. Grand opening scheduled for early December with 15 new healthcare jobs.',
  source: 'Community Visit',
  imageUrl: '/images/revive-classen-curve.jpg', // YOUR photo
  tags: ['wellness', 'healthcare', 'classen-curve', 'opening'],
}
```

**Why this is perfect:**
- ✅ Original summary (AI-rewritten)
- ✅ Your photo (legal)
- ✅ Mentions specific neighborhood
- ✅ Casual but professional
- ✅ Key facts included
- ✅ Source attributed

---

## 🎯 Content Pillar Framework

### What Makes a Good Post:

**GREAT:**
- Major developments ($5M+)
- New business openings (local owners)
- Expansions (job creation)
- Data insights (market trends)

**SKIP:**
- Chain restaurants (unless first OKC)
- Minor renovations
- Unconfirmed rumors
- Politics/controversy

### AI Rewrite Quality Check:

**Good AI summary:**
> "Native Roots Market just opened in Plaza District, bringing 100% Oklahoma-sourced groceries and local goods to NW 16th Street. The 3,000 sqft space includes a community gathering area and cooking classes."

**Bad (too promotional):**
> "Amazing new grocery store revolutionizes shopping! Best prices in town! You won't believe..."

**Bad (too dry):**
> "A grocery store has opened at 1628 NW 16th St offering products."

**Good = Informative + conversational + local focus**

---

## 🔧 Future Automation (Phase 2)

### When you have 100+ members, automate with n8n:

```javascript
// n8n Workflow (Safe & Legal):

1. RSS Monitor Node
   ├─ Journal Record RSS
   ├─ Oklahoman RSS
   └─ City permits API

2. Extract Data
   ├─ Title
   ├─ URL
   ├─ Publish date
   └─ Category

3. OpenAI Node
   ├─ Prompt: "Rewrite as local insider..."
   └─ Returns: Original 2-3 sentence summary

4. Manual Step: YOU ADD PHOTO
   (n8n can't legally scrape images)

5. GitHub API Node
   ├─ Creates new post object
   ├─ Updates mockFeed.ts
   └─ Creates Pull Request

6. You Review PR (5 min)
   ├─ Check summary quality
   ├─ Add YOUR photo
   ├─ Approve

7. Merge → Vercel Deploys
```

**Time saved:** 15 min → 5 min/week

---

## 📐 Design System Enforcement

### How `FeedCard.tsx` Keeps Everything Consistent:

```typescript
// EVERY POST GETS:

1. Image Container (if imageUrl exists):
   <div className="w-full h-56"> // ← FIXED HEIGHT
     <img className="object-cover" /> // ← AUTO-CROP
   </div>

2. Title:
   <h3 className="line-clamp-2"> // ← MAX 2 LINES
   
3. Summary:
   <p className="line-clamp-3"> // ← MAX 3 LINES
   
4. Footer:
   [Location] [Date] [Source Link] // ← SAME LAYOUT
```

**Why this is powerful:**
- No matter what content you add
- No matter what image dimensions
- No matter how long the text
- **Cards always look identical!**

---

## 🎨 Visual Consistency Checklist

**Every post card has:**
- [ ] White background
- [ ] Rounded corners (rounded-2xl)
- [ ] Drop shadow (shadow-lg)
- [ ] 224px height image (if imageUrl)
- [ ] Kind badge (colored)
- [ ] 3 tags max
- [ ] 2-line title
- [ ] 3-line summary
- [ ] Location + date in footer
- [ ] Source attribution
- [ ] Hover effect (scale + shadow)

**Enforced by component, not manually!**

---

## 💡 Pro Tips

### Image Optimization:
```bash
# Before uploading, resize to web-friendly:
- Max width: 1200px
- Max height: 800px
- Quality: 80% JPG
- File size: <200KB each

# Use online tool: tinypng.com or squoosh.app
```

### AI Summary Tips:
```
Good prompts include:
- "as if you heard about it" (casual)
- "for local readers" (context)
- "2-3 sentences" (concise)
- "mention neighborhood" (local SEO)
- "no hype" (trustworthy)
```

### When to Update mockFeed.ts:
```
Ideal: Monday morning (start of week)
Frequency: 5-10 posts per update
Deploy: Immediately after updating
```

---

## 🎯 Logo Size - DECISION

**Current size after update:**
- Mobile: 256px
- Tablet: 320px  
- Desktop: **384px** ← VERY LARGE

**My recommendation:** ✅ **Keep current size**

**Why:**
- Prominent without overwhelming
- Balanced with text
- Professional, not amateur
- Matches Stripe/Linear aesthetic

**Could go bigger (512px), but:**
- Might look amateurish
- Reduces text hierarchy
- Too dominant on mobile

**Current size = Perfect for premium brand!**

---

## 📋 Quick Start Checklist

**Today:**
- [ ] Take 10 photos around OKC
- [ ] Read 5 recent articles
- [ ] Use ChatGPT to rewrite summaries
- [ ] Add 5 posts to mockFeed.ts with YOUR photos
- [ ] Deploy and test

**This Week:**
- [ ] Drive by 3 development sites
- [ ] Visit 2 new business openings
- [ ] Take exterior photos
- [ ] Create 10 posts total

**Next Week:**
- [ ] Regular Monday updates (5-10 posts)
- [ ] Build content library
- [ ] Start seeing traffic

---

## ✨ Summary

**Your Legal Workflow:**
1. YOUR photos (iPhone is fine)
2. AI rewrites (ChatGPT/Claude)
3. Link to source
4. Upload via mockFeed.ts

**Consistency Secret:**
- Component-based design
- Fixed dimensions
- Line clamping
- Design tokens

**Branding:**
- Logo size is perfect
- Blue-purple gradient matches logo
- Clean, premium aesthetic
- Local focus is clear

**Ready to deploy?** 🚀

Logo is now **HUGE**, colors match your brand, and you have a legal content workflow!

