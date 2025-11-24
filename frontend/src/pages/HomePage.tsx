import { useState } from 'react';
import './HomePage.css';

const API_URL = 'http://localhost:3000';

function HomePage() {
  const [password, setPassword] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError('Please enter a password');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedLink('');

    try {
      const response = await fetch(`${API_URL}/api/password/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Failed to store password');
      }

      const data = await response.json();
      const link = `${window.location.origin}/view/${data.id}`;
      setGeneratedLink(link);

      // Clear the password input for security
      setPassword('');
    } catch (err) {
      setError('Failed to generate link. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Secure Password Share</h1>
        <p className="subtitle">Share a password securely with a one-time link</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Password to Share</label>
            <input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              disabled={isLoading}
              autoComplete="off"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Generating...' : 'Generate Secure Link'}
          </button>
        </form>

        {generatedLink && (
          <div className="result">
            <h3>Your secure link is ready!</h3>
            <p className="warning">⚠️ This link can only be used once</p>
            <div className="link-container">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="link-input"
              />
              <button onClick={copyToClipboard} className="btn-copy">
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;