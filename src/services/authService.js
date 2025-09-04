// Authentication service for civic reporting system
// Handles user registration, login, and session management

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isLoggedIn = false;
    this.baseUrl = 'http://localhost:5000';
    
    // Check if user is already logged in on page load
    this.checkExistingSession();
  }

  /**
   * Verify session from localStorage and server (best-effort)
   */
  async verifySession() {
    try {
      const savedUser = localStorage.getItem('civicUser');
      const savedToken = localStorage.getItem('civicToken');
      if (!savedUser || !savedToken) return false;
      const parsed = JSON.parse(savedUser);
      // Optionally ping the server to ensure the user still exists
      const res = await fetch(`${this.baseUrl}/users/${parsed.id}`);
      if (!res.ok) return false;
      const fresh = await res.json();
      this.currentUser = fresh;
      this.isLoggedIn = true;
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check for existing session in localStorage
   */
  checkExistingSession() {
  const savedUser = localStorage.getItem('civic_user');
  const savedToken = localStorage.getItem('civic_token');
    
    if (savedUser && savedToken) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.isLoggedIn = true;
        console.log('👤 User session restored:', this.currentUser.name);
      } catch (error) {
        console.error('Invalid saved session');
        this.logout();
      }
    }
  }

  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} - Registration result
   */
  async register(userData) {
    try {
      // Validate required fields
      const requiredFields = ['name', 'email', 'phone', 'password', 'location', 'address'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Check if email already exists
      const existingUser = await this.checkEmailExists(userData.email);
      if (existingUser) {
        throw new Error('Email already registered. Please use a different email or login.');
      }

      // Check if phone already exists
      const existingPhone = await this.checkPhoneExists(userData.phone);
      if (existingPhone) {
        throw new Error('Phone number already registered. Please use a different number.');
      }

      // Create new user object
      const newUser = {
        // json-server prefers numeric ids when mixing with numeric relations
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        phone: userData.phone.trim(),
        password: userData.password, // In production, this would be hashed
        role: 'citizen',
        location: userData.location.trim(),
        address: userData.address.trim(),
        isVerified: false, // Email verification would be required
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      // Register user via API
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }

      const registeredUser = await response.json();

      // persist session immediately for smoother UX
      this.currentUser = registeredUser;
      this.isLoggedIn = true;
      this.saveSession(registeredUser);

      return {
        success: true,
        message: 'Registration successful!',
        user: this.sanitizeUserForPublic(registeredUser)
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - Login result
   */
  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Find user by email
      const response = await fetch(`${this.baseUrl}/users?email=${encodeURIComponent(email.toLowerCase())}`);
      
      if (!response.ok) {
        throw new Error('Login failed. Please try again.');
      }

      const users = await response.json();
      const user = users[0];

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password (in production, this would be hashed comparison)
      if (user.password !== password) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await this.updateLastLogin(user.id);

      // Set current user
      this.currentUser = user;
      this.isLoggedIn = true;

      // Save session
      this.saveSession(user);

      return {
        success: true,
        message: 'Login successful!',
        user: this.sanitizeUserForPublic(user)
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Logout user
   */
  logout() {
    this.currentUser = null;
    this.isLoggedIn = false;
  localStorage.removeItem('civic_user');
  localStorage.removeItem('civic_token');
    console.log('👋 User logged out');
  }

  /**
   * Get current user (sanitized for public use)
   * @returns {object|null} - Current user without sensitive data
   */
  getCurrentUser() {
    if (!this.currentUser) return null;
    return this.sanitizeUserForPublic(this.currentUser);
  }

  /**
   * Check if user is logged in
   * @returns {boolean} - Login status
   */
  isAuthenticated() {
    return this.isLoggedIn && this.currentUser !== null;
  }

  /**
   * Check if current user is admin
   * @returns {boolean} - Admin status
   */
  isAdmin() {
    return this.isAuthenticated() && this.currentUser.role === 'admin';
  }

  /**
   * Get user details for admin view only
   * @param {number} userId - User ID
   * @returns {Promise<object|null>} - Full user details (admin only)
   */
  async getUserDetailsForAdmin(userId) {
    if (!this.isAdmin()) {
      throw new Error('Access denied. Admin privileges required.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  }

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} - Exists status
   */
  async checkEmailExists(email) {
    try {
      const response = await fetch(`${this.baseUrl}/users?email=${encodeURIComponent(email.toLowerCase())}`);
      if (response.ok) {
        const users = await response.json();
        return users.length > 0;
      }
      return false;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  /**
   * Check if phone exists
   * @param {string} phone - Phone to check
   * @returns {Promise<boolean>} - Exists status
   */
  async checkPhoneExists(phone) {
    try {
      const response = await fetch(`${this.baseUrl}/users?phone=${encodeURIComponent(phone)}`);
      if (response.ok) {
        const users = await response.json();
        return users.length > 0;
      }
      return false;
    } catch (error) {
      console.error('Error checking phone:', error);
      return false;
    }
  }

  /**
   * Update user's last login time
   * @param {number} userId - User ID
   */
  async updateLastLogin(userId) {
    try {
      await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastLogin: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  /**
   * Update profile
   */
  async updateProfile(userId, updates) {
    try {
      const res = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updated = await res.json();
      this.currentUser = updated;
      this.saveSession(updated);
      return this.sanitizeUserForPublic(updated);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Save user session to localStorage
   * @param {object} user - User object
   */
  saveSession(user) {
    const sanitizedUser = this.sanitizeUserForPublic(user);
    const token = this.generateToken(user.id);
    
  localStorage.setItem('civic_user', JSON.stringify(sanitizedUser));
  localStorage.setItem('civic_token', token);
  }

  /**
   * Generate a simple token (in production, use JWT)
   * @param {number} userId - User ID
   * @returns {string} - Token
   */
  generateToken(userId) {
    return btoa(`${userId}_${Date.now()}_civic`);
  }

  /**
   * Remove sensitive data from user object for public use
   * @param {object} user - Full user object
   * @returns {object} - Sanitized user object
   */
  sanitizeUserForPublic(user) {
    const { password, ...publicUser } = user;
    return publicUser;
  }

  /**
   * Get user's public display name
   * @param {object} user - User object
   * @returns {string} - Display name
   */
  getDisplayName(user) {
    if (!user) return 'Anonymous';
    return user.name || 'User';
  }

  /**
   * Get user's initials for avatar
   * @param {object} user - User object
   * @returns {string} - User initials
   */
  getUserInitials(user) {
    if (!user || !user.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
