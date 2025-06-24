 # 0x04. Files Manager

A full-stack application for managing and storing files with user authentication, Redis caching, and MongoDB storage.

## Features

| Feature                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| User Authentication    | Sign-up, login, logout with token-based authentication                      |
| File Management        | Upload, list, view, publish/unpublish files and folders                    |
| File Preview           | View file content with support for image thumbnails                         |
| Background Processing  | Queue-based processing for thumbnails and welcome emails                    |
| Database Storage       | MongoDB for persistent data storage                                         |
| Caching                | Redis for quick access to authentication tokens                             |

## Technical Requirements

| Component           | Requirement                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| Runtime             | Node.js 12.x.x                                                              |
| Operating System    | Ubuntu 18.04 LTS                                                           |
| Editor              | vi, vim, emacs, VS Code                                                    |
| File Format         | All files must end with newline, .js extension                              |
| Linting             | ESLint                                                                      |
| Dependencies        | Install with `npm install`                                                  |

## API Endpoints

### Authentication

| Endpoint          | Method | Description                          | Requirements                      |
|-------------------|--------|--------------------------------------|-----------------------------------|
| `/users`         | POST   | Create new user                      | email, password                   |
| `/connect`       | GET    | User login                           | Basic Auth header                 |
| `/disconnect`    | GET    | User logout                          | X-Token header                    |
| `/users/me`      | GET    | Get current user info                | X-Token header                    |

### Files

| Endpoint                | Method | Description                          | Requirements                      |
|-------------------------|--------|--------------------------------------|-----------------------------------|
| `/files`               | POST   | Upload new file                      | X-Token, file details             |
| `/files/:id`           | GET    | Get file metadata                    | X-Token                           |
| `/files`               | GET    | List files (paginated)               | X-Token, optional parentId        |
| `/files/:id/publish`   | PUT    | Publish a file                       | X-Token                           |
| `/files/:id/unpublish` | PUT    | Unpublish a file                     | X-Token                           |
| `/files/:id/data`      | GET    | Get file content                     | Optional size param for images    |

### System

| Endpoint          | Method | Description                          |
|-------------------|--------|--------------------------------------|
| `/status`        | GET    | Check Redis and DB status            |
| `/stats`         | GET    | Get user and file counts             |

## Database Structure

### Redis
- Stores authentication tokens with format: `auth_<token>`
- Token expiration: 24 hours

### MongoDB Collections

#### users
```javascript
{
  email: String,       // User email (unique)
  password: String     // SHA1 hashed password
}
```
## Submission

- **GitHub Repository**: [alx-files_manager](https://github.com/Achrafsadeq/alx-files_manager)
- **Directory**: Each project has its own directory within the repository.

## Mission Director

This project is part of the ALX Software Engineering Program.

## Developer

**Codename**: Achraf Sadeq

## Acknowledgments

This repository was developed by Holberton School, in collaboration with the ALX Software Engineering Program, to provide practical, hands-on learning experiences in a professional and real-world context. It aims to equip learners with the skills and knowledge necessary to tackle complex challenges in software engineering.

