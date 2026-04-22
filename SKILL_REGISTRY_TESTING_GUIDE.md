# Skill Registry Testing Guide

**Complete guide for testing the Skill Registry feature using the Healing Agent Test Page**

---

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Test Scenarios](#test-scenarios)
5. [Verification Steps](#verification-steps)
6. [Troubleshooting](#troubleshooting)
7. [Expected Results](#expected-results)

---

## Overview

The Healing Agent Test Page provides a comprehensive UI for testing the **Skill Registry** feature, which enables AI-powered automatic recovery from test execution failures caused by UI interruptions like popups, overlays, and dynamic content changes.

### What is Skill Registry?

The Skill Registry is a framework that:
- Detects when test steps fail due to UI interruptions (popups, banners, overlays)
- Automatically executes user-defined "skills" to handle the interruption
- Retries the failed step after the skill succeeds
- Logs all skill execution details for debugging and reporting

### Test Page URL
```
http://localhost:8080
```
Or open the `index.html` file directly in a browser for manual testing.

---

## Prerequisites

### 1. Backend Setup
Ensure the Automator backend is running:
```bash
cd /Users/prince75.kumar/automator/automator-backend
npm start
```

### 2. Core Engine Setup
Ensure the core engine is running:
```bash
cd /Users/prince75.kumar/automator/automator-core-engine
./gradlew clean bootRun
```

### 3. MongoDB
MongoDB must be running with the following collections:
- `skills` - Stores skill definitions
- `skillexecutions` - Stores skill execution logs

### 4. Test Page
Serve the test page locally:
```bash
cd /Users/prince75.kumar/automator/healing-agent-test-page
python3 -m http.server 8080
```
Or use any other local server.

---

## Setup Instructions

### Step 1: Enable Skill Registry in Project Config

Update your project configuration to enable the Skill Registry:

**API Endpoint:** `PUT /api/v2/project/:organizationId/:projectId`

**Request Body:**
```json
{
  "useSkillRegistry": true
}
```

**Example with cURL:**
```bash
curl -X PUT http://localhost:3000/api/v2/project/org_123/proj_456 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"useSkillRegistry": true}'
```

### Step 2: Create Skills for Your Scenario

For each test scenario, create skills using the Backend API.

**API Endpoint:** `POST /api/v2/testscenario/:organizationId/:projectId/:scenarioId/skills`

**Request Body:**
```json
{
  "name": "Ad Popup Handler",
  "description": "Handles unexpected ad popups during test execution",
  "triggerCondition": "When an unexpected ad popup appears on screen",
  "actionDescription": "Click on the close (X) icon",
  "priority": 1,
  "isActive": true
}
```

### Step 3: Create Test Scenario in Automator

Create a test scenario with steps that will interact with the test page elements.

---

## Test Scenarios

The test page provides **7 comprehensive test scenarios** to validate Skill Registry functionality.

### Test 1: Ad Popup Interruption 🎯

**Scenario:** An ad popup blocks a button click interaction.

**Setup:**
1. Navigate to Skills Registry Tests tab
2. Create skill via API:
```json
{
  "name": "Ad Popup Handler",
  "triggerCondition": "When an unexpected ad popup appears on screen",
  "actionDescription": "Click on the close (X) icon",
  "priority": 1
}
```

**Test Steps:**
1. Navigate to `http://localhost:8080`
2. Click on "Skill Registry Tests" tab
3. Click "Trigger Ad Popup" button
4. Attempt to click "Continue to Next Step" button
5. **Expected:** ElementClickInterceptedException occurs
6. **Expected:** Skill Registry detects popup and clicks close button
7. **Expected:** Original click succeeds on retry

**Target Element:** `id="continueButton2"`

**Verification:**
- Check logs for: `[SkillRegistry] Step failed - checking scenario skills`
- Check logs for: `[SkillRegistry] Skill executed: Ad Popup Handler`
- Check MongoDB `skillexecutions` collection for new record

---

### Test 2: Cookie Consent Banner 🍪

**Scenario:** Cookie banner blocks button interaction at bottom of page.

**Setup:**
```json
{
  "name": "Cookie Consent Handler",
  "triggerCondition": "When a cookie consent banner is blocking interactions",
  "actionDescription": "Click on the Accept All button",
  "priority": 1
}
```

**Test Steps:**
1. Click "Trigger Cookie Banner" button
2. Attempt to click "Accept Terms" button
3. **Expected:** ElementClickInterceptedException
4. **Expected:** Skill clicks "Accept All" on banner
5. **Expected:** Original click succeeds

**Target Element:** `id="acceptTermsButton2"`

**Exception:** `ElementClickInterceptedException`

---

### Test 3: Newsletter Popup 📧

**Scenario:** Newsletter subscription popup blocks form submission.

**Setup:**
```json
{
  "name": "Newsletter Popup Handler",
  "triggerCondition": "When newsletter subscription popup appears",
  "actionDescription": "Click on the No Thanks button",
  "priority": 1
}
```

**Test Steps:**
1. Click "Trigger Newsletter Popup"
2. Attempt to click "Submit Form" button
3. **Expected:** Popup dismissed by skill
4. **Expected:** Form submission succeeds

**Target Element:** `id="submitFormButton2"`

---

### Test 4: Element Not Visible (Scroll) 👁️

**Scenario:** Target element is outside viewport, causing interaction failure.

**Setup:**
```json
{
  "name": "Scroll Into View Handler",
  "triggerCondition": "When target element is not visible in viewport",
  "actionDescription": "Scroll the target element into center of viewport",
  "priority": 1
}
```

**Test Steps:**
1. Target button is 1500px below viewport
2. Attempt to click "Hidden Button (Out of Viewport)"
3. **Expected:** ElementNotInteractableException
4. **Expected:** Skill scrolls element into view
5. **Expected:** Click succeeds

**Target Element:** `id="hiddenButton2"` (1500px below fold)

---

### Test 5: Loading Spinner Blocker ⏳

**Scenario:** Loading spinner overlay blocks interactions.

**Setup:**
```json
{
  "name": "Loading Spinner Handler",
  "triggerCondition": "When loading spinner is blocking interactions",
  "actionDescription": "Wait for loading spinner to disappear",
  "priority": 1
}
```

**Test Steps:**
1. Click "Trigger Loading Spinner"
2. Attempt to click "Process Data" button
3. **Expected:** TimeoutException or ElementClickInterceptedException
4. **Expected:** Skill waits for spinner to disappear (5 seconds)
5. **Expected:** Click succeeds

**Target Element:** `id="processDataButton2"`

---

### Test 6: Stale Element After DOM Update 🔄

**Scenario:** Element reference becomes stale after React/Vue-style re-render.

**Setup:**
```json
{
  "name": "Stale Element Recovery",
  "triggerCondition": "When element reference becomes stale after DOM update",
  "actionDescription": "Wait 2 seconds for DOM to stabilize",
  "priority": 1
}
```

**Test Steps:**
1. Click "Cause DOM Re-render" button
2. Attempt to click "Target Button"
3. **Expected:** StaleElementReferenceException
4. **Expected:** Skill waits for DOM stabilization
5. **Expected:** Element re-located and clicked successfully

**Target Element:** `id="staleTestButton2"`

---

### Test 7: Multiple Overlapping Popups 🪟

**Scenario:** Three sequential popups appear (Cookie → Newsletter → Promo).

**Setup:**
```json
{
  "name": "Generic Popup Handler",
  "triggerCondition": "When any popup or modal is blocking interactions",
  "actionDescription": "Click close button or dismiss link",
  "priority": 1
}
```

**Test Steps:**
1. Click "Trigger Sequential Popups"
2. Observe cookie banner, newsletter popup, and promo popup appear
3. Attempt to click "Complete Action" button
4. **Expected:** Multiple ElementClickInterceptedException occurrences
5. **Expected:** Skill dismisses all popups sequentially
6. **Expected:** Final action succeeds

**Target Element:** `id="finalActionButton2"`

---

## Verification Steps

### 1. Core Engine Logs

Check the core engine terminal for Skill Registry logs:

```
[SkillRegistry] Step failed - checking scenario skills
[SkillRegistry] Found 3 skills for scenario: testScenario_abc123
[SkillRegistry] Evaluating skill: Ad Popup Handler
[SkillRegistry] Gemini trigger match: YES (confidence: 0.95)
[SkillRegistry] Executing skill action: Click on the close (X) icon
[SkillRegistry] Skill executed successfully: Ad Popup Handler
```

### 2. MongoDB Verification

Check the `skillexecutions` collection:

```javascript
db.skillexecutions.find({}).sort({executedAt: -1}).limit(5).pretty()
```

**Expected Document:**
```json
{
  "_id": "skillExec_xyz",
  "skillId": "skill_abc123",
  "skillName": "Ad Popup Handler",
  "scenarioId": "testScenario_xyz",
  "executionId": "exec_789",
  "stepId": "step_456",
  "success": true,
  "triggerCondition": "When an unexpected ad popup appears on screen",
  "actionDescription": "Click on the close (X) icon",
  "exceptionType": "ElementClickInterceptedException",
  "exceptionMessage": "element click intercepted: ...",
  "executedAt": "2026-04-16T14:30:00.000Z",
  "executionTimeMs": 2341
}
```

### 3. Backend Debug Logs

Check `/Users/prince75.kumar/automator/automator-backend/.cursor/debug-9d7efc.log` (if debug mode active):

```json
{"sessionId":"9d7efc","location":"SeleniumScriptGenerator.java:945","message":"Entering skill registry block","data":{"scenarioId":"testScenario_abc"},"timestamp":1713277800000}
{"sessionId":"9d7efc","location":"SeleniumScriptGenerator.java:960","message":"Skill execution result","data":{"resultNull":false,"success":true},"timestamp":1713277802341}
```

### 4. Test Execution Report

Check the test scenario reference document in MongoDB:

```javascript
db.testscenariosreferences.findOne(
  {"_id": "exec_789"},
  {"elements.iterations.skillExecutionData": 1}
)
```

**Expected:**
```json
{
  "elements": {
    "iterations": [
      {
        "skillExecutionData": {
          "skillExecuted": true,
          "skillName": "Ad Popup Handler",
          "skillId": "skill_abc123",
          "executionTimeMs": 2341,
          "retrySuccessful": true
        }
      }
    ]
  }
}
```

---

## Troubleshooting

### Issue 1: Skill Registry Not Triggering

**Symptoms:**
- Test fails with exception
- No `[SkillRegistry]` logs appear
- Skill not executed

**Solutions:**
1. Verify `useSkillRegistry: true` in project config:
   ```bash
   db.projects.findOne({_id: "proj_123"}, {useSkillRegistry: 1})
   ```

2. Check skill exists for scenario:
   ```bash
   db.skills.find({scenarioId: "testScenario_abc", isActive: true})
   ```

3. Verify core engine flag propagation:
   - Check `SeleniumScriptGenerator.java:945` logs
   - Ensure `useSkillRegistry` is true in execution data

### Issue 2: Gemini API Not Responding

**Symptoms:**
- Long execution times
- Trigger matching always returns "NO"
- API timeout errors

**Solutions:**
1. Check Gemini API key in environment:
   ```bash
   echo $GEMINI_API_KEY
   ```

2. Verify network connectivity:
   ```bash
   curl https://generativelanguage.googleapis.com/v1/models
   ```

3. Check API quota limits in Google Cloud Console

### Issue 3: Element Not Found After Skill Execution

**Symptoms:**
- Skill executes successfully
- Original step still fails with NoSuchElementException

**Solutions:**
1. Increase wait time in skill action:
   ```json
   "actionDescription": "Click close button and wait 2 seconds for DOM to stabilize"
   ```

2. Verify element locator is correct after DOM manipulation

3. Add explicit wait in test scenario step

### Issue 4: JavaScript Alerts Not Handled

**Symptoms:**
- `UnhandledAlertException` occurs
- Test execution blocked

**Note:** JavaScript alerts (`alert()`, `confirm()`, `prompt()`) are now handled gracefully by the WebDriver configuration. They should NOT trigger Skill Registry because they are native browser dialogs, not DOM elements.

**Expected Behavior:**
- JavaScript alerts are automatically accepted
- No exception thrown
- No skill execution needed

**To Test DOM Popups:**
- Use the "Trigger Ad Popup" button which creates an actual DOM overlay
- This WILL trigger Skill Registry with `ElementClickInterceptedException`

---

## Expected Results

### Success Indicators

✅ **All tests pass with skill execution:**
- 7 test scenarios complete successfully
- Each scenario shows skill execution logs
- MongoDB contains skill execution records
- Test reports include `skillExecutionData`

✅ **Performance benchmarks:**
- Skill evaluation: < 3 seconds
- Skill execution: < 5 seconds
- Total overhead: < 8 seconds per skill

✅ **Logs show proper flow:**
```
1. Step execution attempt
2. Exception caught
3. Skill registry triggered
4. Skills evaluated
5. Best skill selected
6. Skill executed
7. Step retried
8. Success
```

### Failure Indicators

❌ **Skill Registry Not Active:**
- No `[SkillRegistry]` logs
- Exceptions not caught
- Test fails immediately

❌ **Skill Execution Fails:**
- Skill selected but action fails
- Original step not retried
- Error logged in skillexecutions

❌ **No Skills Match:**
- All skills evaluated
- Gemini returns "NO" for all triggers
- Falls back to healing agent

---

## Advanced Testing

### Test Priority System

Create multiple skills with different priorities:

```json
// High priority - specific popup
{
  "name": "Ad Popup Handler",
  "triggerCondition": "When an ad popup with close button appears",
  "priority": 1
}

// Medium priority - generic popup
{
  "name": "Generic Popup Handler",
  "triggerCondition": "When any popup blocks interaction",
  "priority": 5
}

// Low priority - fallback
{
  "name": "Scroll and Retry",
  "triggerCondition": "When element interaction fails",
  "priority": 10
}
```

**Expected:** Skill Registry evaluates skills in priority order (1 = highest).

### Test Skill Statistics

After multiple executions, verify statistics:

```javascript
db.skills.findOne(
  {_id: "skill_abc123"},
  {executionStats: 1}
)
```

**Expected:**
```json
{
  "executionStats": {
    "totalExecutions": 15,
    "successfulExecutions": 14,
    "failedExecutions": 1,
    "averageExecutionTimeMs": 2341,
    "lastExecutedAt": "2026-04-16T14:30:00.000Z"
  }
}
```

### Test Inactive Skills

1. Deactivate a skill:
   ```bash
   curl -X PATCH http://localhost:3000/api/v2/testscenario/org/proj/scenario/skills/skill_abc \
     -d '{"isActive": false}'
   ```

2. Run test scenario
3. **Expected:** Deactivated skill is NOT evaluated

---

## Summary Checklist

Before considering Skill Registry feature complete:

- [ ] All 7 test scenarios pass successfully
- [ ] Skill execution logged in core engine
- [ ] MongoDB `skillexecutions` collection populated
- [ ] Test reports include `skillExecutionData`
- [ ] Gemini API integration working
- [ ] AI element finder locates popup elements
- [ ] Skills execute actions correctly
- [ ] Original steps retry and succeed
- [ ] Performance within acceptable limits
- [ ] Error handling works for failed skills
- [ ] Fallback to healing agent functional
- [ ] Documentation complete and accurate

---

## Additional Resources

- **Architecture:** See `/Users/prince75.kumar/automator/automator-core-engine/SKILL_REGISTRY_README.md`
- **API Documentation:** See `/Users/prince75.kumar/automator/automator-backend/src/routes/v2/skill.route.js`
- **Test Integration:** See `/Users/prince75.kumar/automator/automator-core-engine/SKILL_REGISTRY_TESTING_GUIDE.md`
- **MongoDB Schema:** See skill models in backend and core engine

---

## Contact & Support

For issues or questions:
- Check core engine logs first
- Verify MongoDB records
- Review Gemini API responses
- Consult the main SKILL_REGISTRY_README.md

**Last Updated:** April 16, 2026
