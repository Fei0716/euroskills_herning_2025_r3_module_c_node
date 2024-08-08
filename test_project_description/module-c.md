# Module C - DineEase Ordering App Backend (1.5 hours)

## Overview

In this module, participants will develop the backend for the DineEase Ordering App, a crucial part of managing and processing orders within a restaurant setting. You'll be tasked with creating a backend using Node.js with Express or Laravel.

Your main objective is to construct a backend system capable of handling real-time order management. Emphasis will be on clean, maintainable code and implementing best practices in API development.

The data served by the backend is stored in a MySQL database. The database is accessed at `db.dineease.com`, port `3306`, with the username and password provided. The database name is `competitor-s`, where `s` is your station number.

The database is currently empty. Use the given SQL dump in `assets/module-c/dineease.sql` to import the data. **You can reset the database to the initial state without using the dump by sending a `POST` request to `https://module-c-s-solution.dineease/api/v1/reset-db` where `s` is your station number. You can reset the database at any time using the POST request above.**

![Database](assets/module-c/db-diagram.png)

The order application works according to the following business logic:

- The menu includes food, drinks and other products.
- The menu items are grouped into menu categories.
- The restaurant has tables where guests can sit.
- A table can only have one _open_ order at a time. When new guests sit at the table, a new order is created, and the order is closed once the guests pay and leave. The `closedAt` field of the order remains `null` until the order is closed.
- An order can contain multiple order items, each representing a food or drink item ordered by the guests.
- When payment is made at the table, the order is closed. Timestamp in the `closedAt` field will be updated by the current timestamp, indicating the order's "closed" status.
- After this, a waiter may crate another order for the same table.

You must create several endpoints, which will be available at the base URL `https://module-c-s.dineease.com/api/v1`, where `s` is your station number. **Your backend should listen on port 80**, `http` will be replaced to `https` by our server infrastructure for the deployed version.

Below is the description of the database models and endpoints, including types for each field.

## Models

### Table

- `id`: INTEGER (Primary Key)
- `name`: STRING
- `x`: INTEGER
- `y`: INTEGER
- `width`: INTEGER
- `height`: INTEGER
- `createdAt`: DATETIME
- `updatedAt`: DATETIME

### MenuCategory

- `id`: INTEGER (Primary Key)
- `name`: STRING
- `priority`: DOUBLE
- `createdAt`: DATETIME
- `updatedAt`: DATETIME

### MenuItem

- `id`: INTEGER (Primary Key)
- `name`: STRING
- `type`: ENUM('FOOD', 'DRINK', 'OTHER')
- `menuCategoryId`: INTEGER (Foreign Key)
- `price`: DECIMAL
- `createdAt`: DATETIME
- `updatedAt`: DATETIME

### Order

- `id`: INTEGER (Primary Key)
- `tableId`: INTEGER (Foreign Key on Table)
- `closedAt`: DATETIME
- `createdAt`: DATETIME
- `updatedAt`: DATETIME

### OrderItem

- `id`: INTEGER (Primary Key)
- `orderId`: INTEGER (Foreign Key on Order)
- `menuItemId`: INTEGER (Foreign Key on MenuItem)
- `quantity`: INTEGER
- `createdAt`: DATETIME
- `updatedAt`: DATETIME

### User

- `id`: INTEGER (Primary Key)
- `firstName`: STRING
- `lastName`: STRING
- `username`: STRING
- `email`: STRING
- `pin`: STRING
- `password`: STRING
- `role`: ENUM('ADMIN', 'WAITER', 'MANAGER')
- `createdAt`: DATETIME
- `updatedAt`: DATETIME

## Authentication

All endpoints, except for the login endpoints, require a valid token in the `Authorization` header. The token is obtained through one of the login endpoints. The token should be sent in the format `Bearer <token>`.

For simplicity, the token returned upon successful login should be always an md5 hash of the user's `username`. This token should be stored in the database and used for authentication.

_Hint:_ MD5 hash in Node.js can be generated using the following code:

```javascript
const crypto = require("crypto");
const hash = crypto.createHash("md5").update("some_string").digest("hex");
```

**Example:** For a user with username `jdoe`, after a successful login, the following header should be sent with all requests to the API:

```
Authorization: Bearer a31405d272b94e5d12e9a52a665d3bfe
```

The user can log in with a username and password or a PIN code.

The user's role is determined by the `role` field in the `User` model. Only users with the `ADMIN` role can authenticate with username and password through the `/login` endpoint, and only users with the `WAITER` role can authenticate with PIN code through the `/login/pin` endpoint.

Also for simplicity, passwords and PIN codes are stored in plain text in the database.

With the `/logout` endpoint, the token should be invalidated and removed from the database.

For any other endpoint, if the token is not valid or missing, the response should be `401 Unauthorized`.

## Endpoints

