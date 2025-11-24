import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ViewPasswordPage.css';

const API_URL = 'http://localhost:3000';

function ViewPasswordPage() {
  const { id } = useParams<{ id: string }>();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPassword = async () => {
      if (!id) {
        setError('Invalid link');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/password/retrieve/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Password not found or already retrieved');
          }
          throw new Error('Failed to retrieve password');
        }

        const data = await response.json();
        setPassword(data.password);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to retrieve password');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPassword();
  }, [id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <h1>❌ Error</h1>
          <p className="error-message">{error}</p>
          <p className="info">
            The password may have already been retrieved, or the link is invalid.
          </p>
          <a href="/" className="btn-primary">
            Create New Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>🔐 Password Retrieved</h1>
        <p className="warning">⚠️ This password has been deleted from the server</p>

        <div className="password-display">
          <div className="password-box">
            <code>{password}</code>
          </div>
          <button onClick={copyToClipboard} className="btn-copy">
            {copied ? '✓ Copied!' : 'Copy Password'}
          </button>
        </div>

        <div className="info-box">
          <p>
            <strong>Important:</strong> Save this password now. This link will not work again.
          </p>
        </div>

        <a href="/" className="btn-secondary">
          Create New Link
        </a>
      </div>
    </div>
  );
}

export default ViewPasswordPage;