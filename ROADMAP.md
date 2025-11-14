# Product Roadmap - Decision Circle App

This document outlines the planned enhancements and features for the Decision Circle App. The roadmap is organized into phases based on impact and implementation complexity.

---

## 🎯 Vision

Transform Decision Circle from a simple comparison tool into a comprehensive decision-making platform that helps users make better, more informed choices through visual analysis, data persistence, and intelligent features.

---

## 📅 Development Phases

### Phase 1: Quick Wins
**Focus:** High-impact features with low implementation complexity

### Phase 1.5: Multi-Project Support
**Focus:** Enable users to manage multiple independent decisions

### Phase 2: Core Features
**Focus:** Features that significantly enhance decision-making capabilities

### Phase 3: Polish & UX
**Focus:** Refinements that improve user experience and productivity

---

## 🚀 Phase 1: Quick Wins

**Status:** 🔵 Planned

### 1.1 Local Storage Persistence ⭐⭐⭐⭐⭐
**Priority:** Critical
**Complexity:** Low
**Impact:** High

**Problem:** Users lose all data when they refresh the page or close the browser.

**Solution:**
- Auto-save decisions to browser localStorage as users type
- Restore saved data on page load
- Add "Clear All Data" button in settings
- Show last saved timestamp
- Handle localStorage quota limits gracefully

**Technical Details:**
```typescript
Implementation:
- Create useLocalStorage hook
- Auto-save with debouncing (300ms)
- Schema versioning for future updates
- Fallback for Safari private browsing
- localStorage key: 'decision-circle-data-v1'
```

**Success Metrics:**
- [ ] Data persists across page refreshes
- [ ] Auto-save happens within 300ms of changes
- [ ] Users can manually clear data
- [ ] Works in all supported browsers

---

### 1.2 Import JSON Functionality ⭐⭐⭐⭐⭐
**Priority:** High
**Complexity:** Low
**Impact:** High

**Problem:** Users can export decisions but cannot re-import them later.

**Solution:**
- Add "Import" button in export menu
- File picker for JSON files
- Validate imported data structure
- Preview imported data before applying
- Choose to merge with existing or replace

**Technical Details:**
```typescript
Implementation:
- Add file input handler
- JSON schema validation
- Preview modal with diff view
- Error handling for invalid files
- Security: validate file size (<1MB)
```

**User Flow:**
1. Click "Import" button
2. Select JSON file from computer
3. Preview shows: "You are importing 2 opportunities with 8 considerations"
4. Choose: "Replace Current" or "Cancel"
5. Data loads into app

**Success Metrics:**
- [ ] Can import previously exported JSON
- [ ] Invalid files show clear error messages
- [ ] Preview shows what will be imported
- [ ] No data loss during import

---

### 1.3 Dark Mode 🌙 ⭐⭐⭐
**Priority:** Medium
**Complexity:** Low
**Impact:** Medium

**Problem:** No dark theme option for users who prefer dark interfaces.

**Solution:**
- Toggle button in header
- Respect system color scheme preference
- Smooth transition animations
- Persist preference in localStorage
- Update all components for dark theme

**Technical Details:**
```typescript
Implementation:
- Use Tailwind's dark mode (class strategy)
- Add theme toggle component
- Update color palette for dark theme
- Test contrast ratios (WCAG AA)
- Store preference: localStorage.theme
```

**Color Scheme:**
```
Dark Mode Colors:
- Background: #1a1a1a
- Cards: #2d2d2d
- Text: #e5e5e5
- Borders: #404040
- Accents: Keep existing blue/green/orange
```

**Success Metrics:**
- [ ] Toggle switches between light/dark smoothly
- [ ] System preference is respected on first load
- [ ] All text remains readable (contrast ratio ≥4.5:1)
- [ ] Preference persists across sessions

---

### 1.4 Keyboard Shortcuts ⌨️ ⭐⭐⭐
**Priority:** Medium
**Complexity:** Low
**Impact:** Medium

**Problem:** Power users need faster ways to navigate and perform actions.

