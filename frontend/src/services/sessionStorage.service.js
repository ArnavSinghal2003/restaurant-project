const STORAGE_KEY = 'tableflow_active_session';

export function saveActiveSession(sessionContext) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...sessionContext,
        savedAt: new Date().toISOString()
      })
    );
  } catch {
    // ignore localStorage failures
  }
}

export function getActiveSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function clearActiveSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore localStorage failures
  }
}
