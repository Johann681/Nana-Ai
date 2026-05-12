import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { createConsultation } from '../lib/api';
import { ToastType } from '../context/ToastContext';

type ToastFunction = (message: string, type?: ToastType) => void;

/**
 * Initiates a new consultation with a specific specialist or general practitioner.
 */
export const handleStartConsultation = async (
  doctorId: string,
  doctorName: string,
  router: AppRouterInstance,
  toast: ToastFunction,
  setLoadingState?: (state: boolean) => void
) => {
  try {
    if (setLoadingState) setLoadingState(true);
    toast(`Connecting to ${doctorName}...`, 'info');
    
    const consultation = await createConsultation(doctorId, doctorName);
    
    if (consultation && consultation._id) {
      toast(`Connected to ${doctorName} successfully.`, 'success');
      router.push(`/chat/${consultation._id}`);
    } else {
      throw new Error('Failed to create consultation');
    }
  } catch (err) {
    console.error(err);
    toast('Failed to start consultation. Please try again.', 'error');
    if (setLoadingState) setLoadingState(false);
  }
};

/**
 * Handles clicks for features that are not yet implemented in the backend.
 */
export const handleFeatureNotReady = (
  featureName: string,
  toast: ToastFunction
) => {
  toast(`${featureName} is currently unavailable in this node.`, 'info');
};

/**
 * Navigates to a specific route with a toast notification if needed.
 */
export const handleNavigation = (
  path: string,
  router: AppRouterInstance,
  toast?: ToastFunction,
  toastMessage?: string
) => {
  if (toast && toastMessage) {
    toast(toastMessage, 'info');
  }
  router.push(path);
};
