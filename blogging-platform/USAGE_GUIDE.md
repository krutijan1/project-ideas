# Blogging Platform Usage Guide

## Getting Started

The blogging platform is now fully integrated with React frontend and Django backend running together on port 8001.

## Accessing the Application

- **Frontend**: http://127.0.0.1:8001/
- **API Endpoints**: http://127.0.0.1:8001/api/articles/
- **Django Admin**: http://127.0.0.1:8001/admin/

## Authentication

To create, edit, or delete articles, you need to be authenticated.

### Method 1: Django Admin Login (Recommended)
1. Visit http://127.0.0.1:8001/admin/
2. Log in with username: `admin` (password was set during setup)
3. Once logged in, return to http://127.0.0.1:8001/
4. You can now create/edit/delete articles

### Method 2: REST Framework Login
1. Visit http://127.0.0.1:8001/api-auth/login/
2. Log in with your Django credentials
3. Return to the main application

## Features

### 1. View Articles
- Simply visit http://127.0.0.1:8001/
- Browse all published articles
- No authentication required

### 2. Search and Filter
- **Search**: Type keywords in the search box to find articles by title or content
- **Filter by Tags**: Use the tags filter to find articles with specific tags
- Filters update results in real-time

### 3. Create Articles
1. Log in via Django admin
2. Click "Create New Article" button
3. Fill in:
   - **Title**: Article title (required)
   - **Content**: Article body (required)
   - **Tags**: Comma-separated tags (optional, e.g., "python, django, react")
4. Click "Create Article"

### 4. Edit Articles
1. Navigate to an article
2. Click "Edit" button
3. Modify the fields
4. Click "Update Article"

### 5. Delete Articles
1. Navigate to an article or article list
2. Click "Delete" button
3. Confirm deletion

## API Usage

### List Articles
```bash
curl http://127.0.0.1:8001/api/articles/
```

### Get Single Article
```bash
curl http://127.0.0.1:8001/api/articles/1/
```

### Create Article (requires authentication)
```bash
curl -X POST http://127.0.0.1:8001/api/articles/ \
  -H "Content-Type: application/json" \
  -b cookies.txt -c cookies.txt \
  -d '{
    "title": "My Article",
    "content": "Article content here",
    "tags": "python, django",
    "author": 1
  }'
```

### Filter by Tags
```bash
curl "http://127.0.0.1:8001/api/articles/?tags=python"
```

### Search Articles
```bash
curl "http://127.0.0.1:8001/api/articles/?search=django"
```

## Development

### Running Backend Only
```bash
cd blogging-platform
source venv/bin/activate
python manage.py runserver 8001
```

### Running Frontend in Development Mode
In a separate terminal:
```bash
cd blogging-platform/frontend
npm start
```
This will start React on port 3000 with hot reload.

### Rebuilding Frontend for Production
```bash
cd blogging-platform/frontend
npm run build
```
The build will be automatically served by Django.

## Troubleshooting

### CSRF Token Issues
- Make sure you're logged in via Django admin first
- The CSRF token is automatically handled by the frontend
- Clear browser cookies and try again if issues persist

### Authentication Required Errors
- You'll see 403 errors when trying to create/edit/delete without authentication
- Log in via Django admin: http://127.0.0.1:8001/admin/

### Database Issues
If you encounter database errors:
```bash
cd blogging-platform
source venv/bin/activate
python manage.py migrate
```

### Port Already in Use
```bash
lsof -ti:8001 | xargs kill -9
```

## Project Structure

```
blogging-platform/
├── articles/              # Django app
│   ├── models.py         # Article model
│   ├── serializers.py    # DRF serializers
│   ├── views.py          # API views
│   ├── filters.py        # Custom filters
│   └── admin.py          # Admin configuration
├── blog_project/         # Django project
│   ├── settings.py       # Configuration
│   ├── urls.py           # URL routing
│   └── views.py          # React serving view
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API service
│   │   └── App.js        # Main app
│   └── build/            # Production build
└── manage.py             # Django management
```

## Next Steps

1. **Create More Articles**: Build up your blog content
2. **Customize Styling**: Modify CSS files in `frontend/src/components/`
3. **Add Features**: Extend the API or frontend as needed
4. **Deploy**: Prepare for production deployment

Enjoy your blogging platform! 🎉
