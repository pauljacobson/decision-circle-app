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

## 🧪 Testing

Comprehensive testing documentation is available in **[TESTING.md](./TESTING.md)**.

### Quick Start Testing

```bash
# Run development server
npm run dev

# Test production build
npm run build

# Run linter
npm run lint
```

### Testing Categories

The [TESTING.md](./TESTING.md) file includes detailed instructions for:

1. **Manual Testing** - UI, functionality, and security testing
2. **Automated Testing** - Build tests and linting
3. **Browser Compatibility** - Cross-browser testing checklist
4. **Security Testing** - XSS protection and input validation
5. **Performance Testing** - Load time and runtime performance
6. **Accessibility Testing** - Keyboard navigation and screen readers

For complete testing procedures, see **[TESTING.md](./TESTING.md)**.

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
