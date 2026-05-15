import React, { useState, useEffect } from 'react';
import {
  getAutoShortlistRules,
  createAutoShortlistRule,
  updateAutoShortlistRule,
} from '../../../services/automationService';
import type { AutoShortlistRule } from '../../../utils/automationTypes';
import './AutomationEngine.css';

interface AutoShortlistManagerProps {
  userId: string;
}

const AutoShortlistManager: React.FC<AutoShortlistManagerProps> = ({ userId }) => {
  void userId;
  const [rules, setRules] = useState<AutoShortlistRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skillsRequired: '' as string | string[],
    minExperience: 0,
    maxSalaryExpectation: 0,
    minMatchPercentage: 70,
    enabled: true,
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      setLoading(true);
      const fetchedRules = await getAutoShortlistRules();
      setRules(fetchedRules);
    } catch (error) {
      console.error('Failed to load auto-shortlist rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async () => {
    if (!formData.name.trim()) return;

    try {
      const skillsArray = Array.isArray(formData.skillsRequired)
        ? formData.skillsRequired
        : formData.skillsRequired
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s);

      await createAutoShortlistRule({
        name: formData.name,
        skillsRequired: skillsArray,
        minExperience: formData.minExperience,
        maxSalaryExpectation: formData.maxSalaryExpectation,
        minMatchPercentage: formData.minMatchPercentage,
        enabled: formData.enabled,
      });

      setFormData({
        name: '',
        skillsRequired: '',
        minExperience: 0,
        maxSalaryExpectation: 0,
        minMatchPercentage: 70,
        enabled: true,
      });
      setShowForm(false);
      loadRules();
    } catch (error) {
      console.error('Failed to create rule:', error);
    }
  };

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      await updateAutoShortlistRule(ruleId, { enabled: !enabled });
      loadRules();
    } catch (error) {
      console.error('Failed to toggle rule:', error);
    }
  };

  if (loading) {
    return <div className="autoshortlist-loading">Loading auto-shortlist rules...</div>;
  }

  return (
    <div className="autoshortlist-manager">
      <div className="autoshortlist-header">
        <h2>Auto-Shortlist Rules</h2>
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
              placeholder="e.g., Senior Developer Requirements"
            />
          </div>

          <div className="form-group">
            <label>Required Skills (comma-separated) *</label>
            <input
              type="text"
              value={
                Array.isArray(formData.skillsRequired)
                  ? formData.skillsRequired.join(', ')
                  : formData.skillsRequired
              }
              onChange={(e) =>
                setFormData({ ...formData, skillsRequired: e.target.value })
              }
              placeholder="e.g., React, TypeScript, Node.js"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Minimum Experience (years)</label>
              <input
                type="number"
                value={formData.minExperience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minExperience: parseInt(e.target.value),
                  })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Max Salary Expectation ($)</label>
              <input
                type="number"
                value={formData.maxSalaryExpectation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxSalaryExpectation: parseInt(e.target.value),
                  })
                }
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Min Match Percentage (%)</label>
              <input
                type="number"
                value={formData.minMatchPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minMatchPercentage: parseInt(e.target.value),
                  })
                }
                min="0"
                max="100"
              />
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

      <div className="rules-grid">
        {rules.length === 0 ? (
          <p className="no-rules">No auto-shortlist rules. Create one to get started!</p>
        ) : (
          rules.map((rule) => (
            <div
              key={rule.id}
              className={`rule-card ${rule.enabled ? 'active' : 'inactive'}`}
            >
              <div className="rule-card-header">
                <h4>{rule.name}</h4>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() =>
                      handleToggleRule(rule.id, rule.enabled)
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="rule-criteria">
                {rule.skillsRequired.length > 0 && (
                  <div className="criteria-item">
                    <strong>📋 Skills:</strong>
                    <div className="skills-list">
                      {rule.skillsRequired.map((skill, idx) => (
                        <span key={idx} className="skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {rule.minExperience > 0 && (
                  <div className="criteria-item">
                    <strong>📈 Min Experience:</strong> {rule.minExperience} years
                  </div>
                )}

                {rule.maxSalaryExpectation > 0 && (
                  <div className="criteria-item">
                    <strong>💰 Max Salary:</strong> ${rule.maxSalaryExpectation}
                  </div>
                )}

                <div className="criteria-item">
                  <strong>✅ Min Match:</strong> {rule.minMatchPercentage}%
                </div>
              </div>

              <div className="rule-status">
                {rule.enabled ? (
                  <span className="status-active">🟢 Active</span>
                ) : (
                  <span className="status-inactive">⚪ Inactive</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AutoShortlistManager;
