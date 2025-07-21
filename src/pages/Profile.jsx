import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ProfileFormSkeleton } from '../Components/SkeletonLoader';
import {
  getCustomerById,
  getAgentById,
  getAdminById,
  updateCustomerName,
  updateCustomerEmail,
  updateCustomerPhone,
  updateAgentName,
  updateAgentEmail,
  updateAgentPhone,
  updateAdminName,
  updateAdminEmail,
  updateAdminPhone
} from '../api/apicall';

const Profile = () => {
  const user = useSelector((state) => state.userinfo.user);
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    phone: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setFetchLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setFetchLoading(true);
      setMessage('');
      setErrors({});
      let response;

      console.log('Fetching profile for user:', user);

      if (user.role === 'Customer') {
        response = await getCustomerById(user.id);
      } else if (user.role === 'DeliveryAgent' || user.role === 'Agent') {
        response = await getAgentById(user.id);
      } else if (user.role === 'Admin') {
        response = await getAdminById(user.id);
      }

      console.log('Profile response:', response?.data);

      if (response && response.data) {
        const data = response.data;
        const profileInfo = {
          name: data.name || data.customerName || data.agentName || data.adminName || '',
          username: data.username || data.customerUsername || data.agentUsername || data.adminUsername || user.username || '',
          email: data.email || data.customerEmail || data.agentEmail || data.adminEmail || '',
          phone: data.phone || data.customerPhone || data.agentPhone || data.adminPhone || ''
        };

        setProfileData(profileInfo);
        setOriginalData(profileInfo);
      } else {
        // Fallback to user data if API doesn't return profile
        const fallbackData = {
          name: user.name || '',
          username: user.username || '',
          email: user.email || '',
          phone: user.phone || ''
        };
        setProfileData(fallbackData);
        setOriginalData(fallbackData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);

      if (error.response?.status === 404) {
        setMessage('Profile not found. Using account information.');
        // Use user data as fallback
        const fallbackData = {
          name: user.name || '',
          username: user.username || '',
          email: user.email || '',
          phone: user.phone || ''
        };
        setProfileData(fallbackData);
        setOriginalData(fallbackData);
      } else if (error.response?.status === 401) {
        setMessage('Session expired. Please log in again.');
      } else {
        setMessage('Failed to load profile data. Please try refreshing the page.');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(value.replace(/\D/g, ''))) {
          newErrors.phone = 'Please enter a valid 10-digit phone number';
        } else {
          delete newErrors.phone;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });

    // Clear message when user starts typing
    if (message) setMessage('');

    // Validate field if it's being edited
    if (isEditing && editField === name) {
      validateField(name, value);
    }
  };

  const handleEdit = (field) => {
    setEditField(field);
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditField('');
    setMessage('');
    setErrors({});
    // Reset to original data without API call
    setProfileData({ ...originalData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !editField) return;

    // Validate the field being edited
    const fieldValue = profileData[editField];
    if (!validateField(editField, fieldValue)) {
      setMessage('Please fix the validation errors before saving.');
      return;
    }

    // Check if value actually changed
    if (fieldValue === originalData[editField]) {
      setMessage('No changes detected.');
      setIsEditing(false);
      setEditField('');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const updateData = { id: user.id };

      if (editField === 'name') {
        updateData.name = profileData.name.trim();
        if (user.role === 'Customer') {
          await updateCustomerName(updateData);
        } else if (user.role === 'DeliveryAgent' || user.role === 'Agent') {
          await updateAgentName(updateData);
        } else if (user.role === 'Admin') {
          await updateAdminName(updateData);
        }
      } else if (editField === 'email') {
        updateData.email = profileData.email.trim();
        if (user.role === 'Customer') {
          await updateCustomerEmail(updateData);
        } else if (user.role === 'DeliveryAgent' || user.role === 'Agent') {
          await updateAgentEmail(updateData);
        } else if (user.role === 'Admin') {
          await updateAdminEmail(updateData);
        }
      } else if (editField === 'phone') {
        updateData.phone = profileData.phone.replace(/\D/g, ''); // Remove non-digits
        if (user.role === 'Customer') {
          await updateCustomerPhone(updateData);
        } else if (user.role === 'DeliveryAgent' || user.role === 'Agent') {
          await updateAgentPhone(updateData);
        } else if (user.role === 'Admin') {
          await updateAdminPhone(updateData);
        }
      }

      // Update original data to reflect the change
      setOriginalData({
        ...originalData,
        [editField]: profileData[editField]
      });

      setMessage(`${editField.charAt(0).toUpperCase() + editField.slice(1)} updated successfully!`);
      setIsEditing(false);
      setEditField('');
      setErrors({});
    } catch (error) {
      console.error('Error updating profile:', error);

      if (error.response?.status === 409) {
        setMessage(`This ${editField} is already in use. Please choose a different one.`);
      } else if (error.response?.status === 400) {
        setMessage(`Invalid ${editField} format. Please check your input.`);
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage(`Failed to update ${editField}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Access Denied</h4>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (fetchLoading) {
    return (
      <div className="container mt-4">
        <div className="skeleton-text title mb-4" style={{ height: '32px', width: '200px' }}></div>
        <ProfileFormSkeleton />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-danger text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <i className="fas fa-user me-2"></i>
                  Profile Information
                </h3>
                <div className="d-flex align-items-center">
                  <span className="badge bg-light text-dark me-2">
                    {user.role}
                  </span>
                  <button
                    className="btn btn-light btn-sm"
                    onClick={fetchProfile}
                    disabled={fetchLoading}
                    title="Refresh Profile"
                  >
                    <i className={`fas fa-sync-alt ${fetchLoading ? 'fa-spin' : ''}`}></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                  <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label htmlFor="name" className="form-label fw-bold">Name</label>
                    {!isEditing && (
                      <button 
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEdit('name')}
                      >
                        <i className="fas fa-edit me-1"></i>Edit
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : isEditing && editField === 'name' && profileData.name ? 'is-valid' : ''}`}
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    readOnly={!isEditing || editField !== 'name'}
                    required={isEditing && editField === 'name'}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Username Field */}
                <div className="mb-4">
                  <label htmlFor="username" className="form-label fw-bold">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={profileData.username}
                    readOnly
                  />
                  <small className="text-muted">Username cannot be changed</small>
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label htmlFor="email" className="form-label fw-bold">Email</label>
                    {!isEditing && (
                      <button 
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEdit('email')}
                      >
                        <i className="fas fa-edit me-1"></i>Edit
                      </button>
                    )}
                  </div>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : isEditing && editField === 'email' && profileData.email ? 'is-valid' : ''}`}
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    readOnly={!isEditing || editField !== 'email'}
                    required={isEditing && editField === 'email'}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Phone Field - For Customer, Agent, and Admin */}
                {(user.role === 'Customer' || user.role === 'Admin' || user.role === 'DeliveryAgent' || user.role === 'Agent') && (
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label htmlFor="phone" className="form-label fw-bold">Phone</label>
                      {!isEditing && (
                        <button 
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleEdit('phone')}
                        >
                          <i className="fas fa-edit me-1"></i>Edit
                        </button>
                      )}
                    </div>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : isEditing && editField === 'phone' && profileData.phone ? 'is-valid' : ''}`}
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      readOnly={!isEditing || editField !== 'phone'}
                      required={isEditing && editField === 'phone'}
                      placeholder="1234567890"
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                    {isEditing && editField === 'phone' && (
                      <small className="form-text text-muted">
                        Enter a 10-digit phone number (numbers only)
                      </small>
                    )}
                  </div>
                )}

                {/* Role Field */}
                <div className="mb-4">
                  <label htmlFor="role" className="form-label fw-bold">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    id="role"
                    value={user.role}
                    readOnly
                  />
                  <small className="text-muted">Role cannot be changed</small>
                </div>
                
                {/* Action Buttons */}
                {isEditing && (
                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-danger"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <i className="fas fa-times me-2"></i>
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
