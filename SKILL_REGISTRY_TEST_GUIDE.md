# Skill Registry Test Guide

## Quick Reference for Testing Skill Registry Framework

### Setup Checklist

- [ ] Enable `useSkillRegistry: true` in project config
- [ ] Open test page: `http://localhost:8080` or `file:///...healing-agent-test-page/index.html`
- [ ] Switch to "Skill Registry Tests" tab
- [ ] MongoDB running and accessible
- [ ] Core engine logs visible

---

## Test Matrix

| # | Test Name | Exception Type | Trigger Description | Action Description |
|---|-----------|----------------|---------------------|---------------------|
| 1 | Ad Popup | ElementClickInterceptedException | "When an unexpected ad popup appears on screen" | "Click on the close (X) icon" |
| 2 | Cookie Banner | ElementClickInterceptedException | "When a cookie consent banner is blocking interactions" | "Click on the Accept All button" |
| 3 | Newsletter Popup | ElementClickInterceptedException | "When newsletter subscription popup appears" | "Click on the No Thanks button" |
| 4 | Scroll Required | ElementNotInteractableException | "When target element is not visible in viewport" | "Scroll the target element into center of viewport" |
| 5 | Loading Spinner | TimeoutException | "When loading spinner is blocking interactions" | "Wait for loading spinner to disappear" |
| 6 | Stale Element | StaleElementReferenceException | "When element reference becomes stale after DOM update" | "Wait 2 seconds for DOM to stabilize" |
| 7 | Multiple Popups | ElementClickInterceptedException | "When any popup or modal is blocking interactions" | "Click close button or dismiss link" |

---

## 3-Minute Quick Test

### 1. Create Skill (1 min)

```bash
curl -X POST "http://localhost:3000/api/v2/testscenario/{orgId}/{projectId}/{scenarioId}/skills" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ad Popup Handler",
    "trigger": {
      "description": "When an unexpected ad popup appears on screen"
    },
    "action": {
      "description": "Click on the close (X) icon"
    },
    "enabled": true,
    "priority": 100
  }'
```

### 2. Create Test Scenario (1 min)

In Automator UI:
1. Create new test scenario
2. Add step: "Click element with ID: continueButton2"
3. Set locator: `By.id("continueButton2")`

### 3. Run Test (1 min)

1. Execute test through Automator
2. IMMEDIATELY click "Trigger Ad Popup" button on test page
3. Watch logs for `[SkillRegistry]` entries
4. Verify test succeeds

---

## Expected Log Sequence

```
✅ 1. [SkillRegistry] ===== SKILL REGISTRY TRIGGERED =====
✅ 2. [SkillRegistry] Exception: ElementClickInterceptedException
✅ 3. [SkillRegistry] Loaded 1 skill(s) from SkillService
✅ 4. [SkillRegistry] Evaluating skill: Ad Popup Handler
✅ 5. [SkillRegistry] TRIGGER_EVAL: Querying Gemini for trigger
✅ 6. [SkillRegistry] TRIGGER_EVAL: Gemini response: YES
✅ 7. [SkillRegistry] ACTION_EXEC: Executing click action
✅ 8. [SkillRegistry] ===== SKILL EXECUTION SUCCESS =====
✅ 9. Test step retries and PASSES
```

---

## Failure Indicators

### ❌ Skill Not Executed

**Symptom:** No `[SkillRegistry]` logs appear

**Causes:**
1. `useSkillRegistry: false` in config
2. Skill disabled in database
3. No skills match scenarioId
4. Exception occurred before element location

**Debug:**
```bash
# Check config
mongo automator
db.projects.findOne({ _id: "project_..." }, { "config.useSkillRegistry": 1 })

# Check skills
db.skills.find({ scenarioId: "testScenario_...", enabled: true })
```

---

### ❌ Trigger Doesn't Match

**Symptom:** Logs show `TRIGGER_EVAL: Gemini response: NO`

**Causes:**
1. Trigger description too specific
2. Popup not visible in screenshot
3. Gemini can't identify the condition

**Fix:**
- Make trigger more generic: "When a popup is blocking the page"
- Ensure popup is actually visible
- Check screenshot captured correctly

---

### ❌ Action Fails

**Symptom:** `ACTION_EXEC: Action failed: Element not found`

**Causes:**
1. Target element description unclear
2. Element not actually present
3. Element outside viewport

**Fix:**
- Simplify action: "Click the close button"
- Verify element exists in DOM
- Add scroll action first

---

## Test Data IDs Reference

### Buttons (Target Elements)
- `continueButton2` - Test 1 (Ad Popup)
- `acceptTermsButton2` - Test 2 (Cookie Banner)
- `submitFormButton2` - Test 3 (Newsletter)
- `hiddenButton2` - Test 4 (Scroll)
- `processDataButton2` - Test 5 (Loading)
- `staleTestButton2` - Test 6 (Stale Element)
- `finalActionButton2` - Test 7 (Multiple Popups)

