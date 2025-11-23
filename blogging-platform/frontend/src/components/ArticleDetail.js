import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Article not found</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            Return to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Articles
          </Link>
          {user && article.author === user.id && (
            <div className="flex space-x-3">
              <Link 
                to={`/edit/${article.id}`} 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Edit Article
              </Link>
              <button 
                onClick={handleDelete} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Article
              </button>
            </div>
          )}
        </div>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{article.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">By {article.author_name}</span>
              </div>
              
              {article.is_published ? (
                <>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Published on {new Date(article.publishing_date).toLocaleDateString()}</span>
                  </div>
                  {article.updated_at !== article.publishing_date && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Updated on {new Date(article.updated_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                  DRAFT - Not Published
                </span>
              )}
            </div>

            {article.tags && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.split(',').map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              {article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ) : (
                  <br key={index} />
                )
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default ArticleDetail;
