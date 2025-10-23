import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedTag, setDebouncedTag] = useState('');
  const [showUnpublished, setShowUnpublished] = useState(true);
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">All Articles</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <input
                type="text"
                placeholder="Filter by tags..."
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            {user && (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnpublished}
                  onChange={(e) => setShowUnpublished(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show unpublished articles</span>
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded inline-block">
                <p className="font-medium">{error}</p>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No articles found. Create your first article!</p>
            </div>
          ) : (
            articles.map((article) => (
              <div 
                key={article.id} 
                className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden ${
                  !article.is_published ? 'border-2 border-yellow-400' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-900 flex-1 pr-2">{article.title}</h2>
                    {!article.is_published && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                        DRAFT
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                    <span>By {article.author_name}</span>
                    {article.is_published && (
                      <>
                        <span>•</span>
                        <span>{new Date(article.publishing_date).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                  
                  {article.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.split(',').map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      to={`/article/${article.id}`} 
                      className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition"
                    >
                      Read More
                    </Link>
                    {user && (
                      <>
                        <Link 
                          to={`/edit/${article.id}`} 
                          className="px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
                        >
                          Edit
                        </Link>
                        {article.is_published ? (
                          <button
                            onClick={() => handleUnpublish(article.id)}
                            className="px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(article.id)}
                            className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticleList;
