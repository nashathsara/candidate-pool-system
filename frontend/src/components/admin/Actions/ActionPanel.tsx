import React, { useState, useEffect } from 'react';
import { createAutomationRule, getAutomationRules, deleteAutomationRule } from '../../../services/automationService';
import type { AutomationRule } from '../../../utils/automationTypes';
import './ActionPanel.css';

interface ActionPanelProps {
  userId: string;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ userId }) => {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: 'candidate_added',
    actionType: 'send_email',
    enabled: true,
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      setLoading(true);
      const rules = await getAutomationRules();
      setAutomationRules(rules);
    } catch (error) {
      console.error('Failed to load automation rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async () => {
    if (!formData.name.trim()) return;

    try {
      await createAutomationRule({
        name: formData.name,
        description: formData.description,
        enabled: formData.enabled,
        createdBy: userId,
        trigger: {
          type: formData.triggerType as any,
          parameters: {},
        },
        actions: [
          {
            type: formData.actionType as any,
            parameters: {},
          },
        ],
        conditions: [],
      });
      setFormData({
        name: '',
        description: '',
        triggerType: 'candidate_added',
        actionType: 'send_email',
        enabled: true,
      });
      setShowForm(false);
      loadRules();
    } catch (error) {
      console.error('Failed to create rule:', error);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;

    try {
      await deleteAutomationRule(ruleId);
      loadRules();
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  if (loading) {
    return <div className="action-panel-loading">Loading automation rules...</div>;
  }

  return (
    <div className="action-panel">
      <div className="action-panel-header">
        <h2>Automation Rules</h2>
        <button
          className="btn-new-rule"
          onClick={() => setShowForm(!showForm)}
        >
          + New Rule
        </button>
      </div>

      {showForm && (
        <div className="rule-form">
          <div className="form-group">
            <label>Rule Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Email new candidates"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe what this rule does"
              rows={2}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Trigger</label>
              <select
                value={formData.triggerType}
                onChange={(e) =>
                  setFormData({ ...formData, triggerType: e.target.value })
                }
              >
                <option value="candidate_added">Candidate Added</option>
                <option value="status_change">Status Changed</option>
                <option value="rating_threshold">Rating Threshold</option>
                <option value="interview_completed">Interview Completed</option>
                <option value="no_activity">No Activity</option>
              </select>
            </div>

            <div className="form-group">
              <label>Action</label>
              <select
                value={formData.actionType}
                onChange={(e) =>
                  setFormData({ ...formData, actionType: e.target.value })
                }
              >
                <option value="send_email">Send Email</option>
                <option value="assign_to_team">Assign to Team</option>
                <option value="update_status">Update Status</option>
                <option value="schedule_interview">Schedule Interview</option>
                <option value="create_reminder">Create Reminder</option>
              </select>
            </div>
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) =>
                  setFormData({ ...formData, enabled: e.target.checked })
                }
              />
              Enable this rule
            </label>
          </div>

          <div className="form-actions">
            <button className="btn-save" onClick={handleCreateRule}>
              Create Rule
            </button>
            <button
              className="btn-cancel"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="rules-list">
        <h3>Active Rules ({automationRules.filter((r) => r.enabled).length})</h3>
        {automationRules.filter((r) => r.enabled).length === 0 ? (
          <p className="no-rules">No active rules. Create one to get started!</p>
        ) : (
          automationRules
            .filter((r) => r.enabled)
            .map((rule) => (
              <div key={rule.id} className="rule-card">
                <div className="rule-header">
                  <h4>{rule.name}</h4>
                  <button
                    className="btn-delete-rule"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    ✕
                  </button>
                </div>
                <p className="rule-description">{rule.description}</p>
                <div className="rule-details">
                  <span className="rule-trigger">
                    Trigger: {rule.trigger.type.replace(/_/g, ' ')}
                  </span>
                  <span className="rule-action">
                    Action: {rule.actions[0]?.type.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))
        )}
      </div>

      <div className="inactive-rules-list">
        <h3>Inactive Rules ({automationRules.filter((r) => !r.enabled).length})</h3>
        {automationRules.filter((r) => !r.enabled).length === 0 ? (
          <p className="no-rules">No inactive rules.</p>
        ) : (
          automationRules
            .filter((r) => !r.enabled)
            .map((rule) => (
              <div key={rule.id} className="rule-card inactive">
                <div className="rule-header">
                  <h4>{rule.name}</h4>
                  <button
                    className="btn-delete-rule"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    ✕
                  </button>
                </div>
                <p className="rule-description">{rule.description}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ActionPanel;
