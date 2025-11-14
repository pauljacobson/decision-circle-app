# Decision Circle App

A visual decision-making tool that helps you compare multiple opportunities using interactive circular visualizations. Built with React, TypeScript, and modern web security best practices.

![Decision Circle App](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple) ![Security](https://img.shields.io/badge/Security-XSS%20Protected-green)

## 🎯 What is Decision Circle?

Decision Circle is an interactive web application designed to help you make better decisions when comparing multiple opportunities. Whether you're choosing between job offers, apartments, investment opportunities, or any other major decision, this tool helps you:

- **Visualize** your decision criteria with interactive circular charts
- **Compare** up to 3 opportunities side-by-side
- **Quantify** your considerations with ratings from 0-10
- **Analyze** with automatic scoring and comparison analytics
- **Export** your decisions as JSON or SVG for sharing and documentation

### Key Features

✨ **Interactive Wheel Visualizations** - SVG-based circular charts that dynamically update as you rate each consideration

📊 **Real-time Comparison** - Automatic calculation of averages and visual comparison bars

🔒 **Security Hardened** - XSS protection, input sanitization, and validated user inputs

♿ **Accessible** - WCAG 2.1 Level AA compliant with ARIA labels and keyboard navigation

📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

💾 **Export Capabilities** - Save your decisions as JSON (data backup) or SVG (visual export)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/pauljacobson/decision-circle-app.git
cd decision-circle-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173` (or the next available port).

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The production files will be in the `dist/` directory.

## 📖 How to Use

### Basic Workflow

1. **Start with Two Opportunities**
   - The app loads with two sample opportunities (A and B)
   - Each opportunity has several considerations (factors to evaluate)

2. **Add or Remove Opportunities**
   - Click "Add Opportunity" to add a third option (max 3)
   - Click the X button to remove an opportunity (min 2 required)

3. **Customize Your Considerations**
   - Click on any consideration name to edit it
   - Click "Add Consideration" to add new factors
   - Click the trash icon to remove a consideration

4. **Rate Your Considerations**
   - Use the slider to rate each consideration from 0-10
   - Or click "Use Numbers" to switch to button-based rating
   - Click on wheel segments to jump to the corresponding input

5. **Analyze the Results**
   - View the circular visualization for each opportunity
   - Check the "Overall Comparison" section for averages
   - The highest-rated opportunity is highlighted

6. **Export Your Decision**
   - Click "Preview" to see how the export will look
   - Click "Export" → "SVG Vector" for a visual export
   - Click "Export" → "JSON Data" to backup your data

### Example Use Case: Comparing Job Offers

```
Opportunity A: Tech Startup
├── Salary: 8/10
├── Work-Life Balance: 6/10
├── Growth Potential: 9/10
├── Location: 7/10
└── Team Culture: 8/10
Average: 7.6/10

Opportunity B: Enterprise Company
├── Salary: 9/10
├── Work-Life Balance: 8/10
├── Growth Potential: 6/10
├── Location: 5/10
└── Team Culture: 7/10
Average: 7.0/10

Result: Tech Startup scores 0.6 points higher
```

## 🧪 Testing Instructions

### Manual Testing Checklist

#### 1. **Basic Functionality**
```bash
# Start the dev server
npm run dev
```

- [ ] App loads without errors
- [ ] Two default opportunities are displayed
- [ ] Circular visualizations render correctly
- [ ] Can add a third opportunity
- [ ] Can remove an opportunity (when 3 exist)
- [ ] Cannot remove when only 2 opportunities exist

#### 2. **Input Validation & Security**

Test each input field with these scenarios:

**XSS Attack Prevention:**
```html
Try entering: <script>alert('XSS')</script>
Expected: Text is sanitized, no script execution
```

**Event Handler Injection:**
```html
Try entering: onclick="alert('test')"
Expected: Event handlers are stripped
```

**Long Input Handling:**
```
Try entering: A very long string with more than 50 characters to test length limits
Expected: Input truncated to 50 characters
```

**Special Characters:**
```
Try entering: <>&"'/\
Expected: Angle brackets removed, others allowed
```

#### 3. **Data Validation**

**Numeric Values:**
- [ ] Slider values stay between 0-10
- [ ] Number buttons only allow 0-10
- [ ] Invalid numbers are clamped to valid range

**Color Picker:**
- [ ] Color picker accepts valid hex colors
- [ ] Invalid colors default to palette color

#### 4. **User Interface**

**Visual Consistency:**
- [ ] Text fields have white background with dark text
- [ ] Trash icons are positioned inside white bordered panels
- [ ] Selected segments highlight in blue
- [ ] Clicking wheel segments scrolls to inputs

**Responsive Design:**
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] All controls remain accessible

#### 5. **Export Functionality**

**JSON Export:**
```bash
# Click Export → JSON Data
# Expected: Downloads decision-wheels-[timestamp].json
# Open file and verify:
```
- [ ] Valid JSON structure
- [ ] All wheel data present
- [ ] Filename is sanitized

**SVG Export:**
```bash
# Click Export → SVG Vector
# Expected: Downloads decision-wheels-[timestamp].svg
# Open file in browser and verify:
```
- [ ] All wheels render correctly
- [ ] Comparison bars included
- [ ] Colors match app
- [ ] Text is readable

#### 6. **State Management**

**Data Persistence During Session:**
- [ ] Add a new opportunity
- [ ] Edit some values
- [ ] Refresh the page
- [ ] Note: Data does NOT persist (by design)

**Copy Functionality:**
- [ ] Click "Copy from [first wheel]" on second/third wheel
- [ ] Consideration names are copied
- [ ] Values reset to default (5)

#### 7. **Error Handling**

**Test Error Boundary:**
```bash
# Open browser console
# Paste: throw new Error('Test error')
# Expected: Error boundary catches it, shows friendly message
```

**Network Issues:**
- [ ] Disconnect internet
- [ ] Try to use app
- [ ] Should work offline (no external dependencies)

#### 8. **Accessibility Testing**

**Keyboard Navigation:**
- [ ] Tab through all controls
- [ ] Focus indicators visible
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work on sliders

**Screen Reader Testing:**
- [ ] All inputs have labels
- [ ] ARIA labels present
- [ ] Roles defined correctly

#### 9. **Performance Testing**

**Load Time:**
```bash
# Open DevTools → Network tab
# Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
# Check:
```
- [ ] Initial load < 2 seconds
- [ ] Bundle size < 200KB gzipped
- [ ] No console errors

**Rendering Performance:**
- [ ] Add multiple considerations (20+)
- [ ] Drag sliders rapidly
- [ ] Check for lag or freezing
- [ ] Should remain responsive

### Automated Testing

#### Build Test
```bash
# Test TypeScript compilation and build
npm run build

# Expected output:
# ✓ vite build succeeds
# ✓ No TypeScript errors
# ✓ dist/ folder created
```

#### Linting Test
```bash
# Check code quality
npm run lint

# Expected: No linting errors
```

### Browser Compatibility Testing

Test in these browsers:

- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)
- [ ] **Mobile Safari** (iOS)
- [ ] **Chrome Mobile** (Android)

### Security Testing

**Input Sanitization:**
```javascript
// Test in browser console:
document.querySelector('input[type="text"]').value = '<script>alert("XSS")</script>';
// Trigger onChange event
// Expected: Script tags removed
```

**File Download Safety:**
```bash
# Try to export with malicious filename
# Expected: Filename is sanitized
# No directory traversal possible
```

## 🏗️ Architecture

Built with modern web technologies and best practices:

- **React 18** - Component-based UI framework
- **TypeScript 5.6** - Static typing for reliability
- **Vite 6** - Lightning-fast build tool
- **Tailwind CSS 3** - Utility-first styling
- **Lucide React** - Beautiful icon library

### Project Structure

```
src/
├── components/          # Reusable React components
│   ├── CircleWheel.tsx     # SVG wheel visualization
│   ├── ComparisonBars.tsx  # Analytics display
│   └── ErrorBoundary.tsx   # Error handling
├── utils/              # Utility functions
│   ├── validation.ts      # Input sanitization
│   ├── calculations.ts    # Business logic
│   └── exports.ts         # Export functions
├── types.ts            # TypeScript definitions
├── App.tsx             # Main application
└── main.tsx            # Entry point
```

### Security Features

- ✅ XSS Protection - All user inputs sanitized
- ✅ Input Validation - Length limits and type checking
- ✅ Safe Exports - Filename sanitization
- ✅ Error Boundaries - Graceful failure handling
- ✅ TypeScript Strict Mode - Type safety

## 🤝 Contributing

This is a personal learning project built with Claude Code. Contributions, issues, and feature requests are welcome!

## 📄 License

MIT License - feel free to use this project for your own learning or projects.

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.com/claude-code)
- Icons by [Lucide](https://lucide.dev)
- Inspired by decision-making frameworks and visual thinking tools

## 📞 Support

Having issues? Check the [CLAUDE.md](./CLAUDE.md) file for detailed documentation, or open an issue on GitHub.

---

**Made with ❤️ and Claude Code**
