# 👤 "Add Me" Feature for Split Expenses

## Feature Added: Quick Add Yourself

### What It Does

- Adds a prominent "Add Me" button to quickly add yourself as a participant
- Automatically sets you as the payer (since you're usually the one creating the split)
- Allows you to customize your display name
- Smart logic: replaces empty first participant or adds as new participant

---

## 🎯 How to Use

### 1. Set Your Name (One-time Setup)

- Click the ✏️ button next to "Add Me"
- Enter your preferred name (default: "Me")
- Name is saved in localStorage for future use

### 2. Add Yourself to Split

- Click **"Add Me (Your Name)"** button
- You'll be automatically:
  - Added as a participant
  - Set as the payer (marked with green 💳 badge)
  - Ready to add share amounts

### 3. Smart Behavior

**Scenario A: Empty Form**

- If only one empty participant exists
- Clicking "Add Me" replaces it with your name
- No duplicate empty participants!

**Scenario B: Has Participants**

- If participants already exist
- Clicking "Add Me" adds you as a new participant
- Sets you as payer

---

## 🎨 UI Changes

### New Button Layout

```
┌─────────────────────────────────────────────────────┐
│  [Add Me (YourName)]  [Add Other]  [✏️]            │
└─────────────────────────────────────────────────────┘
```

**Add Me Button:**

- Gradient background (primary → secondary colors)
- Shows your name: "Add Me (Alex)"
- Prominent position (encourages usage)
- Automatically sets you as payer

**Add Other Button:**

- Standard style (gray)
- For adding other participants
- Same as old "Add Participant"

**Edit Button (✏️):**

- Small button on the right
- Opens prompt to change your name
- Instant update across all UI

---

## 💡 User Flow Example

### Example 1: Starting Fresh

```
1. Enable "Split this expense"
2. See empty participant field
3. Click "Add Me (Alex)" → replaces empty field
4. Click "Add Other" → adds Friend 1
5. Click "Add Other" → adds Friend 2
6. Enter amounts for each
```

### Example 2: With Existing Participants

```
1. Already have Friend 1, Friend 2 added
2. Click "Add Me (Alex)" → adds you as 3rd participant
3. You're automatically marked as payer
4. Enter your share amount
```

---

## 🔧 Technical Details

### localStorage Key

- **Key:** `expenzo_my_name`
- **Default Value:** "Me"
- **Persists:** Across sessions

### Functions Added

```javascript
addMyself()
  - Checks if first participant is empty
  - Replaces or adds new participant
  - Sets as payer
  - Shows success toast

updateMyName()
  - Prompts for new name
  - Updates state
  - Saves to localStorage
  - Shows confirmation toast
```

### State Management

```javascript
const [myName, setMyName] = useState(() => {
  return localStorage.getItem("expenzo_my_name") || "Me";
});
```

---

## ✨ Benefits

1. **Faster Split Creation**

   - One click vs typing your name every time
   - Auto-sets as payer (common scenario)

2. **Consistent Identity**

   - Your name saved and reused
   - Easy to identify in split history

3. **Smart Logic**

   - Doesn't create duplicate empty fields
   - Context-aware behavior

4. **Customizable**
   - Change name anytime
   - Supports any name/nickname

---

## 🎯 Common Use Cases

### Restaurant Bill

```
✓ Click "Add Me (Alex)"        → You paid
✓ Click "Add Other" → Sam       → Owes you
✓ Click "Add Other" → Jordan    → Owes you
✓ Distribute Equally
✓ Submit
```

### Shared Uber

```
✓ Click "Add Me (Priya)"
✓ Click "Add Other" → Ravi
✓ Enter amounts: 150 each
✓ See: "Ravi owes ₹150 to Priya"
```

### Apartment Rent

```
✓ Click "Add Me"
✓ Add 2 roommates
✓ Distribute Equally (₹10,000 each)
✓ Settlement calculator shows who owes
```

---

## 🧪 Testing Checklist

- [ ] Click "Add Me" on empty form
- [ ] Click "Add Me" with existing participants
- [ ] Click ✏️ button to change name
- [ ] Verify name persists after refresh
- [ ] Confirm you're marked as payer
- [ ] Check settlement calculator shows correct amounts
- [ ] Test with percentage splits
- [ ] Test with amount splits
- [ ] Save as template with "Me" included
- [ ] Load template - verify your name appears

---

## 💭 Pro Tips

1. **Set Your Name Once:** Click ✏️ on first use to set your preferred name
2. **Always First:** Click "Add Me" first, then add others
3. **Templates:** Save templates with yourself included for recurring groups
4. **Payer Logic:** You're auto-set as payer - perfect for "I paid, they owe me" scenarios

---

## 🚀 What's Next?

This feature is complete and ready to use! Possible future enhancements:

1. **Profile Integration:** Pull name from user profile/settings
2. **Multiple Profiles:** Support multiple names for different contexts
3. **Quick Switch:** Toggle between "Me as Payer" and "Me as Participant"
4. **Smart Defaults:** Remember your typical share amounts

---

**Go try it now!** Open your app, create an expense, enable split, and click "Add Me" 🎉