**Solution:**
- Implement common keyboard shortcuts
- Show shortcut hints on hover
- "?" key shows all shortcuts modal
- Works across all major operating systems

**Keyboard Shortcuts:**
```
Global:
- ? : Show shortcuts help
- n : Add new opportunity (when < 3)
- e : Open export menu
- p : Open preview
- Esc : Close modals
- Cmd/Ctrl + s : Export JSON (override browser save)

Navigation:
- Tab : Move between inputs
- Shift + Tab : Move backwards
- Arrow keys : Adjust slider values

Editing:
- c : Add consideration to current wheel
- Cmd/Ctrl + Backspace : Delete selected item
```

**Technical Details:**
```typescript
Implementation:
- Custom useKeyboardShortcuts hook
- Event listeners with cleanup
- Prevent conflicts with browser shortcuts
- Disable when typing in inputs
- Accessibility: announce shortcuts to screen readers
```

**Success Metrics:**
- [ ] All shortcuts work as expected
- [ ] No conflicts with browser shortcuts
- [ ] Shortcuts disabled when typing in text fields
- [ ] Help modal lists all shortcuts

---

## 📂 Phase 1.5: Multi-Project Support

**Status:** 🔵 Planned

### 1.5.1 Multiple Decision Projects 📁 ⭐⭐⭐⭐⭐
**Priority:** High
**Complexity:** Medium
**Impact:** High

**Problem:** Users often need to compare different types of decisions simultaneously (job offers, apartments, investments) but can only work on one at a time.

**Solution:**
- Create and manage multiple independent decision projects
- Switch between projects with dropdown menu
- Each project auto-saves independently
- Archive completed decisions
- Duplicate projects for "what-if" scenarios
- Project metadata tracking

**Use Cases:**
```
User scenarios addressed:
1. "I'm comparing job offers AND apartments"
   → Separate projects for each decision type

2. "I want to revisit this decision next week"
   → Projects persist with last modified date

3. "I want to try a what-if scenario"
   → Duplicate project and experiment

4. "I'm done with this decision"
   → Archive completed projects
```

**UI Design:**
```
Header:
┌─────────────────────────────────────────────┐
│ Decision Circle   [Projects ▾]  [Export]    │
├─────────────────────────────────────────────┤
│ Current: Job Offers 2025          [Edit]    │
│ Last saved: 2 minutes ago                    │
└─────────────────────────────────────────────┘

Projects Dropdown:
┌───────────────────────────────────┐
│ Your Projects                     │
├───────────────────────────────────┤
│ ✓ Job Offers 2025                │ ← Active
│   3 opportunities • 2 hours ago   │
├───────────────────────────────────┤
│   Apartments Downtown             │
│   2 opportunities • 1 day ago     │
├───────────────────────────────────┤
│   University Comparison           │
│   3 opportunities • 1 week ago    │
├───────────────────────────────────┤
│ [+ New Project]                   │
│ [📁 Archived (2)]                 │
└───────────────────────────────────┘
```

**Data Structure:**
```typescript
interface Project {
  id: string;                    // UUID
  name: string;                  // "Job Offers 2025"
  description?: string;          // Optional notes
  createdAt: string;             // ISO timestamp
  lastModified: string;          // ISO timestamp
  wheels: Wheel[];               // The actual decision data
  nextWheelId: number;
  useNumberSelector: boolean;
  tags?: string[];               // "job", "housing", etc.
  isArchived: boolean;           // Hide completed decisions
}

interface AppState {
  version: number;               // Schema version
  activeProjectId: string;       // Which project is open
  projects: Project[];           // All saved projects
  lastSaved: string;
}
```

**Features:**

1. **Project Management**
   - Create new project with name
   - Rename existing project
   - Delete project (with confirmation)
   - Duplicate project
   - Archive/unarchive projects

2. **Project Switching**
   - Dropdown menu in header
   - Shows project name, # of opportunities, last modified
   - Active project highlighted
   - Instant switching (<100ms)
   - Auto-saves before switching

