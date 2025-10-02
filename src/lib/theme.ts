// Healthcare theme configuration
export const healthcareTheme = {
  colors: {
    // Urgency levels
    urgency: {
      low: 'oklch(var(--urgency-low))',
      medium: 'oklch(var(--urgency-medium))',
      high: 'oklch(var(--urgency-high))',
      emergency: 'oklch(var(--urgency-emergency))',
    },
    // Status colors
    status: {
      success: 'oklch(var(--success))',
      warning: 'oklch(var(--warning))',
      info: 'oklch(var(--info))',
      error: 'oklch(var(--destructive))',
    },
  },
  // Urgency level mappings
  urgencyLevels: {
    low: {
      label: 'Low Priority',
      color: 'urgency-low',
      bgColor: 'bg-urgency-low',
      description: 'Non-urgent medical concern',
    },
    medium: {
      label: 'Medium Priority',
      color: 'urgency-medium',
      bgColor: 'bg-urgency-medium',
      description: 'Moderate medical concern',
    },
    high: {
      label: 'High Priority',
      color: 'urgency-high',
      bgColor: 'bg-urgency-high',
      description: 'Urgent medical attention needed',
    },
    emergency: {
      label: 'Emergency',
      color: 'urgency-emergency',
      bgColor: 'bg-urgency-emergency',
      description: 'Immediate medical attention required',
    },
  },
} as const;

// Type definitions for urgency levels
export type UrgencyLevel = keyof typeof healthcareTheme.urgencyLevels;

// Helper functions
export const getUrgencyConfig = (level: UrgencyLevel) => {
  return healthcareTheme.urgencyLevels[level];
};

export const getUrgencyColor = (level: UrgencyLevel) => {
  return healthcareTheme.urgencyLevels[level].color;
};

export const getUrgencyBgColor = (level: UrgencyLevel) => {
  return healthcareTheme.urgencyLevels[level].bgColor;
};

// Demo mode styling
export const demoModeStyles = {
  indicator: 'demo-indicator',
  border: 'border-info border-2 border-dashed',
  background: 'bg-info/10',
} as const;