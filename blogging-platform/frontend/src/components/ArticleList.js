import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ArticleList.css';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedTag, setDebouncedTag] = useState('');
  const [showUnpublished, setShowUnpublished] = useState(true);
  const { user, logout } = useAuth();

  // Debounce search and tag inputs
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [searchTerm]);

  useEffect(() => {
    const tagTimer = setTimeout(() => {
      setDebouncedTag(tagFilter);
    }, 500);

    return () => clearTimeout(tagTimer);
  }, [tagFilter]);

  useEffect(() => {
    fetchArticles();
  }, [debouncedSearch, debouncedTag, showUnpublished, user]);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (debouncedTag) params.tags = debouncedTag;
      if (showUnpublished && user) params.show_unpublished = 'true';
      
      const response = await articleAPI.getAll(params);
      setArticles(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedTag, showUnpublished, user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await articleAPI.delete(id);
        fetchArticles();
      } catch (err) {
        alert('Failed to delete article. You may need to be authenticated.');
      }
    }
  };

  const handlePublish = async (id) => {
    try {
      await articleAPI.publish(id);
      fetchArticles();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to publish article.');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await articleAPI.unpublish(id);
      fetchArticles();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to unpublish article.');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="article-list-container">
      <nav className="navbar">
        <h1>Blog Articles</h1>
        <div className="nav-buttons">
          {user ? (
            <>
              <span className="user-greeting">Hello, {user.username}!</span>
              <Link to="/create" className="btn btn-primary">Create Article</Link>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </nav>

      <div className="header">
        <h2>All Articles</h2>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Filter by tags..."
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="search-input"
        />
        {user && (
          <label className="unpublished-toggle">
            <input
              type="checkbox"
              checked={showUnpublished}
              onChange={(e) => setShowUnpublished(e.target.checked)}
            />
            <span>Show unpublished articles</span>
          </label>
        )}
      </div>

      <div className="articles-grid">
        {loading ? (
          <div className="loading">Loading articles...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : articles.length === 0 ? (
          <p>No articles found. Create your first article!</p>
        ) : (
          articles.map((article) => (
            <div key={article.id} className={`article-card ${!article.is_published ? 'unpublished' : ''}`}>
              <div className="article-header">
                <h2>{article.title}</h2>
                {!article.is_published && <span className="draft-badge">DRAFT</span>}
              </div>
              <div className="article-meta">
                <span>By {article.author_name}</span>
                {article.is_published && (
                  <span>{new Date(article.publishing_date).toLocaleDateString()}</span>
                )}
              </div>
              {article.tags && (
                <div className="tags">
                  {article.tags.split(',').map((tag, index) => (
                    <span key={index} className="tag">{tag.trim()}</span>
                  ))}
                </div>
              )}
              <div className="article-actions">
                <Link to={`/article/${article.id}`} className="btn btn-secondary">
                  Read More
                </Link>
                {user && (
                  <>
                    <Link to={`/edit/${article.id}`} className="btn btn-edit">
                      Edit
                    </Link>
                    {article.is_published ? (
                      <button
                        onClick={() => handleUnpublish(article.id)}
                        className="btn btn-warning"
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePublish(article.id)}
                        className="btn btn-success"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ArticleList;
