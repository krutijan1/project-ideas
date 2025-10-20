import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ArticleForm.css';

function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isEdit && user) {
      fetchArticle();
    }
  }, [id, isEdit, user]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articleAPI.getById(id);
      const article = response.data;
      setFormData({
        title: article.title,
        content: article.content,
        tags: article.tags,
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (isEdit) {
        await articleAPI.update(id, formData);
      } else {
        await articleAPI.create(formData);
      }
      
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to save article';
      setError(errorMsg);
      console.error(err);
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="article-form-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="article-form-container">
      <div className="form-header">
        <Link to="/" className="back-link">← Back to Articles</Link>
        <h1>{isEdit ? 'Edit Article' : 'Create New Article'}</h1>
        <p className="auth-info">Logged in as: <strong>{user.username}</strong></p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter article title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your article content..."
            rows="15"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., python, django, react (comma-separated)"
          />
          <small>Separate tags with commas</small>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Article' : 'Create Article')}
          </button>
          <Link to="/" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ArticleForm;
