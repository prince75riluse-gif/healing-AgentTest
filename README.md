# Healing Agent & Skill Registry Test Page

**Comprehensive test suite for AI-powered locator healing and exception recovery**

---

## Overview

This test page provides a dual-purpose testing environment for two core Automator features:

1. **Healing Agent** - Automatic locator recovery using AI when elements break or change
2. **Skill Registry** - AI-powered exception handling for UI interruptions (popups, overlays, dynamic content)

## Features

### Healing Agent Tests
- Static element locator healing
- Form input handling
- Dynamic content generation
- Modal and overlay interactions
- Conditional element visibility
- Navigation link testing

### Skill Registry Tests
- 🎯 Ad popup interruption handling
- 🍪 Cookie consent banner dismissal
- 📧 Newsletter popup blocking
- 👁️ Element visibility and scrolling
- ⏳ Loading spinner detection
- 🔄 Stale element recovery
- 🪟 Multiple overlapping popups

## Quick Start

### 1. Start the Test Page

```bash
# Navigate to test page directory
cd /Users/prince75.kumar/automator/healing-agent-test-page

# Start local server
python3 -m http.server 8080

# Open in browser
open http://localhost:8080
```

### 2. For Healing Agent Testing

1. Click "Healing Agent Tests" tab
2. Use elements with intentionally mismatched locators
3. Run your Selenium tests against this page
4. Observe AI-powered locator recovery

### 3. For Skill Registry Testing

1. Click "Skill Registry Tests" tab
2. Create skills via API (see [SKILL_REGISTRY_TESTING_GUIDE.md](SKILL_REGISTRY_TESTING_GUIDE.md))
3. Run tests that interact with test page elements
4. Trigger interruptions using "Trigger" buttons
5. Observe automatic skill execution and recovery

## Project Structure

```
healing-agent-test-page/
├── index.html                          # Main test page with both test suites
├── script.js                           # Interactive functionality and test controls
├── styles.css                          # Modern UI styling
├── SKILL_REGISTRY_TESTING_GUIDE.md    # Detailed testing guide
├── QUICK_START_SKILL_TESTING.md       # 5-minute quick start
└── README.md                           # This file
```

## Test Scenarios

### Healing Agent Tests (6 Scenarios)

| Scenario | Purpose | Difficulty |
|----------|---------|------------|
| Static Elements | Basic heuristic healing | Level 1 |
| Form Inputs | DOM scoring algorithms | Level 2 |
| Dynamic Content | AI-powered recovery | Level 3 |
| Modals | Overlay interactions | Level 2 |
| Conditional Elements | Show/hide visibility | Level 2 |
| Navigation Links | Link healing | Level 1 |

### Skill Registry Tests (7 Scenarios)

| Scenario | Exception Type | Skill Action |
|----------|---------------|--------------|
| Ad Popup | ElementClickInterceptedException | Click close button |
| Cookie Banner | ElementClickInterceptedException | Accept cookies |
| Newsletter Popup | ElementClickInterceptedException | Dismiss popup |
| Scroll Required | ElementNotInteractableException | Scroll into view |
| Loading Spinner | TimeoutException | Wait for completion |
| Stale Element | StaleElementReferenceException | Wait for DOM |
| Multiple Popups | ElementClickInterceptedException | Dismiss all |

## Key Features

### Dual-Tab Interface
- **Healing Agent Tests:** Focus on locator recovery
- **Skill Registry Tests:** Focus on exception handling

### Interactive Controls
- Trigger buttons to simulate failures
- Status indicators for test progress
- Visual feedback for successful actions
- Real-time DOM manipulation

### Realistic Simulations
- **DOM Overlays:** Actual HTML elements with z-index blocking
- **Cookie Banners:** Fixed-position bottom banners
- **Loading Spinners:** Full-screen overlays
- **Stale Elements:** React/Vue-style DOM re-renders
- **Hidden Elements:** Out-of-viewport scroll testing

### Visual Design
- Modern gradient header
- Responsive grid layout
- Smooth animations
- Color-coded status messages
- Mobile-friendly design

## Usage Examples

### Example 1: Test Ad Popup Handling

**Setup:**
```bash
# Create skill
curl -X POST http://localhost:3000/api/v2/testscenario/org/proj/scenario/skills \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ad Popup Handler",
    "triggerCondition": "When an unexpected ad popup appears on screen",
    "actionDescription": "Click on the close (X) icon",
    "priority": 1
  }'
```

**Test Steps:**
1. Navigate to `http://localhost:8080`
2. Click "Skill Registry Tests" tab
3. Click "Trigger Ad Popup" button
4. Click "Continue to Next Step" button
5. **Expected:** Popup dismissed automatically, step succeeds

**Verification:**
```bash
# Check logs
grep "\[SkillRegistry\]" core-engine.log

# Check MongoDB
mongo
> use automator
> db.skillexecutions.find({skillName: "Ad Popup Handler"}).pretty()
```

### Example 2: Test Cookie Banner

**Selenium Test Code:**
```java
// Navigate to test page
driver.get("http://localhost:8080");

// Switch to Skill Registry tab
driver.findElement(By.xpath("//button[contains(text(),'Skill Registry Tests')]")).click();

// Trigger cookie banner
driver.findElement(By.xpath("//button[contains(text(),'Trigger Cookie Banner')]")).click();

// This click should be blocked by banner, triggering skill execution
driver.findElement(By.id("acceptTermsButton2")).click();

// If skill executes correctly, test continues without error
```

### Example 3: Test Multiple Popups

