export const NODE_TYPES = {
  START: 'start',
  END: 'end',
  ACTION: 'action',
  DELAY: 'delay',
  CONDITION: 'condition'
} as const;

export const DELAY_UNITS = {
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days'
} as const;

export const CONDITION_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  INCLUDES: 'includes',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with'
} as const;

export const AUTOMATION_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused'
} as const;

export const TEST_RUN_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export const DEFAULT_NODE_POSITIONS = {
  START: { x: 250, y: 50 },
  END: { x: 250, y: 400 },
  NEW_NODE: { x: 250, y: 200 }
} as const;