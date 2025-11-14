# Testing Guide - Decision Circle App

This document provides comprehensive testing instructions for the Decision Circle App.

## 🧪 Manual Testing Checklist

### 1. Basic Functionality

**Start the dev server:**
```bash
npm run dev
```

**Test Checklist:**
- [ ] App loads without errors
- [ ] Two default opportunities are displayed
- [ ] Circular visualizations render correctly
- [ ] Can add a third opportunity
- [ ] Can remove an opportunity (when 3 exist)
- [ ] Cannot remove when only 2 opportunities exist
- [ ] Cannot add more than 3 opportunities

---

### 2. Input Validation & Security

Test each input field with these security scenarios:

#### XSS Attack Prevention
```html
Try entering: <script>alert('XSS')</script>
Expected: Text is sanitized, no script execution
```

#### Event Handler Injection
```html
Try entering: onclick="alert('test')"
Expected: Event handlers are stripped
```

#### JavaScript Protocol
```html
Try entering: javascript:alert('test')
Expected: JavaScript protocol is removed
```

#### Long Input Handling
```
Try entering: A very long string with more than 50 characters that should be truncated automatically
Expected: Input truncated to 50 characters
```

#### Special Characters
```
Try entering: <>&"'/\
Expected: Angle brackets removed, others allowed
```

**Test Checklist:**
- [ ] Script tags are removed from all text inputs
- [ ] Event handlers are stripped
- [ ] JavaScript protocols are blocked
- [ ] Input length limits enforced (50 chars)
- [ ] Special characters handled correctly

---

### 3. Data Validation

#### Numeric Values
- [ ] Slider values stay between 0-10
- [ ] Number buttons only allow 0-10
- [ ] Invalid numbers are clamped to valid range
- [ ] Entering negative numbers: should clamp to 0
- [ ] Entering numbers > 10: should clamp to 10
- [ ] Entering non-numeric values: should default to 5

