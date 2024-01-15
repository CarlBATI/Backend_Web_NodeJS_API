# API Documentation

## Table Of Content

- [API Base URL](#api-base-url)
- [Notes API](#notes-api)
  - [Notes API Base URL](#notes-api-base-url)
  - [Routes Overview](#routes-overview)
  - [API Routes](#api-routes)
    - [Create a New Note](#create-a-new-note)
    - [Retrieve All Notes](#retrieve-all-notes)
    - [Retrieve a Note by ID](#retrieve-a-note-by-id)
    - [Update a Note by ID](#update-a-note-by-id)
    - [Delete a Note by ID](#delete-a-note-by-id)
    - [Error Handling](#error-handling)
- [Tags API Documentation](#tags-api-documentation)
  - [Routes](#routes)
    - [Create a New Tag](#create-a-new-tag)
    - [Retrieve All Tags](#retrieve-all-tags)
    - [Retrieve a Tag by ID](#retrieve-a-tag-by-id)
    - [Error Handling](#error-handling-1)

## API Base URL
The base URL for the API is `/api`.

## Notes API

This documentation outlines the API routes provided by the Notes API, which allows users to perform CRUD (Create, Read, Update, Delete) operations on notes.

### Notes API Base URL
The base URL for the Notes API is `/api/notes`.

### Routes Overview

| Method | Endpoint           | Description                       |
| ------ | ------------------ | --------------------------------- |
| `GET`  | `/api/notes/`      | Retrieve a list of all notes.     |
| `POST` | `/api/notes/`      | Create a new note.                |
| `GET`  | `/api/notes/:id`   | Retrieve a specific note by ID.   |
| `PUT`  | `/api/notes/:id`   | Update a specific note by ID.     |
| `DELETE` | `/api/notes/:id` | Delete a specific note by ID.     |

### API Routes

#### Create a New Note

**POST** `/api/notes/`

Create a new note with the specified title and content.

**Request**

- Method: **POST**
- Endpoint: `/api/notes/`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "title": "Your Note Title",
  "content": "Your Note Content"
}
```

**Response**

- Status Code: `201 Created`
- Body:

```json
{
  "id": "unique_note_id",
  "title": "Your Note Title",
  "content": "Your Note Content"
}
```

- Status Code: `400 Bad Request`
  - Occurs if the request body is invalid.

- Status Code: `500 Internal Server Error`
  - Occurs if there is a server error.

#### Retrieve All Notes

**GET** `/api/notes/`

Retrieve a list of all notes.

**Request**

- Method: **GET**
- Endpoint: `/api/notes/`

**Response**

- Status Code: `200 OK`
- Body:

```json
[
  {
    "id": "unique_note_id_1",
    "title": "Note Title 1",
    "content": "Note Content 1"
  },
  {
    "id": "unique_note_id_2",
    "title": "Note Title 2",
    "content": "Note Content 2"
  },
  // ...
]
```

- Status Code: `500 Internal Server Error`
  - Occurs if there is a server error.

#### Retrieve a Note by ID

**GET** `/api/notes/:id`

Retrieve a specific note by its unique ID.

**Request**

- Method: **GET**
- Endpoint: `/api/notes/:id`

**Response**

- Status Code: `200 OK`
- Body:

```json
{
  "id": "unique_note_id",
  "title": "Note Title",
  "content": "Note Content"
}
```

- Status Code: `404 Not Found`
  - Occurs if the requested note ID does not exist.

- Status Code: `500 Internal Server Error`
  - Occurs if there is a server error.

#### Update a Note by ID

**PUT** `/api/notes/:id`

Update the title and/or content of a specific note by its ID.

**Request**

- Method: **PUT**
- Endpoint: `/api/notes/:id`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "title": "Updated Note Title",
  "content": "Updated Note Content"
}
```

**Response**

- Status Code: `200 OK`
- Body:

```json
{
  "id": "unique_note_id",
  "title": "Updated Note Title",
  "content": "Updated Note Content"
}
```

- Status Code: `400 Bad Request`
  - Occurs if the request body is invalid.

- Status Code: `404 Not Found`
  - Occurs if the requested note ID does not exist.

- Status Code: `500 Internal Server Error`
  - Occurs if there is a server error.

#### Delete a Note by ID

**DELETE** `/api/notes/:id`

Delete a specific note by its ID.

**Request**

- Method: **DELETE**
- Endpoint: `/api/notes/:id`

**Response**

- Status Code: `204 No Content`
  - Indicates successful deletion.

- Status Code: `404 Not Found`
  - Occurs if the requested note ID does not exist.

- Status Code: `500 Internal Server Error`
  - Occurs if there is a server error.

#### Error Handling

- Status Code: `400 Bad Request`
  - Occurs for validation errors in request data.

- Status Code: `404 Not Found`
  - Occurs when a requested resource is not found.

- Status Code: `500 Internal Server Error`
  - Indicates a server error.

## Tags API Documentation

This section provides documentation for the Tags API, which manages routes related to tags.

### Routes

#### Create a New Tag

**POST** `/tags`

Create a new tag with the specified name.

**Request**

- Method: **POST**
- Endpoint: `/tags`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "name": "Your Tag Name"
}
```

**Response**

- Status Code: `201 Created`
- Body:

```json
{
  "id": "unique_tag_id",
  "name": "Your Tag Name"
}
```

- Status Code: `400 Bad Request`
  - Occurs if the request body is invalid.
  
- Status Code: `409 Conflict`
  - Occurs if there is an attempt to create a duplicate tag.

- Status Code: `500 Internal Server Error`
  - Occurs if there is a server error.

#### Retrieve All Tags

**GET** `/tags`

Retrieve a list of all tags.

**Request**

- Method: **GET**
- Endpoint: `/tags`

**Response**

- Status Code: `200 OK`
- Body:

```json
[
  {
    "id": "unique_tag_id_1",
    "

name": "Tag Name 1"
  },
  {
    "id": "unique_tag_id_2",
    "name": "Tag Name 2"
  },
  // ...
]
```

- Status Code: `500 Internal Server Error`
  - Occurs if there is a server error.

#### Retrieve a Tag by ID

**GET** `/tags/:id`

Retrieve a specific tag by its unique ID.

**Request**

- Method: **GET**
- Endpoint: `/tags/:id`

**Response**

- Status Code: `200 OK`
- Body:

```json
{
  "id": "unique_tag_id",
  "name": "Tag Name"
}
```

- Status Code: `404 Not Found`
  - Occurs if the requested tag ID does not exist.

- Status Code: `500 Internal Server Error`
  - Occurs if there is a server error.

#### Error Handling

- Status Code: `400 Bad Request`
  - Occurs for validation errors in request data.

- Status Code: `409 Conflict`
  - Occurs if there is an attempt to create a duplicate tag.

- Status Code: `404 Not Found`
  - Occurs when a requested resource is not found.

- Status Code: `500 Internal Server Error`
  - Indicates a server error.