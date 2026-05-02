import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { authApi } from '../services/authApi';

export default function RequestAccessPage() {
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', branch: '', year: '', phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authApi.register({
        ...formData,
        year: formData.year ? parseInt(formData.year) : null,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, string[]> } };
      const data = axiosErr?.response?.data;
      if (data) {
        const msgs = Object.values(data).flat().join(' ');
        setError(msgs);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={56} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-heading mb-2">Request Submitted!</h2>
        <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto mb-6">
          Your account is under review. You'll be able to login once the placement team approves your request.
        </p>
        <Link to="/login" className="btn-ghost font-medium">← Back to Login</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8 w-full max-w-lg mx-auto">
      <div className="mb-7">
        <h1 className="text-primary font-bold text-xl mb-1">Campus Sarthi</h1>
        <h2 className="text-2xl font-bold text-heading">Request Portal Access</h2>
        <p className="text-sm text-muted mt-1">Your request will be reviewed by the placement team.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Full Name</label>
          <input name="full_name" type="text" className="form-input" placeholder="Your full name" value={formData.full_name} onChange={handleChange} required />
        </div>
        <div>
          <label className="form-label">Email Address</label>
          <input name="email" type="email" className="form-input" placeholder="college email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label className="form-label">Password</label>
          <input name="password" type="password" className="form-input" placeholder="Minimum 6 characters" value={formData.password} onChange={handleChange} required minLength={6} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Branch</label>
            <select name="branch" className="form-input" value={formData.branch} onChange={handleChange} required>
              <option value="">Select Branch</option>
              <option value="CS">Computer Science</option>
              <option value="IT">Information Technology</option>
              <option value="ENTC">Electronics & Telecom</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="form-label">Year</label>
            <select name="year" className="form-input" value={formData.year} onChange={handleChange} required>
              <option value="">Select Year</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Final Year</option>
            </select>
          </div>
        </div>
        <div>
          <label className="form-label">Phone Number</label>
          <input name="phone" type="tel" className="form-input" placeholder="10-digit phone number" value={formData.phone} onChange={handleChange} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-danger text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>
          ) : 'Submit Request'}
        </button>
      </form>

      <p className="text-sm text-center text-muted mt-5">
        Already have access? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
      </p>
    </div>
  );
}
