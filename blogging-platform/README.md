# Full-Stack Blogging Platform

A modern full-stack blogging platform built with React, Django REST Framework, and PostgreSQL. Features a responsive UI with Tailwind CSS, user authentication, and comprehensive article management capabilities.

## 🚀 Features

### Frontend (React)
- **Modern UI**: Built with React and styled with Tailwind CSS
- **User Authentication**: Login and registration with JWT token support
- **Article Management**: Create, read, update, and delete articles
- **Real-time Search**: Search articles by title and content
- **Tag Filtering**: Filter articles by tags
- **Responsive Design**: Mobile-friendly interface
- **Rich Text Editing**: Full-featured article creation and editing

### Backend (Django REST Framework)
- **RESTful API**: Complete CRUD operations for articles
- **Advanced Filtering**: Filter by date, tags, title, and author
- **Full-text Search**: Search across title, content, and tags
- **Pagination**: Efficient data loading
- **Authentication**: Token-based authentication with permissions
- **Admin Interface**: Django admin panel for management

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Axios
- **Backend**: Django 5.1, Django REST Framework 3.15
- **Database**: PostgreSQL 16
- **Authentication**: Django's built-in authentication + JWT
- **Deployment**: Google Cloud Platform (App Engine)

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+ and npm
- PostgreSQL 12+
- pip (Python package manager)

## 🔧 Installation

### 1. Clone the Repository
```bash
cd blogging-platform
```

### 2. Backend Setup

**Create a virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**Install Python dependencies**
```bash
pip install -r requirements.txt
```

**Set up PostgreSQL database**
```bash
# Create a PostgreSQL database
psql -U postgres
CREATE DATABASE blog_db;
\q
```

**Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your database credentials
# Update DATABASE_PASSWORD with your PostgreSQL password
```

**Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

**Create a superuser**
```bash
python manage.py createsuperuser
```

### 3. Frontend Setup

**Navigate to frontend directory**
```bash
cd frontend
```

**Install dependencies**
```bash
npm install
```

**Build the frontend**
```bash
npm run build
```

This will create a production build in the `frontend/build` directory that Django will serve.

### 4. Run the Application

**From the blogging-platform directory:**
```bash
python main.py
```

The application will be available at `http://127.0.0.1:8001/`

## 🌐 Accessing the Application

- **Frontend**: http://127.0.0.1:8001/
- **API Endpoints**: http://127.0.0.1:8001/api/
- **Django Admin**: http://127.0.0.1:8001/admin/

## 📚 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register/` | Register a new user | No |
| POST | `/api/login/` | Log in a user | No |
| POST | `/api/logout/` | Log out a user | Yes |
| GET | `/api/user/` | Get current user info | Yes |
| GET | `/api/articles/` | List all articles (paginated) | No |
| GET | `/api/articles/{id}/` | Retrieve a single article | No |
| POST | `/api/articles/` | Create a new article | Yes |
| PUT | `/api/articles/{id}/` | Update an entire article | Yes (owner) |
| PATCH | `/api/articles/{id}/` | Partially update an article | Yes (owner) |
| DELETE | `/api/articles/{id}/` | Delete an article | Yes (owner) |

### Query Parameters

- `publishing_date`: Filter by exact date
- `publishing_date_after`: Filter articles published after a date
- `publishing_date_before`: Filter articles published before a date
- `tags`: Filter by tags (partial match)
- `title`: Filter by title (partial match)
- `author`: Filter by author ID
- `search`: Search across title, content, and tags
- `ordering`: Order results (e.g., `-publishing_date`, `title`)

## 🎯 Usage

### User Authentication

**Register a new account:**
1. Click "Register" in the navigation
2. Fill in username, email, and password
3. Submit to create your account

**Login:**
1. Click "Login" in the navigation
2. Enter your credentials
3. You'll be redirected to the home page

### Managing Articles

**Create an article:**
1. Log in to your account
2. Click "Create New Article"
3. Fill in title, content, and tags (comma-separated)
4. Submit to publish