3. **Project Metadata**
   - Creation date
   - Last modified timestamp
   - Number of opportunities
   - Optional tags/categories
   - Storage size indicator

4. **Storage Management**
   - All projects in single localStorage key
   - Migration from single-project (Phase 1) to multi-project
   - Per-project storage calculation
   - Warning if approaching quota

5. **Export/Import Integration**
   - Export current project only
   - Export all projects (ZIP)
   - Import as new project
   - Import and merge

**Technical Implementation:**
```typescript
Storage:
- Key: 'decision-circle-v2' (upgrade from v1)
- Single key with all projects
- Atomic saves prevent corruption
- Migration path from Phase 1 schema

Components:
- ProjectSwitcher (dropdown menu)
- ProjectManager (create/edit/delete modal)
- ProjectMetadata (info display)

Utilities:
- Project CRUD operations
- Active project management
- Migration utilities
```

**Migration Strategy:**
```typescript
When upgrading from Phase 1 (single auto-save):
1. Detect v1 schema
2. Wrap existing data in default project:
   - name: "My Decision"
   - id: generated UUID
   - createdAt: now
   - wheels: existing wheels data
3. Update to v2 schema
4. Save migrated data
5. Show success message
```

**Success Metrics:**
- [ ] Can create and name multiple projects
- [ ] Can switch between projects without data loss
- [ ] Each project auto-saves independently
- [ ] Can archive completed projects
- [ ] Can duplicate projects
- [ ] Migration from Phase 1 works seamlessly
- [ ] Storage usage stays under 200KB for typical use (5 projects)
- [ ] Project switching is instant (<100ms)

**Storage Estimates:**
```
Single project: ~2-3KB
5 projects: ~10-15KB
10 projects: ~20-30KB
localStorage limit: ~5-10MB (browser dependent)
Conclusion: Very comfortable headroom
```

**Integration Points:**
- Synergizes with Templates (Phase 2.2) - start new project from template
- Synergizes with Import JSON (Phase 1.2) - import as new project
- Foundation for future cloud sync

---

## 🎨 Phase 2: Core Features

**Status:** 🔵 Planned

### 2.1 Weighted Considerations ⚖️ ⭐⭐⭐⭐
**Priority:** High
**Complexity:** Medium
**Impact:** High

**Problem:** All considerations are treated equally, but some factors are more important than others.

**Solution:**
- Add importance weight to each consideration (1-5 scale)
- Calculate both weighted and unweighted averages
- Toggle between weighted/unweighted view
- Visual indicators for importance level
- Update comparison bars to show both scores

**UI Design:**
```
Consideration Row:
[Location          ] [Importance: ⭐⭐⭐⭐⭐] [Rating: 8] [🗑️]
                     (1-5 stars)            (0-10)

Results Display:
Simple Average: 7.2 / 10
Weighted Average: 8.1 / 10 ⚖️
(weights applied)
```

**Calculation:**
```typescript
Weighted Score = Σ(rating × weight) / Σ(weight)

Example:
- Salary: 8/10 × 5 (Critical) = 40
- Snacks: 10/10 × 1 (Nice-to-have) = 10
Total: 50 / 6 = 8.33 weighted average
vs. 9.0 simple average
```

**Technical Details:**
```typescript
Implementation:
- Add weight field to Segment interface (default: 3)
- Create weight selector component (1-5 stars)
- Add calculateWeightedAverage() utility
- Toggle button: "Show Weighted Scores"
- Update exports to include weights
- Update visualizations (optional wheel scaling)
```

**Success Metrics:**
- [ ] Can assign weights to all considerations
- [ ] Weighted scores calculate correctly
- [ ] Can toggle between weighted/unweighted view
- [ ] Weights included in JSON exports
- [ ] Visual feedback shows weight importance

---

### 2.2 Templates Library 📋 ⭐⭐⭐⭐
**Priority:** High
**Complexity:** Medium
**Impact:** High

**Problem:** Users start with blank slate, unclear what considerations to include.

