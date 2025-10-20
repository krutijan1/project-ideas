# Blog Platform API

A RESTful API for a personal blogging platform built with Django and PostgreSQL. This API provides complete CRUD operations for managing blog articles with filtering and search capabilities.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete articles
- **Filtering**: Filter articles by publishing date, tags, title, and author
- **Search**: Full-text search across article title, content, and tags
- **Pagination**: Paginated responses for better performance
- **Authentication**: Django REST Framework authentication support
- **Admin Interface**: Django admin panel for easy management

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles/` | List all articles (paginated) |
| GET | `/api/articles/{id}/` | Retrieve a single article by ID |
| POST | `/api/articles/` | Create a new article (requires authentication) |
| PUT | `/api/articles/{id}/` | Update an entire article (requires authentication) |
| PATCH | `/api/articles/{id}/` | Partially update an article (requires authentication) |
| DELETE | `/api/articles/{id}/` | Delete an article (requires authentication) |

### Query Parameters

- `publishing_date`: Filter by exact date
- `publishing_date_after`: Filter articles published after a date
- `publishing_date_before`: Filter articles published before a date
- `tags`: Filter by tags (partial match)
- `title`: Filter by title (partial match)
- `author`: Filter by author ID
- `search`: Search across title, content, and tags
- `ordering`: Order results (e.g., `-publishing_date`, `title`)

## Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

## Installation

1. **Clone the repository**
   ```bash
   cd blogging-platform
   ```

2. **Create a virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create a PostgreSQL database
   psql -U postgres
   CREATE DATABASE blog_db;
   \q
   ```

5. **Configure environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env with your database credentials
   # Update DATABASE_PASSWORD with your PostgreSQL password
   ```

6. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Run the development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

## Usage Examples

### List all articles
```bash
curl http://localhost:8000/api/articles/
```

### Get a single article
```bash
curl http://localhost:8000/api/articles/1/
```

### Create a new article (requires authentication)
```bash
curl -X POST http://localhost:8000/api/articles/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my blog post.",
    "tags": "django, python, rest-api"
  }'
```

### Update an article
```bash
curl -X PUT http://localhost:8000/api/articles/1/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content",
    "tags": "django, updated"
  }'
```

### Delete an article
```bash
curl -X DELETE http://localhost:8000/api/articles/1/ \
  -H "Authorization: Token YOUR_TOKEN"
```

### Filter articles by tags
```bash
curl http://localhost:8000/api/articles/?tags=django
```

### Filter articles by date range
```bash
curl "http://localhost:8000/api/articles/?publishing_date_after=2024-01-01&publishing_date_before=2024-12-31"
```

### Search articles
```bash
curl http://localhost:8000/api/articles/?search=python
```

## Project Structure

```
blogging-platform/
├── articles/              # Articles app
│   ├── models.py         # Article model
│   ├── serializers.py    # DRF serializers
│   ├── views.py          # API views
│   ├── filters.py        # Filter classes
│   ├── urls.py           # App URLs
│   └── admin.py          # Admin configuration
├── blog_project/         # Project settings
│   ├── settings.py       # Django settings
│   └── urls.py           # Main URL configuration
├── manage.py             # Django management script
├── requirements.txt      # Python dependencies
├── .env.example          # Example environment variables
└── README.md            # This file
```

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/` using the superuser credentials you created.

## API Authentication

The API uses Django REST Framework's authentication. To access protected endpoints:

1. Log in through the browsable API at `http://localhost:8000/api-auth/login/`
2. Or use token authentication by obtaining a token and including it in the Authorization header

## Development

To run tests:
```bash
python manage.py test
```

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
