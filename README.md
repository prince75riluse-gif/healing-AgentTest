# Healing Agent & Skill Registry Test Page

## Overview

This is a comprehensive test page designed to validate both:
1. **Healing Agent** - AI-powered locator recovery when element locators change
2. **Skill Registry** - AI-powered exception recovery using user-defined skills

## Features

### Healing Agent Tests (Original)
- ✅ Static elements with changed locators
- ✅ Form inputs with dynamic IDs
- ✅ Dynamic content generation
- ✅ Modal and overlay testing
- ✅ Conditional elements (show/hide)
- ✅ Navigation link testing

### Skill Registry Tests (NEW)
- 🎯 Ad popup interruption (ElementClickInterceptedException)
- 🍪 Cookie consent banner (ElementClickInterceptedException)
- 📧 Newsletter subscription popup (ElementClickInterceptedException)
- 👁️ Element not visible - scroll required (ElementNotInteractableException)
- ⏳ Loading spinner blocker (TimeoutException)
- 🔄 Stale element after DOM update (StaleElementReferenceException)
- 🪟 Multiple overlapping popups (Sequential recovery)
- ✍️ Type action - email input field

## Quick Start

### 1. Open the Page

```bash
cd /Users/prince75.kumar/automator/healing-agent-test-page
open index.html
```

Or serve with a local server:
```bash
python3 -m http.server 8080
# Then open http://localhost:8080
```

### 2. Switch Between Test Modes

Click the tabs at the top:
- **Healing Agent Tests** - Original locator healing tests
- **Skill Registry Tests** - New exception recovery tests

## Skill Registry Test Scenarios

### Test 1: Ad Popup Interruption

**Setup in Automator:**
```bash
POST /api/v2/testscenario/{orgId}/{projectId}/{scenarioId}/skills
{
  "name": "Ad Popup Handler",
  "trigger": {
    "description": "When an unexpected ad popup appears on screen"
  },
  "action": {
    "description": "Click on the close (X) icon"
  },
  "enabled": true,
  "priority": 100
}
```

**Test Steps:**
1. Create test step: "Click Continue button"
2. Run test
3. Click "Trigger Ad Popup" on test page
4. Ad popup blocks the Continue button
5. Skill Registry detects popup via Gemini vision
6. Skill clicks the X close button
7. Test step retries and succeeds

**Expected Exception:** `ElementClickInterceptedException: Element <button> is not clickable`

---

### Test 2: Cookie Consent Banner

**Setup in Automator:**
```bash
POST /api/v2/testscenario/{orgId}/{projectId}/{scenarioId}/skills
{
  "name": "Cookie Banner Handler",
  "trigger": {
    "description": "When a cookie consent banner is blocking interactions"
  },
  "action": {
    "description": "Click on the Accept All button"
  },
  "enabled": true,
  "priority": 100
}
```

**Test Steps:**
1. Create test step: "Click Accept Terms button"
2. Run test
3. Click "Trigger Cookie Banner"
4. Banner blocks the button
5. Skill clicks "Accept All"
6. Test succeeds

**Expected Exception:** `ElementClickInterceptedException`

---

### Test 3: Newsletter Popup

**Setup in Automator:**
```bash
POST /api/v2/testscenario/{orgId}/{projectId}/{scenarioId}/skills
{
  "name": "Newsletter Popup Handler",
  "trigger": {
    "description": "When newsletter subscription popup appears"
  },
  "action": {
    "description": "Click on the No Thanks button"
  },
  "enabled": true,
  "priority": 100
}
```

**Expected Exception:** `ElementClickInterceptedException`

---

### Test 4: Element Not Visible (Scroll)

**Setup in Automator:**
```bash
POST /api/v2/testscenario/{orgId}/{projectId}/{scenarioId}/skills
{
  "name": "Scroll Element Into View",
  "trigger": {
    "description": "When target element is not visible in viewport"
  },
  "action": {
    "description": "Scroll the target element into center of viewport"
  },
  "enabled": true,
  "priority": 90
}
```

**Test Steps:**
1. Create test step: "Click Hidden Button"
2. Run test (button is 1500px down, out of viewport)
3. Selenium fails with exception
4. Skill scrolls element into view
5. Test retries and succeeds

**Expected Exception:** `ElementNotInteractableException: element is not interactable`

---

### Test 5: Loading Spinner

**Setup in Automator:**
```bash
POST /api/v2/testscenario/{orgId}/{projectId}/{scenarioId}/skills
{
  "name": "Loading Spinner Waiter",
  "trigger": {
    "description": "When loading spinner is blocking interactions"
  },
  "action": {
    "description": "Wait for loading spinner to disappear"
  },
  "enabled": true,
  "priority": 85
}
```

