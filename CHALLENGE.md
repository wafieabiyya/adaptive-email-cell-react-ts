# Frontend Developer Quiz – Email Recipients Cell

## 📋 Overview

This task tests a frontend developer’s ability in:

- **UI logic that depends on layout/width**
- **Handling array data inside a table cell**
- **Adaptive visuals without UI libraries**
- **Using React + TypeScript + pure CSS**

You are provided with the `EmailCellUnsolved` component which is incomplete. Your job is to complete it so that the cell renders email lists according to the rules below.

---

## 🎯 Challenge Rules

### 1. Adaptive rendering based on cell width

- The cell **must adapt** its rendering based on the available column width.
- Use `ResizeObserver` (or equivalent) to detect width changes.
- Calculate **how many emails can be shown fully** (not just by character count).

### 2. Single + Badge Mode

- If only **1 email fits**:

  - Show the **first email**.
  - If it’s too long, apply **ellipsis (truncate)**.
  - If there are more emails → show a **badge `+N`**.
    Hovering the badge must display a **tooltip** with the full email list.

### 3. Multi-Fit Mode

- If the width fits **≥2 full emails**, render as many as possible **without truncation**.
- If there are leftover emails → show a **badge `+N`**.
- **Do not truncate** emails in this mode, only use the badge.

### 4. Tooltip & Accessibility

- Tooltip appears when hovering over the badge.
- Badge should include `aria-label` or `title` for screen reader support.

### 5. Edge Cases

- If the email list is empty → render `–` (or consistent empty state).
- Must handle very long emails, many emails, and rapid column resizing correctly.

### 6. Performance

- Column width changes should feel smooth, without heavy re-renders.
- (Bonus) Extract fitting logic into a separate function for unit testing.

---

## 🛠️ Setup Project

```bash
# Install dependencies
pnpm install   # or npm install / yarn install
```

```bash
# Run dev server
pnpm dev       # default: http://localhost:5173
```

---

## 📂 Relevant Structure

```bash
src/
 └─ components/
     └─ quiz/
         ├─ EmailCellUnsolved.tsx   # starter component (unsolved)
         ├─ EmailCellQuiz.tsx       # interactive harness (with slider)
         └─ quiz.css                # base styling
```

---

## ✅ Evaluation Checklist

- [ ] The cell renders emails based on available width.
- [ ] **Single + Badge Mode** works (truncate first email if too long).
- [ ] **Multi-Fit Mode** works (≥2 emails shown fully, no truncation).
- [ ] Badge shows remaining email count.
- [ ] Tooltip shows complete email list on hover.
- [ ] Separator between emails is `", "`.
- [ ] Responsive to column resizing (via slider in quiz).
- [ ] Handles empty email list gracefully.
- [ ] Basic accessibility is present (`aria-label` / `title`).
- [ ] Code is clean, structured, and type-safe.

---

## 🔍 How to Test

1. Run `pnpm dev`.
2. Open the main page → you will see a table with multiple email scenarios.
3. Use the **slider** to adjust the width of the "Recipients" column.
4. Verify all challenge rules across different scenarios.

---

## 💡 Notes

- Do **not** use external UI libraries or ready-made tooltip/badge components.
- Use **React + pure CSS only**.
- Do not hardcode breakpoints. Solution must be **measurement-based** (text/element width).
- Bonus points for short explanatory comments in code or simple unit tests.
