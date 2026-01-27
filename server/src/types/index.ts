export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeData {
  message?: string;
  delayType?: 'relative' | 'specific';
  duration?: number;
  unit?: 'minutes' | 'hours' | 'days';
  specificDateTime?: string;
  rules?: ConditionRule[];
}

export interface Node {
  id: string;
  type: 'start' | 'end' | 'action' | 'delay' | 'condition';
  position: NodePosition;
  data: NodeData;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Automation {
  _id?: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  status?: 'draft' | 'active' | 'paused';
  createdAt?: string;
  updatedAt?: string;
}

export interface ConditionRule {
  field: 'email';
  operator: 'equals' | 'not_equals' | 'includes' | 'starts_with' | 'ends_with';
  value: string;
  joinType?: 'AND' | 'OR';
}

export interface TestRunLog {
  timestamp: Date;
  step: string;
  action: string;
  message: string;
}

export interface TestRun {
  _id?: string;
  automationId: string;
  email: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  currentStep?: string;
  startedAt?: Date;
  completedAt?: Date;
  logs: TestRunLog[];
  error?: string;
  createdAt?: string;
  updatedAt?: string;
}