**Edit an article:**
1. Navigate to your article
2. Click "Edit" button (only visible for your articles)
3. Modify the fields
4. Submit to update

**Delete an article:**
1. Navigate to your article
2. Click "Delete" button (only visible for your articles)
3. Confirm deletion

### Search and Filter

- **Search**: Use the search bar to find articles by title or content
- **Filter by Tags**: Use the tags input to filter articles with specific tags
- Results update automatically as you type

## 🏗️ Project Structure

```
blogging-platform/
├── articles/              # Django articles app
│   ├── models.py         # Article model definition
│   ├── serializers.py    # DRF serializers
│   ├── views.py          # API views
│   ├── filters.py        # Custom filter classes
│   ├── permissions.py    # Custom permissions
│   ├── urls.py           # App URL patterns
│   └── admin.py          # Admin configuration
├── blog_project/         # Django project configuration
│   ├── settings.py       # Project settings
│   ├── urls.py           # Main URL configuration
│   ├── views.py          # React serving view
│   └── serializers.py    # User serializers
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── ArticleList.js
│   │   │   ├── ArticleDetail.js
│   │   │   ├── ArticleForm.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Header.js
│   │   ├── context/      # React context
│   │   │   └── AuthContext.js
│   │   ├── services/     # API service layer
│   │   │   └── api.js
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── public/           # Static assets
│   ├── build/            # Production build
│   ├── package.json      # Node dependencies
│   └── tailwind.config.js # Tailwind configuration
├── main.py               # Application entry point
├── manage.py             # Django management script
├── requirements.txt      # Python dependencies
├── app.yaml              # Google Cloud configuration
├── .env.example          # Example environment variables
├── README.md             # This file
└── USAGE_GUIDE.md        # Detailed usage guide
```

## 🔐 Security Features

- **Authentication**: Secure user authentication with Django sessions
- **Authorization**: Article ownership verification
- **CSRF Protection**: Cross-site request forgery protection
- **CORS**: Configured for frontend-backend communication
- **Password Hashing**: Secure password storage with Django's built-in hashing
- **Input Validation**: Server-side validation for all user inputs

## 🚀 Deployment

### Google Cloud Platform (App Engine)

1. **Install Google Cloud SDK**
   ```bash
   # Follow instructions at https://cloud.google.com/sdk/docs/install
   ```

2. **Configure your project**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Deploy the application**
   ```bash
   gcloud app deploy
   ```

The `app.yaml` file contains the deployment configuration.

### Environment Variables for Production

Create a `.env` file with production values:
```env
DEBUG=False
SECRET_KEY=your-production-secret-key
DATABASE_NAME=blog_db
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

## 🧪 Development

### Running Backend Only
```bash
python manage.py runserver 8001
```

### Running Frontend in Development Mode
In a separate terminal:
```bash
cd frontend
npm start
```
This starts React on port 3000 with hot reload.

### Rebuilding Frontend for Production
```bash
cd frontend
npm run build
```

### Running Tests
```bash
python manage.py test
```

## 🐛 Troubleshooting

### CSRF Token Issues
- Clear browser cookies and cache
- Ensure you're logged in through the frontend
- Check that CSRF middleware is enabled

### Authentication Errors
- Verify credentials are correct
- Check that the user is active in Django admin
- Clear localStorage in browser dev tools

### Database Connection Issues
```bash
# Reset migrations if needed
python manage.py migrate --run-syncdb
```

### Port Already in Use
```bash
# On macOS/Linux
lsof -ti:8001 | xargs kill -9

# On Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F
```

### Frontend Build Issues
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📖 Additional Documentation

- See [USAGE_GUIDE.md](USAGE_GUIDE.md) for detailed usage instructions
- See [.env.example](.env.example) for environment variable configuration
- Django REST Framework docs: https://www.django-rest-framework.org/
- React documentation: https://react.dev/

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ using Django and React

## 🙏 Acknowledgments

- Django REST Framework for the powerful API toolkit
- React team for the excellent frontend framework
- Tailwind CSS for the utility-first CSS framework
- PostgreSQL for the robust database system
