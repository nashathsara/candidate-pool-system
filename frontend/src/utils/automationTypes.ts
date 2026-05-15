// Automation & Actions Types
export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdBy: string;
  createdDate: Date;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  conditions: AutomationCondition[];
}

export interface AutomationTrigger {
  type: 'candidate_added' | 'status_change' | 'rating_threshold' | 'interview_completed' | 'no_activity';
  parameters?: Record<string, any>;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
  value: any;
}

export interface AutomationAction {
  type: 'send_email' | 'assign_to_team' | 'update_status' | 'schedule_interview' | 'create_reminder';
  parameters: Record<string, any>;
}

export interface NotificationAction {
  id: string;
  candidateId: string;
  type: 'email' | 'in_app' | 'reminder';
  title: string;
  message: string;
  recipient: string;
  status: 'pending' | 'sent' | 'failed';
  createdDate: Date;
  sentDate?: Date;
  failureReason?: string;
}

export interface AutoShortlistRule {
  id: string;
  name: string;
  skillsRequired: string[];
  minExperience: number;
  maxSalaryExpectation: number;
  minMatchPercentage: number;
  enabled: boolean;
}
