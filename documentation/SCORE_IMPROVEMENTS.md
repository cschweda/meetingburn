# Meeting Score Improvements - Implementation Summary

## Changes Made

### 1. Added Penalty for Medium-Sized Meetings (8-14 people)

**File**: `app/composables/useMeetingScore.ts`

**Problem**: An 11-person remote "General" meeting was scoring 100 (perfect), even though moderately large meetings should be evaluated for necessity.

**Solution**: Added a -5 point penalty for meetings with 8-14 participants:
- **Why 8-14?** This is the "medium-sized meeting" range where coordination becomes more complex but it's not yet a large gathering
- **Penalty**: -5 points (modest, to encourage intentionality without being punitive)
- **Factor text**: "Medium-sized meeting (consider if all attendees are necessary)"

**Before**: 11-person meeting = 100 score
**After**: 11-person meeting = 95 score

### 2. Added Hours Input to Duration Adjustment

**File**: `app/components/calculator/Receipt.vue`

**Problem**: Duration adjustment only had minutes and seconds inputs, making it cumbersome to adjust longer meetings.

**Solution**: Added hours input field:
```vue
<UInputNumber v-model="adjustHours" ... />
<span>hr</span>
<UInputNumber v-model="adjustMinutes" ... />
<span>min</span>
<UInputNumber v-model="adjustSeconds" ... />
<span>sec</span>
```

**Computation**: `adjustHours.value * 3600 + adjustMinutes.value * 60 + adjustSeconds.value`

### 3. Verified Score Updates with Duration Changes

**Verification**: The score already correctly updates when duration is adjusted because:
1. `displayDurationSeconds` is computed from `adjustedDurationSeconds` or `meeting.duration`
2. `meetingScore` is computed using `displayDurationSeconds`
3. Both are reactive computed properties that update automatically

**Files verified**:
- `app/components/calculator/Receipt.vue` (lines 162-175)
- Score properly recalculates on duration adjustment

## Test Coverage

### New Unit Tests

**File**: `tests/composables/useMeetingScore.test.ts`

Added 3 new test cases:
1. **Medium-sized meeting penalty** - Verifies 11-person meeting gets -5 penalty
2. **Small meeting no penalty** - Verifies ≤7 people don't get penalized
3. **Boundary cases** - Tests 7, 8, 14, and 15 people to verify threshold logic

### New Integration Tests

**File**: `tests/integration/score-duration-adjustment.test.ts`

Created comprehensive integration tests covering:
1. **Duration adjustment** - Verifies score updates from 35 minutes to 2 hours
2. **Long async meetings** - Confirms penalty for >1 hour status updates
3. **Hours/minutes/seconds** - Tests complex duration calculations
4. **User's exact scenario** - 11-person, 35-minute remote General meeting
5. **Multiple hours** - Tests 5 hours 45 minutes 30 seconds correctly
6. **Remote vs in-person cost** - Verifies remote meetings aren't penalized for high hourly rates

**Test Results**: 103 tests, all passing ✅

## Scoring Logic Summary

### Participant Count Penalties

| Participants | Penalty | Condition | Factor Text |
|-------------|---------|-----------|-------------|
| ≤7 | 0 | - | - |
| 8-14 | -5 | Always | Medium-sized meeting |
| 15+ | -12 | Async-friendly type | Large audience for simple meeting |
| 25+ | -8 | Always | Large meeting |
| 50+ | -8 | Always | Very large meeting |
| 50+ (in-person) | -10 | In-person | Large in-person gathering |

### Remote vs In-Person Cost Logic

**Remote meetings**:
- Cost per attendee-hour is **NOT** penalized
- Only participant count, duration, and meeting type are considered
- Rationale: The "cost" is just time/salary, which is expected

**In-person meetings**:
- Cost per attendee-hour **IS** penalized if >$100 or >$150/hour
- Additional penalties for in-person tax/extras
- Long duration penalties (>4 hours, >6 hours)
- Rationale: These represent actual expenses beyond salary

## Duration Adjustment UI

**Before**:
```
[_____] min  [__] sec  [Apply] [Cancel]
```

**After**:
```
[__] hr  [__] min  [__] sec  [Apply] [Cancel]
```

## Example: User's 11-Person Meeting

**Meeting Details**:
- Remote, 11 people, 35 minutes
- General meeting type
- $968 total cost

**Old Score**: 100 (perfect)
**New Score**: 95 (good, but with note)

**Factors**:
- "Medium-sized meeting (consider if all attendees are necessary)"

**Explanation**: The meeting is generally efficient (remote, reasonable duration), but 11 people is enough to warrant asking "do we need everyone here?"

## Verification

All changes have been:
1. ✅ Implemented in source code
2. ✅ Unit tested (11 tests in useMeetingScore.test.ts)
3. ✅ Integration tested (6 tests in score-duration-adjustment.test.ts)
4. ✅ Verified to work with duration adjustment
5. ✅ Hot-reloaded in dev server

**Total test count**: 103 tests passing