**Solution:**
- Pre-built templates for common decision types
- "Start from Template" button on initial load
- Template gallery with previews
- Ability to customize after loading
- Save custom templates for reuse

**Built-in Templates:**

1. **Job Offers**
   ```
   Considerations:
   - Salary & Compensation
   - Work-Life Balance
   - Growth Opportunities
   - Team & Culture
   - Location & Commute
   - Benefits & Perks
   - Company Stability
   - Work Interesting?
   ```

2. **Real Estate / Apartments**
   ```
   Considerations:
   - Price & Affordability
   - Location & Neighborhood
   - Size & Space
   - Condition & Maintenance
   - Commute Time
   - Amenities
   - Safety
   - Investment Potential
   ```

3. **Investment Options**
   ```
   Considerations:
   - Expected Return
   - Risk Level
   - Liquidity
   - Time Horizon
   - Tax Implications
   - Diversification Benefit
   - Management Effort
   - Personal Understanding
   ```

4. **University Choice**
   ```
   Considerations:
   - Program Quality
   - Reputation & Ranking
   - Cost & Financial Aid
   - Location & Campus Life
   - Career Services
   - Research Opportunities
   - Alumni Network
   - Campus Culture
   ```

5. **Product Comparison**
   ```
   Considerations:
   - Price
   - Features & Functionality
   - Quality & Durability
   - Brand Reputation
   - Customer Support
   - Warranty
   - Reviews & Ratings
   - Availability
   ```

**UI Flow:**
```
1. New user sees: "Start from scratch" or "Use template"
2. Template gallery shows cards with icons
3. Preview shows considerations included
4. Click "Use Template" → loads with default weights
5. User customizes as needed
```

**Technical Details:**
```typescript
Implementation:
- Create templates.ts with template definitions
- Template selector modal component
- Template preview component
- Custom template storage in localStorage
- Export/import custom templates
```

**Success Metrics:**
- [ ] 5 built-in templates available
- [ ] Can load template with one click
- [ ] Template includes sensible default weights
- [ ] Can save custom templates
- [ ] Templates work on mobile

---

### 2.3 Notes & Justifications 📝 ⭐⭐⭐
**Priority:** Medium
**Complexity:** Low
**Impact:** Medium

**Problem:** Numbers don't tell the full story behind ratings.

**Solution:**
- Add notes field to each consideration
- Add notes field to each opportunity
- Expandable text area or tooltip
- Include notes in exports
- Character limit (500 chars)

**UI Design:**
```
Consideration Row:
[Location] [Rating: 8] [💬 Add Note] [🗑️]

When clicked:
┌─────────────────────────────────────┐
│ Note for "Location"                 │
├─────────────────────────────────────┤
│ Great neighborhood but 45min        │
│ commute. Remote work 2x/week helps. │
│                                     │
│ [250/500 characters]                │
└─────────────────────────────────────┘
```

**Technical Details:**
```typescript
Implementation:
- Add note field to Segment and Wheel interfaces
- Note icon shows filled when note exists
- Expandable/collapsible note section
- Sanitize notes input (XSS protection)
- Include notes in JSON export
- Optional: Show notes in SVG export
```

**Success Metrics:**
- [ ] Can add notes to considerations and opportunities
- [ ] Notes persist with data
- [ ] Notes included in exports
- [ ] Notes are sanitized for security
- [ ] Visual indicator when notes exist

---

### 2.4 Comparison Matrix View 📊 ⭐⭐⭐
**Priority:** Medium
**Complexity:** Medium
**Impact:** Medium

**Problem:** Some users prefer tabular comparison over circular visualizations.

**Solution:**
- Toggle between "Wheel View" and "Matrix View"
- Spreadsheet-like table layout
- All opportunities side-by-side
- Sortable columns
- Highlight best/worst scores
- Export matrix view as CSV

