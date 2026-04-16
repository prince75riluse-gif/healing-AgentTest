# Quick Start: Skill Registry Testing

**5-Minute Quick Start Guide for Testing Skill Registry**

---

## Setup (One-Time)

```bash
# 1. Start Backend
cd /Users/prince75.kumar/automator/automator-backend
npm start

# 2. Start Core Engine
cd /Users/prince75.kumar/automator/automator-core-engine
./gradlew clean bootRun

# 3. Serve Test Page
cd /Users/prince75.kumar/automator/healing-agent-test-page
python3 -m http.server 8080
```

## Enable Skill Registry

```bash
curl -X PUT http://localhost:3000/api/v2/project/ORG_ID/PROJ_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"useSkillRegistry": true}'
```

## Create a Test Skill

```bash
curl -X POST http://localhost:3000/api/v2/testscenario/ORG_ID/PROJ_ID/SCENARIO_ID/skills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Ad Popup Handler",
    "description": "Handles ad popups",
    "triggerCondition": "When an unexpected ad popup appears on screen",
    "actionDescription": "Click on the close (X) icon",
    "priority": 1,
    "isActive": true
  }'
```

## Test It!

### Option 1: Automated Test (via Automator)

Create a test scenario with these steps:
1. Navigate to `http://localhost:8080`
2. Click button with text: "Skill Registry Tests"
3. Click button with text: "Trigger Ad Popup"
4. Wait 1 second
5. Click button with id: `continueButton2`

**Expected:** Test passes with skill execution logs

### Option 2: Manual Verification

1. Open test page: `http://localhost:8080`
2. Click "Skill Registry Tests" tab
3. Click "Trigger Ad Popup" button
4. Popup appears over page
5. Try to click "Continue to Next Step" button
6. **In automated test:** Skill Registry detects, executes skill, retry succeeds

---

## Verify Success

### Check Logs
```bash
# Core Engine Terminal - Look for:
[SkillRegistry] Step failed - checking scenario skills
[SkillRegistry] Skill executed: Ad Popup Handler
```

### Check MongoDB
```javascript
// Verify skill execution recorded
db.skillexecutions.find({}).sort({executedAt: -1}).limit(1).pretty()

// Should show:
{
  "skillName": "Ad Popup Handler",
  "success": true,
  "executionTimeMs": 2341
}
```

---

## Quick Test Matrix

| Test | Trigger Button | Target Element | Expected Exception |
|------|---------------|----------------|-------------------|
| 1. Ad Popup | Trigger Ad Popup | continueButton2 | ElementClickInterceptedException |
| 2. Cookie Banner | Trigger Cookie Banner | acceptTermsButton2 | ElementClickInterceptedException |
| 3. Newsletter | Trigger Newsletter Popup | submitFormButton2 | ElementClickInterceptedException |
| 4. Scroll | (element below fold) | hiddenButton2 | ElementNotInteractableException |
| 5. Loading | Trigger Loading Spinner | processDataButton2 | TimeoutException |
| 6. Stale | Cause DOM Re-render | staleTestButton2 | StaleElementReferenceException |
| 7. Multiple | Trigger Sequential Popups | finalActionButton2 | ElementClickInterceptedException (x3) |

---

## Troubleshooting One-Liners

```bash
# Check if Skill Registry enabled
db.projects.findOne({_id: "PROJ_ID"}, {useSkillRegistry: 1})

# List all skills for scenario
db.skills.find({scenarioId: "SCENARIO_ID", isActive: true})

# Check recent skill executions
db.skillexecutions.find({}).sort({executedAt: -1}).limit(5)

# Verify Gemini API
echo $GEMINI_API_KEY
```

---

## Expected Execution Flow

```
1. Test clicks button → Ad popup blocks click
2. ElementClickInterceptedException thrown
3. Skill Registry checks scenario skills (3 found)
4. Gemini evaluates: "Ad Popup Handler" → MATCH
5. AI Element Finder locates close button (X)
6. Skill executes: Click close button
7. Popup dismissed
8. Original step retried
9. ✅ Click succeeds
10. Test continues
```

---

## Success Criteria

✅ Test passes without manual intervention  
✅ Logs show `[SkillRegistry]` entries  
✅ MongoDB has `skillexecutions` record  
✅ Test report includes `skillExecutionData`  
✅ Execution time < 10 seconds total  

---

For detailed guide, see: `SKILL_REGISTRY_TESTING_GUIDE.md`
