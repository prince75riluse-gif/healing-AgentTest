# Skill Registry Testing Checklist

**Print this checklist and check off each test as you verify functionality**

---

## Pre-Test Setup

- [ ] Backend server running on port 3000
- [ ] Core engine running (Gradle bootRun)
- [ ] MongoDB running and accessible
- [ ] Test page served on http://localhost:8080
- [ ] Project config has `useSkillRegistry: true`
- [ ] Gemini API key configured in environment

---

## Test 1: Ad Popup Interruption 🎯

### Setup
- [ ] Skill created via API with name "Ad Popup Handler"
- [ ] Trigger condition: "When an unexpected ad popup appears on screen"
- [ ] Action description: "Click on the close (X) icon"
- [ ] Priority: 1, isActive: true

### Execution
- [ ] Navigate to http://localhost:8080
- [ ] Click "Skill Registry Tests" tab
- [ ] Click "Trigger Ad Popup" button
- [ ] Attempt to click "Continue to Next Step" button (id: continueButton2)

### Verification
- [ ] ElementClickInterceptedException occurs
- [ ] Core engine logs show: `[SkillRegistry] Step failed - checking scenario skills`
- [ ] Core engine logs show: `[SkillRegistry] Skill executed: Ad Popup Handler`
- [ ] Popup automatically dismissed
- [ ] Original click succeeds on retry
- [ ] MongoDB skillexecutions collection has new record
- [ ] Test report includes skillExecutionData

**Result:** ⬜ PASS  ⬜ FAIL

**Notes:**
```



```

---

## Test 2: Cookie Consent Banner 🍪

### Setup
- [ ] Skill created: "Cookie Consent Handler"
- [ ] Trigger: "When a cookie consent banner is blocking interactions"
- [ ] Action: "Click on the Accept All button"
- [ ] Priority: 1, isActive: true

### Execution
- [ ] Click "Trigger Cookie Banner" button
- [ ] Attempt to click "Accept Terms" button (id: acceptTermsButton2)

### Verification
- [ ] ElementClickInterceptedException occurs
- [ ] Skill Registry logs appear
- [ ] Banner dismissed automatically
- [ ] Button click succeeds
- [ ] Execution logged in MongoDB

**Result:** ⬜ PASS  ⬜ FAIL

**Notes:**
```



```

---

## Test 3: Newsletter Popup 📧

### Setup
- [ ] Skill created: "Newsletter Popup Handler"
- [ ] Trigger: "When newsletter subscription popup appears"
- [ ] Action: "Click on the No Thanks button"
- [ ] Priority: 1, isActive: true

### Execution
- [ ] Click "Trigger Newsletter Popup" button
- [ ] Attempt to click "Submit Form" button (id: submitFormButton2)

### Verification
- [ ] ElementClickInterceptedException occurs
- [ ] Skill executes successfully
- [ ] Popup dismissed
- [ ] Form submission succeeds
- [ ] Logged in MongoDB

**Result:** ⬜ PASS  ⬜ FAIL

**Notes:**
```



```

---

## Test 4: Scroll to Hidden Element 👁️

### Setup
- [ ] Skill created: "Scroll Into View Handler"
- [ ] Trigger: "When target element is not visible in viewport"
- [ ] Action: "Scroll the target element into center of viewport"
- [ ] Priority: 1, isActive: true

### Execution
- [ ] Target button is 1500px below viewport
- [ ] Attempt to click "Hidden Button (Out of Viewport)" (id: hiddenButton2)

### Verification
- [ ] ElementNotInteractableException occurs
- [ ] Skill scrolls element into view
- [ ] Element becomes visible
- [ ] Click succeeds
- [ ] Execution logged

**Result:** ⬜ PASS  ⬜ FAIL

**Notes:**
```



```

---

## Test 5: Loading Spinner Blocker ⏳

### Setup
- [ ] Skill created: "Loading Spinner Handler"
- [ ] Trigger: "When loading spinner is blocking interactions"
- [ ] Action: "Wait for loading spinner to disappear"
- [ ] Priority: 1, isActive: true

### Execution
- [ ] Click "Trigger Loading Spinner" button
- [ ] Attempt to click "Process Data" button (id: processDataButton2)

### Verification
- [ ] TimeoutException or ElementClickInterceptedException occurs
- [ ] Skill waits for spinner (5 seconds)
- [ ] Spinner disappears
- [ ] Click succeeds
- [ ] Execution logged

**Result:** ⬜ PASS  ⬜ FAIL

**Notes:**
```



```

---

## Test 6: Stale Element After DOM Update 🔄

### Setup
- [ ] Skill created: "Stale Element Recovery"
- [ ] Trigger: "When element reference becomes stale after DOM update"
- [ ] Action: "Wait 2 seconds for DOM to stabilize"
- [ ] Priority: 1, isActive: true