**Matrix Layout:**
```
┌──────────────┬────────┬────────┬────────┬────────┐
│Consideration │ Opp A  │ Opp B  │ Opp C  │ Winner │
├──────────────┼────────┼────────┼────────┼────────┤
│ Salary       │   8    │  ⭐9   │   7    │   B    │
│ Location     │  ⭐10  │   5    │   8    │   A    │
│ Growth       │  ⭐9   │   6    │  ⭐9   │  A & C │
│ Culture      │   7    │  ⭐8   │   6    │   B    │
├──────────────┼────────┼────────┼────────┼────────┤
│ Average      │  8.5   │  7.0   │  7.5   │   A    │
└──────────────┴────────┴────────┴────────┴────────┘
```

**Features:**
- Click column header to sort by that consideration
- Hover to see notes (if any)
- Edit inline (double-click cells)
- Color-code scores (red=low, green=high)
- Export to CSV button

**Technical Details:**
```typescript
Implementation:
- Create MatrixView component
- Toggle button in header: [Wheel View | Matrix View]
- Use CSS Grid for table layout
- Editable cells with inline validation
- CSV export using papa parse or custom
- Responsive: horizontal scroll on mobile
```

**Success Metrics:**
- [ ] Can toggle between views smoothly
- [ ] Matrix shows all data accurately
- [ ] Can edit values in matrix view
- [ ] Changes sync between views
- [ ] Can export matrix as CSV

---

### 2.5 Undo/Redo System ↩️ ⭐⭐⭐
**Priority:** Medium
**Complexity:** Medium
**Impact:** Medium

**Problem:** Users can't undo accidental deletions or changes.

**Solution:**
- Undo/Redo buttons in header
- Keyboard shortcuts (Cmd/Ctrl + Z, Cmd/Ctrl + Shift + Z)
- History stack (last 20 actions)
- Visual feedback when undoing
- "Reset to Default" option

**Actions to Track:**
```
Trackable Actions:
- Add/remove opportunity
- Add/remove consideration
- Change rating value
- Change consideration name
- Change opportunity name
- Change color
- Change weight (Phase 2)
```

**UI Design:**
```
Header:
[↩️ Undo] [↪️ Redo]  (disabled when no history)

Keyboard:
Cmd/Ctrl + Z : Undo
Cmd/Ctrl + Shift + Z : Redo
```

**Technical Details:**
```typescript
Implementation:
- Create history management system
- Store state snapshots (max 20)
- Pointer to current state
- Undo moves pointer back
- Redo moves pointer forward
- New action clears future history
- Deep clone states to prevent mutations
```

**Success Metrics:**
- [ ] Can undo last 20 actions
- [ ] Can redo undone actions
- [ ] Keyboard shortcuts work
- [ ] Visual feedback on undo/redo
- [ ] History persists in session (not across reloads)

---

## 💎 Phase 3: Polish & UX

**Status:** 🔵 Planned

### 3.1 Drag & Drop Reordering 🔄 ⭐⭐⭐
**Priority:** Medium
**Complexity:** Medium
**Impact:** Medium

**Problem:** Users can't organize considerations in preferred order.

**Solution:**
- Drag handle on each consideration row
- Drag to reorder considerations within wheel
- Drag to reorder wheels
- Visual drop indicators
- Touch-friendly on mobile
- Keyboard alternative (↑↓ arrow keys)

**UI Design:**
```
[⋮⋮] Location          [Rating: 8] [🗑️]
 ↑ Drag handle

When dragging:
[⋮⋮] Location          [Rating: 8] [🗑️]  ← Ghost image
     ┌─────────────────────────────┐
     │ Drop here                    │  ← Drop indicator
     └─────────────────────────────┘
[⋮⋮] Salary            [Rating: 9] [🗑️]
```

**Technical Details:**
```typescript
Implementation:
- Use @dnd-kit/core library (React friendly)
- Or native HTML5 drag and drop
- Add drag handles (⋮⋮ icon)
- Visual feedback during drag
- Touch events for mobile
- Update state on drop
- Keyboard: Alt+↑/↓ to move selected item
```

**Success Metrics:**
- [ ] Can drag to reorder considerations
- [ ] Can drag to reorder wheels
- [ ] Works on touch devices
- [ ] Keyboard alternative available
- [ ] Smooth animations