**Test Scenario:**
```yaml
steps:
  - action: navigate
    url: http://localhost:8080
  
  - action: click
    element: 
      text: "Skill Registry Tests"
  
  - action: click
    element:
      text: "Trigger Sequential Popups"
  
  - action: wait
    seconds: 4
  
  - action: click
    element:
      id: finalActionButton2
    # Three popups will block this click
    # Skill Registry should dismiss all three
    # Click should succeed on final retry
```

## Integration with Automator

### Backend Integration

The test page works with these backend endpoints:

```
POST   /api/v2/testscenario/:orgId/:projId/:scenarioId/skills       # Create skill
GET    /api/v2/testscenario/:orgId/:projId/:scenarioId/skills       # List skills
GET    /api/v2/testscenario/:orgId/:projId/:scenarioId/skills/:id   # Get skill
PATCH  /api/v2/testscenario/:orgId/:projId/:scenarioId/skills/:id   # Update skill
DELETE /api/v2/testscenario/:orgId/:projId/:scenarioId/skills/:id   # Delete skill
```

### Core Engine Integration

The core engine processes skill execution:

1. **Exception Detection:** Catches exceptions during step execution
2. **Skill Evaluation:** Uses Gemini AI to match trigger conditions
3. **Action Execution:** Uses AI Element Finder to locate and interact with elements
4. **Retry Logic:** Retries original step after skill succeeds
5. **Logging:** Records all execution details

### MongoDB Collections

```javascript
// Skills collection
{
  "_id": "skill_uuid",
  "name": "Ad Popup Handler",
  "scenarioId": "testScenario_uuid",
  "triggerCondition": "When an unexpected ad popup appears on screen",
  "actionDescription": "Click on the close (X) icon",
  "priority": 1,
  "isActive": true,
  "createdBy": "user_uuid",
  "createdAt": ISODate("2026-04-16T00:00:00Z")
}

// Skill Executions collection
{
  "_id": "skillExec_uuid",
  "skillId": "skill_uuid",
  "skillName": "Ad Popup Handler",
  "scenarioId": "testScenario_uuid",
  "executionId": "exec_uuid",
  "stepId": "step_uuid",
  "success": true,
  "triggerCondition": "When an unexpected ad popup appears on screen",
  "actionDescription": "Click on the close (X) icon",
  "exceptionType": "ElementClickInterceptedException",
  "exceptionMessage": "element click intercepted...",
  "executedAt": ISODate("2026-04-16T14:30:00Z"),
  "executionTimeMs": 2341
}
```

## Browser Compatibility

| Browser | Healing Agent | Skill Registry | Notes |
|---------|--------------|---------------|-------|
| Chrome | ✅ | ✅ | Recommended |
| Firefox | ✅ | ✅ | Full support |
| Edge | ✅ | ✅ | Full support |
| Safari | ⚠️ | ⚠️ | Limited testing |

## Performance Benchmarks

### Healing Agent
- Heuristic healing: < 1 second
- DOM scoring: < 2 seconds
- AI recovery: 3-5 seconds

### Skill Registry
- Skill evaluation: < 3 seconds
- Skill execution: < 5 seconds
- Total overhead: < 8 seconds per skill

## Troubleshooting

### Test Page Not Loading
```bash
# Check if port 8080 is in use
lsof -i :8080

# Try different port
python3 -m http.server 8081
```

### Buttons Not Responding
- Open browser console (F12)
- Check for JavaScript errors
- Verify `script.js` loaded correctly

### Popups Not Appearing
- Check browser console for errors
- Verify CSS is loaded (`styles.css`)
- Try refreshing page

### Skill Registry Not Triggering
- Verify `useSkillRegistry: true` in project config
- Check skills exist for scenario
- Review core engine logs for errors
- See [SKILL_REGISTRY_TESTING_GUIDE.md](SKILL_REGISTRY_TESTING_GUIDE.md)

## Documentation

- **[SKILL_REGISTRY_TESTING_GUIDE.md](SKILL_REGISTRY_TESTING_GUIDE.md)** - Comprehensive testing guide with all scenarios
- **[QUICK_START_SKILL_TESTING.md](QUICK_START_SKILL_TESTING.md)** - 5-minute quick start guide
- **Core Engine:** `/automator-core-engine/SKILL_REGISTRY_README.md`
- **Architecture:** `/automator-core-engine/HEALING_AGENT_ARCHITECTURE.md`

## Development

### Running Locally

```bash
# Install no dependencies - pure HTML/CSS/JS!
# Just serve the files

# Option 1: Python
python3 -m http.server 8080

# Option 2: Node.js
npx http-server -p 8080

# Option 3: PHP
php -S localhost:8080
```

### Modifying Tests

Edit these files:
- `index.html` - Add new test scenarios
- `script.js` - Add new interactive behaviors
- `styles.css` - Customize styling

### Adding New Scenarios

1. Add HTML section to `index.html`:
```html
<div class="section">
    <h2>🆕 Test 8: Your New Test</h2>
    <div class="skill-test-scenario">
        <!-- Test content -->
    </div>
</div>
```

2. Add JavaScript function to `script.js`:
```javascript
function triggerYourNewTest() {
    // Test logic
}
```

3. Add styles to `styles.css`:
```css
.your-new-test-class {
    /* Styles */
}
```

## Contributing

When adding new test scenarios:
1. Follow existing naming conventions
2. Add comprehensive documentation
3. Include trigger conditions and expected exceptions
4. Test on Chrome, Firefox, and Edge
5. Update this README

## License

Internal tool for Automator.AI - Not for external distribution

## Support

For issues or questions:
- Check documentation first
- Review core engine logs
- Verify MongoDB records
- Consult main SKILL_REGISTRY_README.md

---

**Last Updated:** April 16, 2026  
**Version:** 2.0.0 (Healing Agent + Skill Registry)