**Test Steps:**
1. Create test step: "Click Process Data"
2. Click "Trigger Loading Spinner"
3. Spinner overlays entire page
4. Skill waits (uses 2-second wait action)
5. Spinner disappears after 5 seconds
6. Test retries and succeeds

**Expected Exception:** `TimeoutException` or `ElementClickInterceptedException`

---

### Test 6: Stale Element

**Setup in Automator:**
```bash
POST /api/v2/testscenario/{orgId}/{projectId}/{scenarioId}/skills
{
  "name": "Stale Element Handler",
  "trigger": {
    "description": "When element reference becomes stale after DOM update"
  },
  "action": {
    "description": "Wait 2 seconds for DOM to stabilize"
  },
  "enabled": true,
  "priority": 80
}
```

**Test Steps:**
1. Create test step: "Click Target Button"
2. Get element reference
3. Click "Cause DOM Re-render"
4. DOM completely re-renders (simulates React/Vue)
5. Original element reference becomes stale
6. Skill waits for stabilization
7. Element re-located and test succeeds

**Expected Exception:** `StaleElementReferenceException: stale element reference`

---

### Test 7: Multiple Popups

**Setup in Automator:**
```bash
POST /api/v2/testscenario/{orgId}/{projectId}/{scenarioId}/skills
{
  "name": "Generic Popup Closer",
  "trigger": {
    "description": "When any popup or modal is blocking interactions"
  },
  "action": {
    "description": "Click close button or dismiss link"
  },
  "enabled": true,
  "priority": 100
}
```

**Test Steps:**
1. Create test step: "Click Complete Action"
2. Click "Trigger Sequential Popups"
3. Three popups appear: Cookie → Newsletter → Promo
4. Each blocks the button in sequence
5. Skill executes 3 times, dismissing each popup
6. Test eventually succeeds

**Expected Exception:** `ElementClickInterceptedException` (3 times)

---

### Test 8: Type Action

**Setup in Automator:**
```bash
POST /api/v2/testscenario/{orgId}/{projectId}/{scenarioId}/skills
{
  "name": "Enable Input Field",
  "trigger": {
    "description": "When email field is not accepting input"
  },
  "action": {
    "description": "Type 'test@example.com' into the email input field"
  },
  "enabled": true,
  "priority": 70
}
```

**Expected Exception:** `ElementNotInteractableException: element is disabled`

---

## Automation Test Example

### Selenium Test Code

```java
// Setup
driver.get("http://localhost:8080");

// Test step that will fail and trigger skill
WebElement continueBtn = driver.findElement(By.id("continueButton2"));

// Manually trigger popup to simulate interruption
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript("document.getElementById('adPopup').classList.add('show');");

// This click will fail due to popup
continueBtn.click(); // Throws ElementClickInterceptedException

// Skill Registry automatically:
// 1. Captures screenshot
// 2. Evaluates trigger with Gemini: "Does ad popup appear?" → YES
// 3. Executes action: Find "close (X) icon" and click
// 4. Popup dismissed
// 5. Retries click → Succeeds!
```

## Expected Logs

When skill executes, you should see in core engine logs:

```
[SkillRegistry] ===== SKILL REGISTRY TRIGGERED =====
[SkillRegistry] Scenario: testScenario_798d9623-..., Step: step_001
[SkillRegistry] Exception: ElementClickInterceptedException
[SkillRegistry] Loaded 1 skill(s) from SkillService

[SkillRegistry] Evaluating skill: Ad Popup Handler (Priority: 100)
[SkillRegistry] TRIGGER_EVAL: Captured screenshot - Size: 123456 bytes
[SkillRegistry] TRIGGER_EVAL: Querying Gemini for trigger
[SkillRegistry] TRIGGER_EVAL: Gemini response: YES
[SkillRegistry] Trigger evaluation: MATCH

[SkillRegistry] ACTION_EXEC: Starting action execution
[SkillRegistry] ACTION_EXTRACT: Parsing action with AI
[SkillRegistry] ACTION_EXTRACT: Gemini response: {"actionType":"click","targetElement":"close (X) icon","inputValue":null}
[SkillRegistry] ACTION_EXTRACT: AI parsed - Type: click, Target: close (X) icon
[SkillRegistry] ACTION_EXEC: Found element at index: 0
[SkillRegistry] ACTION_EXEC: Executing click action
[SkillRegistry] ACTION_EXEC: Action completed successfully

[SkillRegistry] ===== SKILL EXECUTION SUCCESS =====
[SkillRegistry] Skill: Ad Popup Handler
[SkillRegistry] Duration: 2345ms
```