---

### 3.2 Export Format Enhancements 📤 ⭐⭐⭐
**Priority:** Medium
**Complexity:** Low to Medium
**Impact:** Medium

**Problem:** Limited export format options.

**Solution:**
- Add PNG export (using canvas)
- Add PDF export
- Add Markdown export
- Add CSV export (from matrix view)
- Share link (copy to clipboard)

**New Export Options:**

1. **PNG Export**
   ```
   - Convert SVG to canvas to PNG
   - High resolution (2x)
   - Includes wheels and comparison
   ```

2. **PDF Export**
   ```
   - Multi-page document
   - Page 1: Visual (wheels + comparison)
   - Page 2: Matrix table
   - Page 3: Notes (if any)
   - Professional formatting
   ```

3. **Markdown Export**
   ```markdown
   # Decision: Job Offers

   ## Opportunity A - Tech Startup
   - Salary: 8/10
   - Location: 10/10
   - Growth: 9/10
   Average: 9.0/10

   ## Winner: Opportunity A (9.0/10)
   ```

4. **CSV Export**
   ```csv
   Consideration,Opportunity A,Opportunity B,Opportunity C
   Salary,8,9,7
   Location,10,5,8
   ```

**Technical Details:**
```typescript
Implementation:
- PNG: Use html2canvas library
- PDF: Use jsPDF library
- Markdown: Template strings
- CSV: Array to CSV conversion
- Add to existing export menu
```

**Success Metrics:**
- [ ] PNG export works in all browsers
- [ ] PDF includes all data
- [ ] Markdown is properly formatted
- [ ] CSV imports into Excel correctly
- [ ] All formats maintain data integrity

---

### 3.3 Enhanced Visualizations 📈 ⭐⭐⭐
**Priority:** Low
**Complexity:** Medium
**Impact:** Medium

**Problem:** Current visualizations could be more informative.

**Solution:**
- Animated transitions on value changes
- Confidence indicators
- Trend lines (if history is added)
- Sparklines for quick comparison
- Color-coded segments by score range

**Enhancements:**

1. **Animated Transitions**
   ```
   When rating changes:
   - Smooth animation of wheel fill
   - Fade transition for comparison bars
   - Number count-up animation
   ```

2. **Score Color Coding**
   ```
   Score Ranges:
   0-3: Red (Poor)
   4-6: Yellow (Moderate)
   7-8: Light Green (Good)
   9-10: Dark Green (Excellent)
   ```

3. **Confidence Score**
   ```
   Show how close the decision is:

   Opportunity A: 8.5
   Opportunity B: 8.4
   Gap: 0.1 ⚠️ Very close decision!

   vs.

   Opportunity A: 9.2
   Opportunity B: 6.1
   Gap: 3.1 ✅ Clear winner
   ```

**Technical Details:**
```typescript
Implementation:
- CSS transitions for animations
- React Spring for complex animations
- Calculate decision confidence metric
- Update CircleWheel component
- Add color gradients to segments
```

**Success Metrics:**
- [ ] Smooth animations on value changes
- [ ] Color coding makes scores easier to scan
- [ ] Confidence indicator helps interpretation
- [ ] Animations don't impact performance

---

### 3.4 Mobile Optimizations 📱 ⭐⭐⭐
**Priority:** Medium
**Complexity:** Low
**Impact:** Medium

**Problem:** Mobile experience could be improved.

**Solution:**
- Swipeable cards for wheels
- Bottom sheet for modals
- Larger touch targets
- Optimize for one-handed use
- Pull-to-refresh (if history added)
- Haptic feedback

**Mobile-Specific Features:**

1. **Swipeable Wheel Cards**
   ```
   Swipe left/right to navigate between wheels
   Like Instagram stories
   ```

2. **Bottom Sheet Modals**
   ```
   Export menu slides up from bottom
   More native mobile feel
   ```

