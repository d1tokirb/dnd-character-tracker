import React, { useState } from 'react';
import { supabase } from '../supabase';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (!data.session) {
          setMessage('Check your email for the confirmation link!');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <h1>D&D Character Tracker</h1>
        <p>{isSignUp ? 'Create an account' : 'Sign in to your account'}</p>

        <form onSubmit={handleAuth} className="auth-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your email"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
            />
          </div>

          {isSignUp && (
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <button
          className="toggle-auth-btn"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setMessage(null);
          }}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>

      <style>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: var(--spacing-md);
          background-color: var(--bg-primary);
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          text-align: center;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }
        .auth-card h1 {
          font-family: var(--font-heading);
          color: var(--accent-gold);
          font-size: 2rem;
          margin-bottom: var(--spacing-xs);
        }
        .auth-card p {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-lg);
          font-family: var(--font-body);
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }
        .input-group label {
          color: var(--text-secondary);
          font-family: var(--font-body);
          margin-bottom: 4px;
          display: block;
          text-align: left;
        }
        .input-group input {
          width: 100%;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: var(--spacing-sm);
          border-radius: 4px;
          font-family: var(--font-body);
        }
        .input-group input:focus {
          outline: none;
          border-color: var(--accent-gold);
        }
        .auth-btn {
          background-color: var(--accent-gold);
          color: var(--bg-primary);
          border: none;
          padding: var(--spacing-sm);
          border-radius: 4px;
          font-weight: bold;
          font-size: 1rem;
          margin-top: var(--spacing-sm);
          font-family: var(--font-heading);
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .auth-btn:hover:not(:disabled) {
          background-color: var(--accent-gold-dim);
        }
        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .toggle-auth-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.9rem;
          text-decoration: underline;
          font-family: var(--font-body);
          cursor: pointer;
        }
        .toggle-auth-btn:hover {
          color: var(--accent-gold);
        }
        .error-message {
          color: var(--accent-red);
          font-size: 0.9rem;
          background-color: rgba(139, 0, 0, 0.1);
          padding: var(--spacing-xs);
          border-radius: 4px;
          border: 1px solid rgba(139, 0, 0, 0.3);
        }
        .success-message {
          color: #4caf50;
          font-size: 0.9rem;
          background-color: rgba(76, 175, 80, 0.1);
          padding: var(--spacing-xs);
          border-radius: 4px;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }
      `}</style>
    </div>
  );
};