### Execution
- [ ] Click "Cause DOM Re-render" button
- [ ] Attempt to click "Target Button" (id: staleTestButton2)

### Verification
- [ ] StaleElementReferenceException occurs
- [ ] Skill waits for DOM stabilization
- [ ] Element re-located successfully
- [ ] Click succeeds
- [ ] Execution logged

**Result:** ⬜ PASS  ⬜ FAIL

**Notes:**
```



```

---

## Test 7: Multiple Overlapping Popups 🪟

### Setup
- [ ] Skill created: "Generic Popup Handler"
- [ ] Trigger: "When any popup or modal is blocking interactions"
- [ ] Action: "Click close button or dismiss link"
- [ ] Priority: 1, isActive: true

### Execution
- [ ] Click "Trigger Sequential Popups" button
- [ ] Wait for all three popups to appear (Cookie → Newsletter → Promo)
- [ ] Attempt to click "Complete Action" button (id: finalActionButton2)

### Verification
- [ ] Multiple ElementClickInterceptedException occurrences (3x)
- [ ] Skill dismisses cookie banner
- [ ] Skill dismisses newsletter popup
- [ ] Skill dismisses promo popup
- [ ] Final button click succeeds
- [ ] All executions logged

**Result:** ⬜ PASS  ⬜ FAIL

**Notes:**
```



```

---

## Performance Verification

### Timing Benchmarks
- [ ] Skill evaluation: < 3 seconds
- [ ] Skill execution: < 5 seconds
- [ ] Total overhead per skill: < 8 seconds

### MongoDB Statistics
- [ ] All skillexecutions have executionTimeMs field
- [ ] Average execution time calculated
- [ ] Success rate > 90%

**Result:** ⬜ PASS  ⬜ FAIL

---

## System Health Checks

### Core Engine Logs
- [ ] No ERROR level logs related to Skill Registry
- [ ] All [SkillRegistry] logs present and complete
- [ ] No Gemini API timeout errors
- [ ] No element location failures after skill execution

### MongoDB Data Quality
- [ ] All skillexecutions have required fields
- [ ] scenarioId references valid
- [ ] executedAt timestamps accurate
- [ ] success boolean accurate

### Backend Health
- [ ] All API endpoints responding
- [ ] No 500 errors
- [ ] Skills CRUD operations working
- [ ] Authentication working correctly

**Result:** ⬜ PASS  ⬜ FAIL

---

## Edge Cases & Error Handling

### Test: Skill Execution Failure
- [ ] Modify skill to have invalid action (e.g., "Click non-existent button")
- [ ] Run test scenario
- [ ] Verify skill execution fails gracefully
- [ ] Verify fallback to healing agent occurs
- [ ] Verify error logged correctly

**Result:** ⬜ PASS  ⬜ FAIL

### Test: No Skills Match
- [ ] Deactivate all skills for scenario
- [ ] Run test scenario
- [ ] Verify "No skills matched" logged
- [ ] Verify falls back to healing agent
- [ ] Verify test continues without crash

**Result:** ⬜ PASS  ⬜ FAIL

### Test: Gemini API Unavailable
- [ ] Temporarily disable Gemini API key
- [ ] Run test scenario
- [ ] Verify graceful error handling
- [ ] Verify fallback behavior
- [ ] Verify error logged correctly

**Result:** ⬜ PASS  ⬜ FAIL

---

## Final Sign-Off

### Summary

| Test | Status | Execution Time | Notes |
|------|--------|---------------|-------|
| 1. Ad Popup | ⬜ PASS ⬜ FAIL | _____ sec | |
| 2. Cookie Banner | ⬜ PASS ⬜ FAIL | _____ sec | |
| 3. Newsletter | ⬜ PASS ⬜ FAIL | _____ sec | |
| 4. Scroll | ⬜ PASS ⬜ FAIL | _____ sec | |
| 5. Loading | ⬜ PASS ⬜ FAIL | _____ sec | |
| 6. Stale Element | ⬜ PASS ⬜ FAIL | _____ sec | |
| 7. Multiple Popups | ⬜ PASS ⬜ FAIL | _____ sec | |

### Overall Result
- [ ] All 7 tests PASS
- [ ] Performance within limits
- [ ] System health checks PASS
- [ ] Edge cases handled correctly
- [ ] Documentation reviewed and accurate

### Issues Found
```
1.

2.

3.

```

### Recommendations
```
1.

2.

3.

```

---

**Tested By:** _______________________  
**Date:** _______________________  
**Environment:** _______________________  
**Build/Version:** _______________________  

---

**Approved By:** _______________________  
**Date:** _______________________  
