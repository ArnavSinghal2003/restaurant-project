import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { usePageTitle } from '../hooks/usePageTitle';
import {
  addSessionParticipant,
  createOrJoinSession,
  getSessionByToken
} from '../services/session.service';
import {
  clearActiveSession,
  getActiveSession,
  saveActiveSession
} from '../services/sessionStorage.service';

function TableSessionPage() {
  const { qrToken } = useParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState('collective');
  const [name, setName] = useState('');
  const [isCheckingSavedSession, setIsCheckingSavedSession] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  usePageTitle('Join Table Session | TableFlow');

  useEffect(() => {
    let ignore = false;

    async function tryResumeSavedSession() {
      const savedSession = getActiveSession();

      if (!savedSession || savedSession.qrToken !== qrToken || !savedSession.sessionToken) {
        if (!ignore) setIsCheckingSavedSession(false);
        return;
      }

      try {
        const sessionData = await getSessionByToken(savedSession.sessionToken);
        if (ignore) return;

        const nextContext = {
          sessionToken: sessionData.session.sessionToken,
          qrToken,
          mode: sessionData.session.mode,
          restaurant: sessionData.restaurant,
          table: sessionData.table
        };

        saveActiveSession(nextContext);
        navigate(`/r/${sessionData.restaurant.slug}?sessionToken=${sessionData.session.sessionToken}`, {
          replace: true
        });
      } catch {
        clearActiveSession();
        if (!ignore) {
          setIsCheckingSavedSession(false);
        }
      }
    }

    tryResumeSavedSession();

    return () => {
      ignore = true;
    };
  }, [navigate, qrToken]);

  async function handleJoinSession(event) {
    event.preventDefault();

    setIsJoining(true);
    setErrorMessage('');

    try {
      const joinResponse = await createOrJoinSession({ qrToken, mode });

      if (name.trim()) {
        await addSessionParticipant(joinResponse.session.sessionToken, name.trim());
      }

      saveActiveSession({
        sessionToken: joinResponse.session.sessionToken,
        qrToken,
        mode: joinResponse.session.mode,
        restaurant: joinResponse.restaurant,
        table: joinResponse.table
      });

      navigate(
        `/r/${joinResponse.restaurant.slug}?sessionToken=${joinResponse.session.sessionToken}`,
        {
          replace: true
        }
      );
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to join table session.');
    } finally {
      setIsJoining(false);
    }
  }

  if (isCheckingSavedSession) {
    return (
      <section className="container page-shell">
        <p className="eyebrow">QR Session</p>
        <h1>Resuming your table session...</h1>
      </section>
    );
  }

  return (
    <section className="container page-shell session-page">
      <p className="eyebrow">QR Session</p>
      <h1>Join Table Session</h1>
      <p className="hero-copy">
        You are entering via QR token. Choose ordering mode and optionally add your name.
      </p>

      <div className="session-token-box">
        <strong>QR Token:</strong> <code>{qrToken}</code>
      </div>

      <form className="session-form" onSubmit={handleJoinSession}>
        <label className="form-field">
          <span>Ordering mode</span>
          <select className="field" value={mode} onChange={(event) => setMode(event.target.value)}>
            <option value="collective">Collective (shared cart)</option>
            <option value="individual">Individual (per person)</option>
          </select>
        </label>

        <label className="form-field">
          <span>Your name (optional)</span>
          <input
            className="field"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Arnav"
            maxLength={60}
          />
        </label>

        {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

        <button className="btn btn-accent" type="submit" disabled={isJoining}>
          {isJoining ? 'Joining...' : 'Join Table'}
        </button>
      </form>
    </section>
  );
}

export default TableSessionPage;