## MongoDB Verification

After skill executes, check the database:

```bash
mongo
use automator

# Check skill statistics updated
db.skills.findOne({ _id: "skill_abc-123-..." })
# Should show: executionCount: 1, successCount: 1, lastExecutedAt: <timestamp>

# Check execution logs
db.skillexecutions.find({ scenarioId: "testScenario_798d9623-..." })
# Should show detailed execution log entry
```

## File Structure

```
healing-agent-test-page/
├── index.html          # Main test page (with tabs)
├── script.js           # JavaScript for both test modes
├── styles.css          # Styling for all elements
├── docs.html           # Documentation page
├── README.md           # This file
├── QUICKSTART.md       # Quick setup guide
├── DEPLOYMENT.md       # Deployment instructions
└── PROJECT_SUMMARY.md  # Project overview
```

## Key Differences: Healing Agent vs Skill Registry

| Aspect | Healing Agent | Skill Registry |
|--------|--------------|----------------|
| **Purpose** | Fix broken locators | Handle ANY exception |
| **Trigger** | Locator doesn't work | Test step fails |
| **Method** | Snapshot matching, DOM scoring | AI-powered skills |
| **Scope** | Element location only | Full test recovery |
| **User Input** | None (automatic) | User defines skills |
| **Use Cases** | ID/class changed | Popups, loading, visibility, etc. |

## Test Workflow

```
1. Configure Project
   ├─ Enable useSkillRegistry: true
   └─ Enable useHealingAgent: true (optional)

2. Create Skills
   ├─ Define trigger conditions
   └─ Define recovery actions

3. Open Test Page
   └─ Switch to "Skill Registry Tests" tab

4. Run Test in Automator
   ├─ Point to test page URL
   └─ Create test steps

5. Trigger Interruptions
   ├─ Use "Trigger" buttons on page
   └─ Simulate real-world failures

6. Observe Recovery
   ├─ Check core engine logs
   ├─ Verify skill execution
   └─ Confirm test succeeds

7. Verify Results
   ├─ MongoDB: skillexecutions collection
   ├─ Skill statistics updated
   └─ Test reports show skillExecutionData
```

## Interactive Features

### Trigger Buttons
Each test has a "Trigger" button that simulates the failure condition:
- **Trigger Ad Popup** - Shows ad overlay
- **Trigger Cookie Banner** - Shows cookie consent
- **Trigger Loading Spinner** - Shows loading overlay (auto-dismisses after 5s)
- **Cause DOM Re-render** - Forces element to become stale

### Visual Feedback
All interactions provide visual feedback:
- ✅ Success messages (green)
- ⚠️ Warning messages (yellow)
- ❌ Error messages (red)

### Keyboard Support
- **ESC key** - Closes all popups and overlays
- **Tab navigation** - Navigate between elements

## Best Practices

1. **Test One Scenario at a Time** - Clear previous popups before testing next
2. **Monitor Logs** - Watch core engine logs for detailed execution info
3. **Verify Database** - Check MongoDB after each test
4. **Test Priorities** - Create multiple skills to test priority ordering
5. **Test Failures** - Disable skills to verify fallback to healing agent

## Common Use Cases

### Use Case 1: Real Ad Blockers
Create skill for actual ad popups that appear on production sites.

### Use Case 2: Cookie Compliance
Handle GDPR/cookie banners that block first-time visitors.

### Use Case 3: Newsletter Popups
Dismiss newsletter subscriptions that interrupt checkout flows.

### Use Case 4: Mobile Responsiveness
Handle elements that scroll out of view on different screen sizes.

### Use Case 5: SPA Navigation
Handle stale elements in React/Vue/Angular applications.

## Troubleshooting

### Issue: Popups Don't Appear
**Solution:** Make sure JavaScript is enabled in your browser.

### Issue: Skill Doesn't Execute
**Solution:** 
1. Verify `useSkillRegistry: true` in project config
2. Check skill is enabled in database
3. Verify trigger description matches failure scenario
4. Review core engine logs for [SkillRegistry] entries

### Issue: Multiple Popups Test Confusing
**Solution:** Press ESC to clear all popups and start fresh.

## Contributing

To add new test scenarios:

1. Add HTML for new test in the Skills tab
2. Create trigger function in `script.js`
3. Add corresponding popup overlay HTML
4. Style with new CSS classes
5. Document expected exception and skill definition

## License

MIT License - See LICENSE file

---

**Version:** 2.0 (with Skill Registry support)  
**Last Updated:** April 15, 2026  
**Author:** Automator.AI Team
