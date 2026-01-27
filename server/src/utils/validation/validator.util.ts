export const validateAutomationName = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Automation name is required' };
  }
  if (name.length > 100) {
    return { valid: false, error: 'Automation name must be less than 100 characters' };
  }
  return { valid: true };
};

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true };
};

export const validateFlow = (nodes: any[], edges: any[]): { valid: boolean; error?: string } => {
  // Check for start and end nodes
  const hasStart = nodes.some(n => n.id === 'start');
  const hasEnd = nodes.some(n => n.id === 'end');
  
  if (!hasStart || !hasEnd) {
    return { valid: false, error: 'Flow must have START and END nodes' };
  }

  // Check that all action nodes have messages
  const actionNodes = nodes.filter(n => n.type === 'action');
  for (const node of actionNodes) {
    if (!node.data.message || node.data.message.trim().length === 0) {
      return { valid: false, error: 'All action nodes must have a message' };
    }
  }

  // Check that all delay nodes have valid settings
  const delayNodes = nodes.filter(n => n.type === 'delay');
  for (const node of delayNodes) {
    if (node.data.delayType === 'specific') {
      if (!node.data.specificDateTime) {
        return { valid: false, error: 'Delay nodes with specific time must have a date/time set' };
      }
    } else {
      if (!node.data.duration || node.data.duration < 1) {
        return { valid: false, error: 'Delay nodes must have a duration of at least 1' };
      }
    }
  }

  // Check that all condition nodes have rules
  const conditionNodes = nodes.filter(n => n.type === 'condition');
  for (const node of conditionNodes) {
    if (!node.data.rules || node.data.rules.length === 0) {
      return { valid: false, error: 'Condition nodes must have at least one rule' };
    }
    for (const rule of node.data.rules) {
      if (!rule.value || rule.value.trim().length === 0) {
        return { valid: false, error: 'All condition rules must have a value' };
      }
    }
  }

  return { valid: true };
};