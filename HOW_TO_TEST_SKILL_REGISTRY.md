# How to Test Skill Registry with the Test Page

## Understanding the Issue

### What Happened Previously
1. Test clicked "Click Me" button (dynamic content)
2. JavaScript alert appeared: "Dynamic button 1 clicked!"
3. With `IGNORE`: UnhandledAlertException thrown → Test failed
4. With `ACCEPT`: Alert auto-accepted → Test passed
5. **Problem**: Skill Registry never triggered because no exception occurred!

### The Correct Approach

JavaScript alerts are **NOT** the right way to test Skill Registry. Here's why:

| Alert Type | Selenium Behavior | Skill Registry Test? |
|------------|-------------------|----------------------|
| **JavaScript alert()** | Auto-accepted (ACCEPT config) | ❌ No - Selenium handles it |
| **DOM Popup Overlay** | Blocks element click | ✅ Yes - Causes ElementClickInterceptedException |

## Proper Test Scenario

### Scenario: Dynamic Button with Auto-Popup

The test page now has an **improved test scenario**:

```javascript
function handleDynamicClick(num) {
    console.log(`Dynamic button ${num} clicked!`);
    
    // On first click: Show ad popup overlay after 500ms
    if (num === 1) {
        setTimeout(() => {
            triggerAdPopup(); // Shows actual DOM overlay
            console.log('Ad popup auto-triggered - blocks subsequent clicks');
        }, 500);
    }
    
    // Visual feedback
    // ...
}
```

### Test Flow

```
1. Generate Dynamic Content (click "Generate Dynamic Content")
   ↓
2. Click "Click Me" button (#1)
   ✅ First click succeeds
   ↓
3. Ad Popup Overlay Appears (after 500ms)
   - Covers the entire page
   - Positioned with z-index: 2000
   - Physically blocks all interactions
   ↓
4. Click "Click Me" button (#1) AGAIN
   ❌ ElementClickInterceptedException thrown
   (Element <button> is not clickable. Other element would receive the click: <div id="adPopup">)
   ↓
5. Skill Registry Triggered
   - Loads skills for scenario
   - Evaluates trigger with Gemini AI
   - Executes action: "Click close (X) button"
   - Popup dismissed
   ↓
6. Retry Click
   ✅ Click succeeds
   ↓
7. Test Passes (with Skill Registry logs!)
```

## Test Setup

### 1. Create Skill in MongoDB

```bash
POST /api/v2/testscenario/{orgId}/{projectId}/{scenarioId}/skills
{
  "name": "Ad Popup Auto-Closer",
  "trigger": {
    "description": "When an unexpected ad popup or overlay appears blocking interactions"
  },
  "action": {
    "description": "Click on the close button or X icon to dismiss the popup"
  },
  "enabled": true,
  "priority": 100
}
```

### 2. Create Test Steps in Automator

```
Step 1: Navigate to test page
  Action: OPEN_URL
  URL: http://localhost:8080 (or your test page URL)

Step 2: Generate dynamic content
  Action: CLICK
  Locator: By.id("generateDynamicBtn")

Step 3: First click (triggers popup)
  Action: CLICK
  Locator: By.id("dynamicBtn1")

Step 4: Wait for popup to appear
  Action: WAIT
  Duration: 1 second

Step 5: Second click (should be blocked by popup, then recovered by skill)
  Action: CLICK
  Locator: By.id("dynamicBtn1")
  Expected: ElementClickInterceptedException → Skill Registry → Success
```

### 3. Enable Skill Registry

```json
// Project configuration
{
  "config": {
    "useSkillRegistry": true,
    "useHealingAgent": true
  }
}
```

## Expected Logs (After Fix)

### Console Output
```
Generated Dynamic Content
Auto Heal: true && LOCATORS ======>1
came inside the data2

[First click - Step 3]
✓ Dynamic button clicked
Popup triggered after 500ms

[Second click - Step 5]
rrl useSkillRegistry------:::::::::true
{"location":"SeleniumScriptGenerator.java:882","message":"Entering element location block",...}
{"location":"SeleniumScriptGenerator.java:890","message":"Exception caught","data":{"exceptionType":"ElementClickInterceptedException"},...}
{"location":"SeleniumScriptGenerator.java:901","message":"Entering skill registry block",...}

[SkillRegistry] ===== SKILL REGISTRY TRIGGERED =====
[SkillRegistry] Scenario: testScenario_..., Step: step_005
[SkillRegistry] Exception: ElementClickInterceptedException
[SkillRegistry] Loaded 1 skill(s) from SkillService

[SkillRegistry] Evaluating skill: Ad Popup Auto-Closer (Priority: 100)
[SkillRegistry] TRIGGER_EVAL: Captured screenshot
[SkillRegistry] TRIGGER_EVAL: Querying Gemini
[SkillRegistry] TRIGGER_EVAL: Gemini response: YES
[SkillRegistry] Trigger evaluation: MATCH

[SkillRegistry] ACTION_EXEC: Starting action execution
[SkillRegistry] ACTION_EXTRACT: Parsing action with AI
[SkillRegistry] ACTION_EXTRACT: AI parsed - Type: click, Target: close button
[SkillRegistry] ACTION_EXEC: Found element at index: 0
[SkillRegistry] ACTION_EXEC: Executing click action
[SkillRegistry] ACTION_EXEC: Action completed successfully

[SkillRegistry] ===== SKILL EXECUTION SUCCESS =====
[SkillRegistry] Retrying original element location
✓ Element clicked successfully on retry
```

