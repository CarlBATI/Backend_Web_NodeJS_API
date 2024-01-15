# Backend Web API

This repository contains the Backend Web API created for the Backend Web class. The API provides endpoints for managing notes and tags, allowing users to perform CRUD (Create, Read, Update, Delete) operations.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running Migrations](#running-migrations)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Issues](#issues)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used

- Node.js
- Express.js
- MariaDB/MySQL
- Knex.js (Query Builder)
- Jest (Testing Framework)
- Supertest (HTTP assertions)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- MariaDB or MySQL: [Download and Install MariaDB](https://mariadb.com/kb/en/getting-installing-and-upgrading-mariadb/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/CarlBATI/Backend_Web_NodeJS_API.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Backend_Web_NodeJS_API
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure it with the following environment variables:

   ```
   DB_HOST=host
   DB_USER=user
   DB_PASSWORD=password
   DB_NAME=name
   ```

   Replace `host`, `user`, `password` and `name` with your mariadb credentials.

## Running Migrations

To run database migrations and set up the initial schema, use the following command:

```bash
npm run migrate
```

## Running Tests

To run tests, use the following command:

```bash
npm test
# or 
npx jest /path/to/test
```

**Note:** If running all tests at once encounters issues, try running each test separately:

*Due to an issue with open operations running all tests together results in some tests failing.*

```bash
npx jest test/notes.test.js
npx jest test/tags.test.js
```

## API Documentation

The API provides the following endpoints:

- **Notes API:**
  - Create a new note
  - Retrieve all notes
  - Retrieve a note by ID
  - Update a note by ID
  - Delete a note by ID

  API Base URL: `/api/notes`

- **Tags API:**
  - Create a new tag
  - Retrieve all tags
  - Retrieve a tag by ID

  API Base URL: `/api/tags`

For detailed API documentation, refer to the [API Documentation](DOCUMENTATION.md) section in this repository.
## Issues

If you encounter any issues or have suggestions, please [open an issue](https://github.com/your-username/backend-web-api/issues).

## Contributing

Contributions are welcome! Feel free to open a pull request or contribute to the ongoing discussions in the [issues](https://github.com/your-username/backend-web-api/issues) section.