3. **Touch Optimizations**
   ```
   - Minimum 44x44pt touch targets
   - Swipe to delete (with undo)
   - Long-press for options menu
   - Double-tap to edit
   ```

**Technical Details:**
```typescript
Implementation:
- Use Swiper.js for wheel carousel
- Custom bottom sheet component
- Touch event handlers
- Haptic API (navigator.vibrate)
- Responsive breakpoints optimization
```

**Success Metrics:**
- [ ] Easy to use with one hand
- [ ] No accidental touches
- [ ] Swipe gestures work smoothly
- [ ] Modals are thumb-friendly

---

### 3.5 Settings & Preferences ⚙️ ⭐⭐
**Priority:** Low
**Complexity:** Low
**Impact:** Low

**Problem:** No centralized place for app settings.

**Solution:**
- Settings modal/page
- Preferences management
- Data management
- About section

**Settings Categories:**

1. **Appearance**
   ```
   - Theme: Light / Dark / System
   - Wheel size: Small / Medium / Large
   - Font size: Normal / Large
   - Color scheme: Default / Colorblind-friendly
   ```

2. **Behavior**
   ```
   - Auto-save: On / Off
   - Auto-save delay: 300ms / 1s / 5s
   - Show tooltips: On / Off
   - Confirm deletions: On / Off
   ```

3. **Data**
   ```
   - Export all data
   - Import data
   - Clear all data (with confirmation)
   - Storage used: 2.4 KB / 5 MB
   ```

4. **About**
   ```
   - Version: 1.2.0
   - GitHub link
   - Changelog
   - Keyboard shortcuts
   ```

**Technical Details:**
```typescript
Implementation:
- Settings modal component
- Store preferences in localStorage
- Settings context for global access
- Form validation for custom values
```

**Success Metrics:**
- [ ] All settings work as expected
- [ ] Settings persist across sessions
- [ ] Clear data works with confirmation
- [ ] Settings accessible via keyboard (,)

---

## 📊 Success Metrics

### Overall Goals

**Phase 1:**
- [ ] 90% reduction in data loss complaints
- [ ] 50% faster workflow with keyboard shortcuts
- [ ] Dark mode adoption rate: >30%

**Phase 2:**
- [ ] 80% of users use weighted scores
- [ ] 60% of new users start with templates
- [ ] 40% of users add notes to decisions

**Phase 3:**
- [ ] 70% reduction in accidental deletions (undo)
- [ ] 50% increase in mobile usage
- [ ] 90% positive feedback on new exports

---

## 🚧 Not Planned (Future Consideration)

These features are valuable but require significant infrastructure:

### Requires Backend/Cloud:
- Real-time collaboration
- User accounts & authentication
- Cloud sync across devices
- Public template sharing
- Analytics dashboard

### Requires AI Integration:
- AI-powered consideration suggestions
- Sentiment analysis of notes
- Decision pattern recognition
- Recommendation engine

### Other:
- Browser extension
- Native mobile apps (iOS/Android)
- API for integrations
- Slack/Discord bots

---

## 🤝 Contributing

Want to help implement a feature? Check out our [Contributing Guidelines](./CONTRIBUTING.md) (coming soon).

**Priority Features for Contributors:**
- 🟢 Good first issue: Dark mode
- 🟢 Good first issue: Keyboard shortcuts
- 🟡 Intermediate: Import JSON
- 🟡 Intermediate: Templates library
- 🔴 Advanced: Weighted considerations

---

## 📝 Changelog

### Planned
- Phase 1: Quick Wins (4 features)
- Phase 1.5: Multi-Project Support (1 major feature)
- Phase 2: Core Features (5 features)
- Phase 3: Polish & UX (5 features)

### Completed
- ✅ v1.0.0 - Initial release with TypeScript refactor and security hardening

---

## 💬 Feedback

Have ideas for the roadmap? Open an issue on GitHub with:
- Feature description
- Use case / problem it solves
- Suggested priority

---

**Last Updated:** 2025-01-14
**Version:** 1.0
**Status:** All phases planned, implementation pending