Below is a brief description of the endpoints you need to implement. The accurate technical details of the endpoints implemented by the backend are contained in the [`assets/module-c/dineease_openapi.yaml`](assets/module-c/dineease_openapi.yaml) file in OpenAPI format. **If you see `DO NOT IMPLEMENT` in the summary for an endpoint, you don't need to create that endpoint, but the working backend solution we provide will include those endpoints, so you can use them in future modules**.

In Visual Studio Code, `Thunder Client`, `Swagger Viewer` and `OpenAPI (Swagger) Editor` extensions are installed to make OpenAPI documentation easier to use.

You can import the OpenAPI file directly into Thunder Client, but you can also import the Thunder Client collection for testing APIs from [`assets/module-c/dineease_thunderclient.json`](assets/module-c/dineease_thunderclient.json). After importing, you can set the `baseUrl` environment variable in your Thunder Client according to your needs.

You can also use the `Swagger Viewer` extension to preview the OpenAPI documentation in a more readable format by right-clicking on the file and selecting `Preview Swagger`.

**All endpoint paths must start with the prefix `/api/v1`.**

### Authentication

- `POST /login` - Authenticate users by username and password. Only users with `ADMIN` role can be authenticated with this endpoint. Returns a token upon successful authentication, which is an md5 hash of the user's `username`. A `401 Unauthorized` message should be returned if the user is not found, the password is incorrect, or the user does not have the `ADMIN` role.

- `POST /login/pin` - Authenticate users by PIN code. Only users with `WAITER` role can be authenticated. Returns a token upon successful authentication, which is an md5 hash of the user's `username`. A `401 Unauthorized` message should be returned if the user is not found, the PIN code is incorrect, or the user does not have the `WAITER` role.

- `POST /logout` - Invalidates the token and removes it from the database.

### Menu Categories

- `GET /menuCategories` - Returns all the menu categories into which the items on the menu are classified. The order is determined by the `priority` field. The item with the lowest priority value will be at the top and the item with the highest priority value will be at the bottom.

### Menu Items

- `GET /menuItems` - Returns all the items on the menu
- `POST /menuItems` - Creates a new menu item
  - if one of the fields is missing (`name`, `type`, `menuCategoryId`, `price`) a `400 Bad Request` response should be returned with the message `One of the mandatory fields is missing`
  - if the `menuCategoryId` does not exist in the database, a `400 Bad Request` response should be returned with the message `Menucard category with the given ID does not exist`
  - if the `type` is not one of the allowed values (`FOOD`, `DRINK`, `OTHER`), a `400 Bad Request` response should be returned with the message `Value of the type field is invalid`
- `PUT /menuItems/{id}` - Updates data for a menu item
  - if the menu item with the given ID does not exist, a `404 Not Found` response should be returned with the message `Menu item not found`
- `DELETE /menuItems/{id}` - Delete a menu item

### Orders

- `POST /orders` - Creates a new order for a table.
  - if there is already an open order for the table, a `400 Bad Request` response should be returned with the message `Table already has an open order`
  - if there is no such table, a `404 Not Found` response should be returned with the message `Table not found`
- `GET /orders/tables/{tableId}` - Returns the open (unclosed) order of a given table. The response will also include the order items of the order.
  - if there is no open order for the table or the table does not exist, a `404 Not Found` response should be returned with the message `Order not found`
- `PUT /orders/table/{tableId}/close` - Closes an order for a table.
  - if there is no open order for the table, a `404 Not Found` response should be returned with the message `Order not found`

### Order Items

- `POST /orderItems` - Creates a new order item.
  - if the order does not exist or is closed, a `400 Bad Request` response should be returned.

### Statistics

- `GET /stats` - Returns current sales statistics, including total revenue and total quantity sold per menu item, also including open orders.

## Fully functional backend solution

We provide a fully functional solution for the backend that you can use for testing. The backend solution that uses your database is
https://module-c-s-solution.dineease.com, where `s` is your station number.

Additional endpoints, which are included in the backend solution:

### Menu Categories

- `POST /menuCategories` - Creates a new menu category.
- `DELETE /menuCategories/{id}` - Deletes a menu category.
- `PUT /menuCategories/{id}` - Updates data for a menu category.

### Orders

- `GET /orders` - Returns all orders

### Tables

- `GET /tables` - Returns the list of all tables provided for restaurant guests. The table elements contain the `x`, `y`, `width` and `height` data needed to display the table map.

### Reset Database

- `POST /reset-db` - Resets the database to the original state.

## Evaluation

Before the evaluation, the database will be reset.

Submissions will be evaluated based on the following criteria:

- **Functionality**: All endpoints must perform as specified, correctly handling different scenarios as outlined in the business logic.
- **Code Quality**: The code should be clean, well-organized, and follow best practices for the chosen technology stack (Node.js with Express or Laravel). Proper error handling and input validation are expected according to the OpenAPI documentation.
- **Database Interaction**: Efficient use of the database is crucial.
