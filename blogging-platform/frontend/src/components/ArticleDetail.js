import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import './ArticleDetail.css';

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articleAPI.getById(id);
      setArticle(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await articleAPI.delete(id);
        navigate('/');
      } catch (err) {
        alert('Failed to delete article. You may need to be authenticated.');
      }
    }
  };

  if (loading) return <div className="loading">Loading article...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!article) return <div className="error">Article not found</div>;

  return (
    <div className="article-detail-container">
      <div className="article-header">
        <Link to="/" className="back-link">← Back to Articles</Link>
        <div className="article-actions">
          <Link to={`/edit/${article.id}`} className="btn btn-edit">
            Edit Article
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete Article
          </button>
        </div>
      </div>

      <article className="article-content">
        <h1>{article.title}</h1>
        
        <div className="article-meta">
          <span className="author">By {article.author_name}</span>
          {article.is_published ? (
            <>
              <span className="date">
                Published on {new Date(article.publishing_date).toLocaleDateString()}
              </span>
              {article.updated_at !== article.publishing_date && (
                <span className="updated">
                  Updated on {new Date(article.updated_at).toLocaleDateString()}
                </span>
              )}
            </>
          ) : (
            <span className="draft-status">Draft - Not Published</span>
          )}
        </div>

        {article.tags && (
          <div className="tags">
            {article.tags.split(',').map((tag, index) => (
              <span key={index} className="tag">{tag.trim()}</span>
            ))}
          </div>
        )}

        <div className="article-body">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

export default ArticleDetail;
