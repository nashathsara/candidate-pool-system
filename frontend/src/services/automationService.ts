import { db } from '../config/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import type {
  AutomationRule,
  NotificationAction,
  AutoShortlistRule,
} from '../utils/automationTypes';

const AUTOMATION_RULES_COLLECTION = 'automation_rules';
const NOTIFICATIONS_COLLECTION = 'notifications';
const AUTOSHORTLIST_RULES_COLLECTION = 'autoshortlist_rules';

// Create automation rule
export const createAutomationRule = async (
  rule: Omit<AutomationRule, 'id' | 'createdDate'>
): Promise<string> => {
  try {
    const newRule = {
      ...rule,
      createdDate: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, AUTOMATION_RULES_COLLECTION), newRule);
    return docRef.id;
  } catch (error) {
    console.error('Error creating automation rule:', error);
    throw error;
  }
};

// Get all automation rules
export const getAutomationRules = async (): Promise<AutomationRule[]> => {
  try {
    const snapshot = await getDocs(collection(db, AUTOMATION_RULES_COLLECTION));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdDate: doc.data().createdDate?.toDate() || new Date(),
    })) as AutomationRule[];
  } catch (error) {
    console.error('Error fetching automation rules:', error);
    throw error;
  }
};

// Update automation rule
export const updateAutomationRule = async (
  ruleId: string,
  updates: Partial<AutomationRule>
): Promise<void> => {
  try {
    const ruleRef = doc(db, AUTOMATION_RULES_COLLECTION, ruleId);
    await updateDoc(ruleRef, updates);
  } catch (error) {
    console.error('Error updating automation rule:', error);
    throw error;
  }
};

// Delete automation rule
export const deleteAutomationRule = async (ruleId: string): Promise<void> => {
  try {
    const ruleRef = doc(db, AUTOMATION_RULES_COLLECTION, ruleId);
    await deleteDoc(ruleRef);
  } catch (error) {
    console.error('Error deleting automation rule:', error);
    throw error;
  }
};

// Create notification action
export const createNotificationAction = async (
  notification: Omit<NotificationAction, 'id' | 'createdDate'>
): Promise<string> => {
  try {
    const newNotification = {
      ...notification,
      createdDate: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), newNotification);
    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get notifications for user
export const getNotifications = async (
  recipient: string,
  limit: number = 50
): Promise<NotificationAction[]> => {
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('recipient', '==', recipient)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .slice(0, limit)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdDate: doc.data().createdDate?.toDate() || new Date(),
        sentDate: doc.data().sentDate?.toDate(),
      })) as NotificationAction[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Update notification status
export const updateNotificationStatus = async (
  notificationId: string,
  status: 'pending' | 'sent' | 'failed',
  failureReason?: string
): Promise<void> => {
  try {
    const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    const updates: any = {
      status,
      sentDate: Timestamp.now(),
    };
    if (failureReason) {
      updates.failureReason = failureReason;
    }
    await updateDoc(notificationRef, updates);
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error;
  }
};

// Create auto-shortlist rule
export const createAutoShortlistRule = async (
  rule: Omit<AutoShortlistRule, 'id'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, AUTOSHORTLIST_RULES_COLLECTION), rule);
    return docRef.id;
  } catch (error) {
    console.error('Error creating auto-shortlist rule:', error);
    throw error;
  }
};

// Get auto-shortlist rules
export const getAutoShortlistRules = async (): Promise<AutoShortlistRule[]> => {
  try {
    const q = query(
      collection(db, AUTOSHORTLIST_RULES_COLLECTION),
      where('enabled', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AutoShortlistRule[];
  } catch (error) {
    console.error('Error fetching auto-shortlist rules:', error);
    throw error;
  }
};

// Update auto-shortlist rule
export const updateAutoShortlistRule = async (
  ruleId: string,
  updates: Partial<AutoShortlistRule>
): Promise<void> => {
  try {
    const ruleRef = doc(db, AUTOSHORTLIST_RULES_COLLECTION, ruleId);
    await updateDoc(ruleRef, updates);
  } catch (error) {
    console.error('Error updating auto-shortlist rule:', error);
    throw error;
  }
};