### Debug Log File
```json
{"sessionId":"9d7efc","location":"SeleniumScriptGenerator.java:882","message":"Entering element location block","data":{"entityCount":1,"scenarioId":"testScenario_..."},...}
{"sessionId":"9d7efc","location":"SeleniumScriptGenerator.java:890","message":"Exception caught in element location","data":{"exceptionType":"ElementClickInterceptedException","message":"Element <button id='dynamicBtn1'> is not clickable at point (x,y). Other element would receive the click: <div id='adPopup'>"},...}
{"sessionId":"9d7efc","location":"SeleniumScriptGenerator.java:901","message":"Entering skill registry block","data":{"scenarioId":"testScenario_..."},...}
{"sessionId":"9d7efc","location":"SeleniumScriptGenerator.java:920","message":"Skill execution result","data":{"resultNull":false,"success":true},...}
```

## Why Logs Weren't Generated

### Hypothesis 1: Wrong Test Scenario
You might be testing the healing agent tab, not the skill registry tab.

### Hypothesis 2: Dynamic Button Not Blocking Properly
The dynamic button test doesn't create an actual popup overlay - it used JavaScript alert (which is now auto-accepted).

### Hypothesis 3: No Exception Thrown
If no exception occurs, skill registry won't trigger. The test must **actually fail** first for skill registry to activate.

### Hypothesis 4: Different Code Path
Your test might be taking the `length == 1` path (lines 857-880), which has `catch` blocks that return `null` instead of triggering skill registry.

## Solution: Proper Test Scenario

### Option A: Use Skill Registry Tab Elements

Test the buttons specifically designed for skill registry:

```java
// Test Ad Popup Scenario
driver.get("http://localhost:8080");

// Switch to Skill Registry tab
driver.findElement(By.xpath("//button[contains(text(),'Skill Registry Tests')]")).click();

// Manually trigger ad popup
driver.findElement(By.xpath("//button[contains(text(),'Trigger Ad Popup')]")).click();

// Wait for popup to show
Thread.sleep(500);

// Try to click Continue button (will be blocked by popup)
WebElement continueBtn = driver.findElement(By.id("continueButton2"));
continueBtn.click(); // Should throw ElementClickInterceptedException
// Skill Registry should detect, dismiss popup, and retry
```

### Option B: Modify Dynamic Button Test (Current Approach)

The test page now auto-triggers the ad popup after the first click. To test:

```java
// Generate dynamic content
driver.findElement(By.id("generateDynamicBtn")).click();

// First click - triggers popup after 500ms
driver.findElement(By.id("dynamicBtn1")).click();

// Wait for popup to appear
Thread.sleep(1000);

// Second click - should be blocked by popup
driver.findElement(By.id("dynamicBtn1")).click();
// → ElementClickInterceptedException
// → Skill Registry activates
// → Popup dismissed
// → Click succeeds on retry
```

## Debugging Checklist

If Skill Registry logs still don't appear:

- [ ] Verify `useSkillRegistry: true` in project config
- [ ] Check skill exists in MongoDB for the scenario
- [ ] Confirm skill is `enabled: true`
- [ ] Verify `scenarioId` matches between test and skill
- [ ] Check if exception is actually thrown (add try-catch in test)
- [ ] Verify code path (check which "came inside dataX" prints)
- [ ] Look for instrumentation logs in debug file

## Next Test Run

<reproduction_steps>
1. Restart core engine (./gradlew clean bootRun)
2. Create a test with TWO steps:
   - Step 1: Click "Generate Dynamic Content" button (By.id("generateDynamicBtn"))
   - Step 2: Click "Click Me" button TWICE with 1s wait between (By.id("dynamicBtn1"))
3. The second click should be blocked by the auto-triggered ad popup
4. Check for [SkillRegistry] logs in the output
5. Check /Users/prince75.kumar/automator/automator-backend/.cursor/debug-9d7efc.log file
6. Press Proceed/Mark as fixed when done
</reproduction_steps>

The key is that the popup must **physically block** the element (DOM overlay), not be a JavaScript alert. The updated test page now auto-triggers a real DOM popup overlay after the first click.

---

**TL;DR**: Your test passed because JavaScript alerts are now auto-accepted. To test Skill Registry, you need an **actual DOM popup overlay** that physically blocks clicks. The test page now auto-triggers this after the first dynamic button click.
