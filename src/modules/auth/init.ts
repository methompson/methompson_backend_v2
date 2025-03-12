import { initializeApp } from 'firebase-admin/app';

export function useAuth() {
  return process.env.NO_AUTH !== 'true';
}

export function initializeAppAuth() {
  if (!useAuth()) {
    return;
  }
  initializeApp();
}
