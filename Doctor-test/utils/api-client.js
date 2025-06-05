/**
 * API Client Helper for Testing
 * 
 * This module provides a centralized way to make HTTP requests to the HealthHive API
 * with built-in authentication, error handling, and retry logic for testing
 */

const axios = require('axios');
const testConfig = require('../config/test-config');

/**
 * API Client Class
 * Handles all HTTP communication with the HealthHive backend API
 */
class APIClient {
  constructor() {
    // Set base URL from test configuration
    this.baseURL = testConfig.api.baseUrl;
    
    // Default headers for all requests
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Authentication token storage
    this.authToken = null;
    
    // Request timeout from configuration
    this.timeout = testConfig.api.timeout;
    
    // Initialize axios instance with default configuration
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: this.defaultHeaders
    });
    
    // Set up request and response interceptors
    this.setupInterceptors();
  }

  /**
   * Set up axios interceptors for request/response handling
   * Automatically adds authentication headers and handles errors
   */
  setupInterceptors() {
    // Request interceptor - adds authentication token
    this.client.interceptors.request.use(
      (config) => {
        // Add authorization header if token is available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        
        // Log request details if enabled
        if (testConfig.logging.logRequests) {
          console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handles common response processing
    this.client.interceptors.response.use(
      (response) => {
        // Log response details if enabled
        if (testConfig.logging.logRequests) {
          console.log(`📥 ${response.status} ${response.config.url}`);
        }
        
        return response;
      },
      (error) => {
        // Enhanced error handling for better test debugging
        if (error.response) {
          // Server responded with error status
          console.error(`❌ API Error ${error.response.status}:`, error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          console.error('❌ Network Error:', error.message);
        } else {
          // Something else happened
          console.error('❌ Request Setup Error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token for subsequent requests
   * @param {string} token - JWT token for authentication
   */
  setAuthToken(token) {
    this.authToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken() {
    this.authToken = null;
  }

  /**
   * Generic request method with retry logic
   * @param {Object} config - Axios request configuration
   * @returns {Promise<Object>} API response
   */
  async request(config) {
    let lastError;
    
    // Retry logic based on configuration
    for (let attempt = 1; attempt <= testConfig.api.maxRetries; attempt++) {
      try {
        const response = await this.client(config);
        return response;
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx) or for final attempt
        if (attempt === testConfig.api.maxRetries || 
            (error.response && error.response.status < 500)) {
          break;
        }
        
        // Wait before retrying
        await this.wait(testConfig.api.retryDelay);
        console.log(`🔄 Retrying request (attempt ${attempt + 1}/${testConfig.api.maxRetries})`);
      }
    }
    
    throw lastError;
  }

  /**
   * Helper method to wait for specified time
   * @param {number} ms - Milliseconds to wait
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Authentication Endpoints

  /**
   * Register a new user (patient or doctor)
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    return this.request({
      method: 'POST',
      url: '/auth/register',
      data: userData
    });
  }

  /**
   * Login user and store authentication token
   * @param {Object} credentials - Login credentials {email, password}
   * @returns {Promise<Object>} Login response
   */
  async login(credentials) {
    const response = await this.request({
      method: 'POST',
      url: '/auth/login',
      data: credentials
    });
    
    // Automatically store token for subsequent requests
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Logout user and clear authentication token
   * @returns {Promise<Object>} Logout response
   */
  async logout() {
    const response = await this.request({
      method: 'POST',
      url: '/auth/logout'
    });
    
    // Clear stored token
    this.clearAuthToken();
    
    return response;
  }

  /**
   * Get user profile (requires authentication)
   * @returns {Promise<Object>} User profile response
   */
  async getProfile() {
    return this.request({
      method: 'GET',
      url: '/auth/profile'
    });
  }

  // Doctor Endpoints

  /**
   * Get list of all doctors
   * @param {Object} filters - Optional filters for doctor search
   * @returns {Promise<Object>} Doctors list response
   */
  async getDoctors(filters = {}) {
    return this.request({
      method: 'GET',
      url: '/doctors',
      params: filters
    });
  }

  /**
   * Get specific doctor by ID
   * @param {string} doctorId - Doctor's unique identifier
   * @returns {Promise<Object>} Doctor details response
   */
  async getDoctorById(doctorId) {
    return this.request({
      method: 'GET',
      url: `/doctors/${doctorId}`
    });
  }

  /**
   * Update doctor profile (requires doctor authentication)
   * @param {Object} updateData - Doctor profile updates
   * @returns {Promise<Object>} Update response
   */
  async updateDoctorProfile(updateData) {
    return this.request({
      method: 'PUT',
      url: '/doctors/profile',
      data: updateData
    });
  }

  // Appointment Endpoints

  /**
   * Book a new appointment
   * @param {Object} appointmentData - Appointment booking data
   * @returns {Promise<Object>} Booking response
   */
  async bookAppointment(appointmentData) {
    return this.request({
      method: 'POST',
      url: '/appointments',
      data: appointmentData
    });
  }

  /**
   * Get user's appointments
   * @param {Object} filters - Optional filters for appointment search
   * @returns {Promise<Object>} Appointments list response
   */
  async getAppointments(filters = {}) {
    return this.request({
      method: 'GET',
      url: '/appointments',
      params: filters
    });
  }

  /**
   * Get specific appointment by ID
   * @param {string} appointmentId - Appointment's unique identifier
   * @returns {Promise<Object>} Appointment details response
   */
  async getAppointmentById(appointmentId) {
    return this.request({
      method: 'GET',
      url: `/appointments/${appointmentId}`
    });
  }

  /**
   * Cancel an appointment
   * @param {string} appointmentId - Appointment to cancel
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancellation response
   */
  async cancelAppointment(appointmentId, reason) {
    return this.request({
      method: 'PUT',
      url: `/appointments/${appointmentId}/cancel`,
      data: { reason }
    });
  }

  // Payment Endpoints

  /**
   * Create payment intent for appointment
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment intent response
   */
  async createPaymentIntent(paymentData) {
    return this.request({
      method: 'POST',
      url: '/payments/create-payment-intent',
      data: paymentData
    });
  }

  /**
   * Confirm payment for appointment
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @returns {Promise<Object>} Payment confirmation response
   */
  async confirmPayment(paymentIntentId) {
    return this.request({
      method: 'POST',
      url: '/payments/confirm',
      data: { paymentIntentId }
    });
  }

  // Service Endpoints

  /**
   * Get available medical services
   * @returns {Promise<Object>} Services list response
   */
  async getServices() {
    return this.request({
      method: 'GET',
      url: '/services'
    });
  }

  // Analytics Endpoints

  /**
   * Get doctor dashboard analytics (requires doctor authentication)
   * @returns {Promise<Object>} Doctor analytics response
   */
  async getDoctorAnalytics() {
    return this.request({
      method: 'GET',
      url: '/analytics/doctor/dashboard'
    });
  }

  /**
   * Get platform analytics (requires admin authentication)
   * @returns {Promise<Object>} Platform analytics response
   */
  async getPlatformAnalytics() {
    return this.request({
      method: 'GET',
      url: '/analytics/platform'
    });
  }

  // Notification Endpoints

  /**
   * Get user notifications
   * @returns {Promise<Object>} Notifications list response
   */
  async getNotifications() {
    return this.request({
      method: 'GET',
      url: '/notifications'
    });
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification to mark as read
   * @returns {Promise<Object>} Mark read response
   */
  async markNotificationRead(notificationId) {
    return this.request({
      method: 'PUT',
      url: `/notifications/${notificationId}/read`
    });
  }
}

/**
 * Create and export a singleton instance of APIClient
 * This ensures consistent API client usage across all tests
 */
const apiClient = new APIClient();

module.exports = apiClient; 