### Popup Elements (For Skills to Find)
- `adCloseBtn` - Close button (X) for ad popup
- `acceptAllCookies` - Accept All button for cookies
- `noThanksBtn` - No Thanks button for newsletter
- `promoCloseBtn` - Close button for promo popup

---

## MongoDB Quick Checks

```javascript
// 1. Verify skill created
db.skills.findOne({ name: "Ad Popup Handler" })

// 2. Check execution count
db.skills.findOne(
  { _id: "skill_abc123..." },
  { executionCount: 1, successCount: 1, lastExecutedAt: 1 }
)

// 3. View execution logs
db.skillexecutions.find({ 
  scenarioId: "testScenario_...",
  success: true 
}).sort({ timestamp: -1 }).limit(5)

// 4. Check report data
db.testscenarioreferences.findOne(
  { _id: "ref_..." },
  { "elements.iterations.skillExecutionData": 1 }
)
```

---

## Common Pitfalls

### 1. Timing Issues
**Problem:** Popup appears AFTER Selenium tries to click  
**Solution:** Use slower execution speed or add explicit waits

### 2. Wrong Scenario
**Problem:** Skill created for different scenario  
**Solution:** Double-check `scenarioId` matches

### 3. Gemini Quota
**Problem:** Too many AI requests in testing  
**Solution:** Add delays between test runs

### 4. Multiple Skills Match
**Problem:** Unclear which skill executed  
**Solution:** Use unique trigger descriptions and check priority

---

## Advanced Testing

### Test Skill Priority

Create 3 skills with same trigger but different priorities:

```javascript
// Skill 1 - Priority 100 (should execute first)
{ name: "High Priority", trigger: "...", priority: 100 }

// Skill 2 - Priority 50
{ name: "Medium Priority", trigger: "...", priority: 50 }

// Skill 3 - Priority 10
{ name: "Low Priority", trigger: "...", priority: 10 }
```

Verify only highest priority executes.

---

### Test Skill Statistics

1. Run test 10 times
2. Trigger popup each time
3. Check skill stats:

```javascript
db.skills.findOne({ name: "Ad Popup Handler" })
// Should show: executionCount: 10, successCount: 10
```

---

### Test Fallback to Healing Agent

1. Disable all skills: `db.skills.updateMany({}, { $set: { enabled: false } })`
2. Run test with broken locator
3. Verify healing agent takes over
4. Re-enable skills
5. Verify skill registry takes priority

---

## Performance Benchmarks

Expected timings:

| Operation | Duration |
|-----------|----------|
| Trigger evaluation (with AI) | 800-1500ms |
| Action execution (click) | 500-1000ms |
| Total skill execution | 1500-3000ms |
| Test retry after skill | 200-500ms |

If significantly slower, check:
- Network latency to Gemini API
- Screenshot size (should be ~100-500KB)
- MongoDB query performance

---

## Debugging Commands

### Enable Detailed Logging

Add to `Config.json`:
```json
{
  "debugMode": true,
  "skillRegistryDebug": true
}
```

### View Real-time Logs

```bash
# Core engine logs
tail -f logs/automator-core-engine.log | grep "SkillRegistry"

# Filter for specific scenario
tail -f logs/automator-core-engine.log | grep "testScenario_abc123"
```

### Test AI Parsing Directly

Create minimal test:
```java
// Test trigger evaluation
String result = SkillRegistry.queryGeminiForTriggerMatch(
    "When ad popup appears",
    "ElementClickInterceptedException: Element <button> is not clickable at point (100, 200). Other element would receive the click: <div id='adPopup'>",
    base64Screenshot
);
System.out.println("Trigger match: " + result); // Should be "YES"

// Test action parsing
ActionIntent intent = SkillRegistry.extractActionWithAI(
    "Click on the close (X) icon"
);
System.out.println("Action type: " + intent.getActionType()); // Should be "click"
System.out.println("Target: " + intent.getTargetElement()); // Should be "close (X) icon"
```

---

## Success Criteria

Test is successful when:

- ✅ Skill executes within 3 seconds
- ✅ Trigger correctly identifies condition
- ✅ Action successfully dismisses interruption
- ✅ Test step retries and passes
- ✅ Logs show complete execution flow
- ✅ MongoDB shows execution record
- ✅ Skill statistics updated

---

## Next Steps After Testing

1. **Create Production Skills** - Define skills for your actual application
2. **Test Coverage** - Create skills for all known interruptions
3. **Monitor Performance** - Track skill execution times in production
4. **Refine Descriptions** - Improve trigger/action descriptions based on results
5. **Expand Framework** - Use learnings to build new skill categories

---

## Support

For issues or questions:
- Check core engine logs for `[SkillRegistry]` entries
- Review MongoDB collections: `skills`, `skillexecutions`
- Consult `SKILL_REGISTRY_MANUAL_TESTING_GUIDE.md` for detailed scenarios
- Reference `SKILL_REGISTRY_README.md` for architecture details

---

**Last Updated:** April 15, 2026