#### Color Picker
- [ ] Color picker accepts valid hex colors (#RRGGBB)
- [ ] Invalid colors default to palette color
- [ ] All 5 palette colors work correctly

---

### 4. User Interface

#### Visual Consistency
- [ ] Text fields have white background with dark text
- [ ] Trash icons are positioned inside white bordered panels
- [ ] Selected segments highlight in blue
- [ ] Clicking wheel segments scrolls to corresponding inputs
- [ ] Hover effects work on all interactive elements
- [ ] Disabled buttons appear grayed out

#### Responsive Design

**Desktop (1920x1080):**
- [ ] Three-column grid layout
- [ ] All wheels visible side-by-side
- [ ] No horizontal scrolling needed

**Tablet (768x1024):**
- [ ] Two-column grid layout
- [ ] Wheels stack appropriately
- [ ] Touch targets are adequate

**Mobile (375x667):**
- [ ] Single-column layout
- [ ] All controls remain accessible
- [ ] Sliders work with touch
- [ ] Number buttons are tappable
- [ ] Text inputs have proper keyboard

#### Interactive Features
- [ ] Wheel segments are clickable
- [ ] Clicking segment scrolls to input with smooth animation
- [ ] Selected segment shows pulsing ring indicator
- [ ] Color picker updates wheel immediately
- [ ] Slider updates wheel in real-time

---

### 5. Export Functionality

#### JSON Export

**Test Steps:**
1. Click "Export" button
2. Select "JSON Data"
3. Check downloaded file

**Verify:**
- [ ] File downloads as `decision-wheels-[timestamp].json`
- [ ] Valid JSON structure (no syntax errors)
- [ ] All wheel data present (id, name, color, segments)
- [ ] All segment data present (id, name, value)
- [ ] Filename is sanitized (no special characters)
- [ ] Can open file in text editor

**Sample Structure:**
```json
[
  {
    "id": 1,
    "name": "Opportunity A",
    "color": "#60A5FA",
    "segments": [
      { "id": 1, "name": "Location", "value": 10 }
    ]
  }
]
```

#### SVG Export

**Test Steps:**
1. Click "Export" button
2. Select "SVG Vector"
3. Check downloaded file

**Verify:**
- [ ] File downloads as `decision-wheels-[timestamp].svg`
- [ ] Opens correctly in browser
- [ ] Opens correctly in image viewer
- [ ] All wheels render correctly
- [ ] Comparison bars included at bottom
- [ ] Colors match the app
- [ ] Text is readable and not cut off
- [ ] Overall Comparison section present
- [ ] Average scores displayed correctly

#### Preview Functionality
- [ ] Preview modal opens when clicking "Preview"
- [ ] Shows all wheels in preview
- [ ] Shows comparison bars
- [ ] Preview matches what will be exported
- [ ] Can close preview with X button
- [ ] Can close preview by clicking outside modal

---

### 6. State Management

#### Data Consistency
- [ ] Adding consideration updates wheel immediately
- [ ] Removing consideration updates wheel immediately
- [ ] Changing values updates wheel in real-time
- [ ] Renaming consideration updates wheel immediately
- [ ] Color changes reflect immediately

#### Copy Functionality

**Test Steps:**
1. Add/edit considerations on first wheel
2. Click "Copy from [first wheel]" on second wheel
3. Verify results

**Verify:**
- [ ] All consideration names are copied
- [ ] Number of considerations matches
- [ ] Values reset to default (5)
- [ ] Wheel visualization updates correctly
- [ ] Button only appears on wheels 2 and 3

#### Session Persistence
- [ ] Add a new opportunity
- [ ] Edit some values
- [ ] Refresh the page
- [ ] **Note:** Data does NOT persist (this is expected behavior)

---

### 7. Error Handling

#### Test Error Boundary

**Test Steps:**
1. Open browser console (F12)
2. Run: `throw new Error('Test error')`
3. Observe error boundary UI

**Verify:**
- [ ] Error boundary catches the error
- [ ] Shows friendly error message
- [ ] Shows "Try Again" button
- [ ] Shows "Reload Page" button
- [ ] In development: shows error details
- [ ] Clicking "Try Again" attempts to recover
- [ ] Clicking "Reload Page" refreshes the app

#### Network Issues
- [ ] Disconnect internet
- [ ] Try to use app
- [ ] Should work completely offline (no external dependencies)
- [ ] Export functions still work

#### Edge Cases
- [ ] Try to delete last consideration (should be disabled)
- [ ] Try to delete when only 2 wheels exist (should be disabled)
- [ ] Try to add consideration when at max (20) - should show alert
- [ ] Enter extremely long wheel name - should truncate

---

### 8. Accessibility Testing

#### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] Focus indicators are visible and clear
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work on range sliders
- [ ] Escape key closes modals
- [ ] No keyboard traps

#### ARIA and Semantic HTML
- [ ] All inputs have associated labels
- [ ] All buttons have descriptive text or aria-labels
- [ ] ARIA labels present on icon buttons
- [ ] Modals have role="dialog" and aria-modal="true"
- [ ] Live regions for dynamic content (aria-live)
- [ ] Proper heading hierarchy (h1, h2, h3)

#### Screen Reader Testing (Optional)

**Using NVDA/JAWS/VoiceOver:**
- [ ] All interactive elements are announced
- [ ] Current values are read correctly
- [ ] Button purposes are clear
- [ ] Form inputs are labeled properly
- [ ] Error messages are announced

---

### 9. Performance Testing

#### Load Time

**Test Steps:**
1. Open DevTools → Network tab
2. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. Check metrics

**Verify:**
- [ ] Initial load < 2 seconds
- [ ] JavaScript bundle < 200KB (gzipped ~54KB)
- [ ] CSS bundle < 20KB (gzipped ~4KB)
- [ ] No console errors
- [ ] No 404 errors in network tab

#### Runtime Performance

**Test Steps:**
1. Add maximum considerations (20) to each wheel
2. Rapidly drag sliders
3. Click segments rapidly
4. Switch between slider/number mode

**Verify:**
- [ ] No visible lag when dragging sliders
- [ ] Wheel updates smoothly
- [ ] No freezing or stuttering
- [ ] Comparison bars update instantly
- [ ] Frame rate stays smooth (check DevTools Performance)

#### Memory Usage (Advanced)

**Test Steps:**
1. Open DevTools → Memory/Performance tab
2. Take heap snapshot
3. Use app extensively for 5 minutes
4. Take another snapshot

**Verify:**
- [ ] No significant memory leaks
- [ ] Memory usage stays reasonable (< 50MB)
- [ ] DOM nodes don't accumulate

---

## 🤖 Automated Testing

### Build Test

**Test TypeScript compilation and production build:**
```bash
npm run build
```

**Expected Output:**
```
✓ vite build succeeds
✓ No TypeScript errors
✓ dist/ folder created with:
  - index.html
  - assets/index-[hash].js
  - assets/index-[hash].css
```

**Verify:**
- [ ] Build completes successfully
- [ ] No TypeScript compilation errors
- [ ] Output includes index.html
- [ ] Output includes minified JS and CSS
- [ ] File sizes are reasonable

---

### Linting Test

**Check code quality:**
```bash
npm run lint
```

**Expected:**
- [ ] No linting errors
- [ ] No warnings (or only acceptable warnings)
- [ ] All files pass ESLint checks

---

### Type Checking

**Check TypeScript types:**
```bash
npx tsc --noEmit
```

**Verify:**
- [ ] No type errors
- [ ] All imports resolve correctly
- [ ] No implicit any types

---

## 🌐 Browser Compatibility Testing

Test the application in multiple browsers and versions:

### Desktop Browsers

- [ ] **Chrome** (latest)
  - All features work
  - No console errors
  - Export functions work

- [ ] **Firefox** (latest)
  - All features work
  - No console errors
  - SVG export renders correctly

- [ ] **Safari** (latest)
  - All features work
  - Color picker works
  - WebP export may not work (expected)

- [ ] **Edge** (latest)
  - All features work
  - No console errors

### Mobile Browsers

- [ ] **Mobile Safari** (iOS 14+)
  - Touch interactions work
  - Sliders respond to touch
  - Modals display correctly
  - Responsive layout works

- [ ] **Chrome Mobile** (Android)
  - Touch interactions work
  - All features accessible
  - Performance is acceptable

---

## 🔒 Security Testing

### Input Sanitization Testing

**Console Test:**
```javascript
// Open browser console and run:
const input = document.querySelector('input[type="text"]');
input.value = '<script>alert("XSS")</script>';
input.dispatchEvent(new Event('input', { bubbles: true }));
// Check the actual stored value - should be sanitized
```

**Verify:**
- [ ] Script tags removed
- [ ] Event handlers removed
- [ ] No code execution occurs

### File Download Safety

**Test Scenarios:**
```javascript
// Try various malicious filenames
// The app should sanitize them
test cases:
- "../../../etc/passwd"
- "test<script>.json"
- "file|name.svg"
```

**Verify:**
- [ ] Filename is sanitized
- [ ] No directory traversal possible
- [ ] Special characters removed or escaped
- [ ] File extension is correct

### XSS Protection Verification

**Test in All Text Inputs:**
1. Opportunity names
2. Consideration names

**Try These Payloads:**
```html
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
javascript:alert('XSS')
<iframe src="javascript:alert('XSS')">
onclick="alert('XSS')"
```

**Verify:**
- [ ] No alerts appear
- [ ] Tags are stripped
- [ ] Text is displayed safely
- [ ] No JavaScript execution

---

## 📊 Test Results Template

Use this template to document your testing results:

```markdown
## Test Run: [Date]

**Tested By:** [Your Name]
**Environment:** [OS, Browser, Version]

### Results Summary
- Total Tests: X
- Passed: Y
- Failed: Z
- Skipped: W

### Failed Tests
1. [Test Name] - [Description of failure]
   - Expected: [Expected behavior]
   - Actual: [What actually happened]
   - Steps to reproduce: [Steps]

### Notes
- [Any additional observations]
- [Performance concerns]
- [Suggestions for improvement]
```

---

## 🐛 Known Issues

Document any known issues or limitations:

- [ ] WebP export may not work in Safari (browser limitation)
- [ ] Data doesn't persist on refresh (by design)
- [ ] Maximum 20 considerations per wheel (by design)

---

## 🔄 Regression Testing

When making changes, always test:

1. **Core Functionality:**
   - [ ] Can create/edit/delete wheels
   - [ ] Can create/edit/delete considerations
   - [ ] Values update correctly

2. **Security:**
   - [ ] Input sanitization still works
   - [ ] No new XSS vulnerabilities

3. **UI/UX:**
   - [ ] No visual regressions
   - [ ] Responsive design still works

4. **Exports:**
   - [ ] JSON export format unchanged
   - [ ] SVG export renders correctly

---

## 📝 Testing Checklist Summary

Quick reference for essential tests:

### Must Test Before Release
- [ ] Security: XSS protection
- [ ] Functionality: Core features work
- [ ] UI: Visual consistency
- [ ] Exports: JSON and SVG work
- [ ] Build: Production build succeeds
- [ ] Performance: No obvious lag

### Should Test
- [ ] Accessibility: Keyboard navigation
- [ ] Compatibility: Multiple browsers
- [ ] Edge cases: Boundary conditions
- [ ] Error handling: Error boundary

### Nice to Test
- [ ] Screen readers
- [ ] Memory usage
- [ ] Different screen sizes
- [ ] Network throttling

---

**Last Updated:** [Current Date]

For questions or to report issues, please open an issue on GitHub.
