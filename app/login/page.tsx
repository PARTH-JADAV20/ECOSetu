'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import './style.css';

type Role = 'Engineer' | 'ECO Manager' | 'Operations' | 'Admin';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const router = useRouter();
  const { login, isReady, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isReady, isAuthenticated]);

  // Fetch user role when email changes
  useEffect(() => {
    // AbortController to cancel previous requests
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUserRole = async () => {
      const trimmedEmail = email.trim();
      // Stricter email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Only fetch if email is valid format
      if (!emailRegex.test(trimmedEmail)) {
        setUserRole(null);
        setUserNotFound(false);
        setIsLoadingRole(false);
        return;
      }

      setIsLoadingRole(true);
      setUserNotFound(false);
      try {
        const response = await fetch(`/api/users?email=${encodeURIComponent(trimmedEmail)}`, { signal });

        if (response.ok) {
          const userData = await response.json().catch(err => {
            console.error('Failed to parse user response:', err);
            return null;
          });
          if (!userData) {
            if (!signal.aborted) {
              setUserRole(null);
              setUserNotFound(true);
            }
            return;
          }
          // Only update if component is still mounted and request wasn't aborted
          if (!signal.aborted) {
            setUserRole(userData.role || null);
            setUserNotFound(false);
          }
        } else {
          if (!signal.aborted) {
            setUserRole(null);
            if (response.status === 404) {
              setUserNotFound(true);
            }
          }
        }
      } catch (err: any) {
        // Ignore abort errors
        if (err.name !== 'AbortError') {
          console.error('Error fetching user role:', err);
          setUserRole(null);
          // Only show not found if it's not a connection error
          // setUserNotFound(true); // Don't set this on generic error
        }
      } finally {
        if (!signal.aborted) {
          setIsLoadingRole(false);
        }
      }
    };

    // Debounce to wait for user to stop typing
    const debounceTimer = setTimeout(fetchUserRole, 500);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort(); // Cancel any in-flight requests
    };
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data);
        // Use router.replace to avoid history pollution
        router.replace('/dashboard');
      } else {
        setError(data.error || 'Invalid email or password');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return null;
  }

  // Don't render if already authenticated (let useEffect handle redirect)
  if (isAuthenticated) {
    return null;
  }

  const TEST_CREDENTIALS: Record<Role, { email: string }> = {
    Admin: { email: 'admin@example.com' },
    Engineer: { email: 'sarah@example.com' },
    'ECO Manager': { email: 'michael@example.com' },
    Operations: { email: 'john@example.com' },
  };

  const handleTestAutoFill = (role: Role) => {
    setEmail(TEST_CREDENTIALS[role].email);
    setPassword('password123'); // Using the common seed password
  };

  return (
    <div className="login-page-wrapper">
      <section>
        {/* Background animated squares */}
        {Array.from({ length: 250 }).map((_, index) => (
          <span key={index}></span>
        ))}

        <div className="signin">
          <div className="content">
            <h2>Sign In</h2>

            {/* Role Display */}
            <div className="role-display" style={userNotFound ? { color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.3)', background: 'rgba(255, 107, 107, 0.1)' } : {}}>
              {isLoadingRole ? 'Loading role...' :
                userRole ? `Role: ${userRole}` :
                  userNotFound ? 'User not found' :
                    'your role will appear here'}
            </div>

            {error && <div className="error-message">{error}</div>}

            <form className="form" onSubmit={handleSubmit}>
              <div className="inputBox">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <i>Email</i>
              </div>

              <div className="inputBox">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i>Password</i>
              </div>

              <div className="inputBox">
                <input
                  type="submit"
                  value={isLoading ? 'Signing In...' : 'Sign In'}
                  disabled={isLoading}
                />
              </div>
            </form>

            <div className="test-app-section">
              <p>Test App</p>
              <div className="test-buttons">
                {Object.keys(TEST_CREDENTIALS)
                  .filter(role => role !== 'Admin') // Keep the most used ones first
                  .concat('Admin')
                  .map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleTestAutoFill(role as Role)}
                      className="test-btn"
                    >
                      {role === 'ECO Manager' ? 'ECO Manager' : role}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

