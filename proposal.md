# Social Media App Proposal

[trello workspace](https://trello.com/b/6MKoaEuz/backlog)


## 1. Entity-Relationship Diagram (ERD)

### Entities

1. **User**
   - Attributes:
     - `id` (Primary Key)
     - `username` (Unique)
     - `email` (Unique)
     - `password` (Hashed)
     - `fullname`
     - `profileImage` (URL or file path)
     - `contact` (Optional)
     - `boards` (Array of board IDs)
     - `posts` (Array of post IDs)

2. **Post**
   - Attributes:
     - `id` (Primary Key)
     - `title`
     - `description`?
     - `image` (URL or file path)

3. **Board**
   - Attributes:
     - `id` (Primary Key)
     - `name`
     - `user` (Foreign Key to User)
     - `posts` (Array of post IDs)

---

### Relationships

- **User** → **Post**: One-to-Many (A user can create many posts).
- **User** → **Board**: One-to-Many (A user can create many boards).
- **Board** → **Post**: Many-to-Many (A board can have many posts, and a post can belong to many boards).

---

### ERD Diagram
```
+----------------+          +----------------+          +----------------+
|     User       |          |     Post       |          |     Board      |
+----------------+          +----------------+          +----------------+
| id (PK)        |<-------->| id (PK)        |<-------->| id (PK)        |
| username       |          | title          |          | name           |
| email          |          | description ?  |          | user (FK)      |
| password       |          | image          |          | posts (Array)  |
| fullname       |          | user (FK)      |          +----------------+
| profileImage   |          |                |
| contact        |          +----------------+
| boards (Array) |
| posts (Array)  |
+----------------+

```
---



### Deployment: Heroku

## 2. Planning Material

### Features

1. **User Authentication**
   - Signup, Login, Logout.
   - Password hashing and session management.

2. **Profile Management**
   - Upload profile image.
   - Edit user details (username, email, fullname, contact).

3. **Post Management**
   - Create, read, update, and delete posts.
   - Upload images for posts.

4. **Board Management**
   - Create, read, update, and delete boards.
   - Add/remove posts to/from boards.

5. **Feed**
   - Display posts from all users.
   - Filter posts by user or board.

6. **Search**
   - Search for users, posts, or boards.

---

### Tech Stack

- **Frontend**: EJS (for server-side rendering), Tailwind CSS (for styling).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (with Mongoose for schema modeling).
- **Authentication**: Passport.js (Local Strategy).
- **File Upload**: (image uploads - will see what ca i use for that).
- **Session Management**: Express Session.

---
## 3. API Schema- **Endpoint**: 

## User APIs

### 1. Signup
- **Endpoint**: `POST /auth/signup`
- **Description**: Register a new user with a username, email, password, and full name.
- **Request Body**:
  - `username`: Unique username for the user.
  - `email`: Unique email address for the user.
  - `password`: Password for the user.
  - `fullname`: Full name of the user.
- **Response**: Returns the registered user details.

---

### 2. Login
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticate a user with their username and password.
- **Request Body**:
  - `username`: Username of the user.
  - `password`: Password of the user.
- **Response**: Returns the authenticated user details.

---

### 3. Logout
- **Endpoint**: `GET /auth/logout`
- **Description**: Log out the currently authenticated user.
- **Response**: Returns a success message.

---

### 4. Get User Profile
- **Endpoint**: `GET /users/:userId`
- **Description**: Retrieve details of a specific user by their ID.
- **Response**: Returns the user's profile details, including posts and boards.

---

### 5. Update User Profile
- **Endpoint**: `PUT /users/:userId`
- **Description**: Update the user's profile information (e.g., full name, contact, profile image).
- **Request Body**:
  - `fullname`: Updated full name of the user.
  - `contact`: Updated contact information of the user.
  - `profileImage`: Updated profile image file for the user.
- **Response**: Returns the updated user details.

---

### 6. Delete User Account
- **Endpoint**: `DELETE /users/:userId`
- **Description**: Delete a user account by its ID.
- **Response**: Returns a success message.

---

### 7. Get User's Posts
- **Endpoint**: `GET /users/:userId/posts`
- **Description**: Retrieve all posts created by a specific user.
- **Response**: Returns an array of posts created by the user.

---

### 8. Get User's Boards
- **Endpoint**: `GET /users/:userId/boards`
- **Description**: Retrieve all boards created by a specific user.
- **Response**: Returns an array of boards created by the user.

## Post APIs

### 1. Create Post
- **Endpoint**: `POST /posts`
- **Description**: Create a new post with a title, description, and image.
- **Request Body** (Form Data):
  - `title`: Title of the post.
  - `description`: Description of the post.
  - `image`: Image file for the post.
- **Response**: Returns the created post details.

---

### 2. Get All Posts
- **Endpoint**: `GET /posts`
- **Description**: Retrieve a list of all posts.
- **Response**: Returns an array of posts with their details.

---

### 3. Get Post by ID
- **Endpoint**: `GET /posts/:postId`
- **Description**: Retrieve details of a specific post by its ID.
- **Response**: Returns the post details.

---

### 4. Update Post
- **Endpoint**: `PUT /posts/:postId`
- **Description**: Update the title, description, or image of a post.
- **Request Body** (Form Data):
  - `title`: Updated title of the post.
  - `description`: Updated description of the post.
  - `image`: Updated image file for the post.
- **Response**: Returns the updated post details.

---

### 5. Delete Post
- **Endpoint**: `DELETE /posts/:postId`
- **Description**: Delete a post by its ID.
- **Response**: Returns a success message.

---

### 6. Add Post to Board
- **Endpoint**: `POST /boards/:boardId/posts`
- **Description**: Add a post to a specific board.
- **Request Body**:
  - `postId`: ID of the post to add to the board.
- **Response**: Returns the updated board details.

---

### 7. Remove Post from Board
- **Endpoint**: `DELETE /boards/:boardId/posts/:postId`
- **Description**: Remove a post from a specific board.
- **Response**: Returns the updated board details.

### The app will allow users to create profiles, upload posts, organize posts into boards, and interact with other users' content. The proposed tech stack ensures scalability, security, and a seamless user experience.


# Social Media Visuality  

## Introduction  
**Social Media Visuality** is a full-stack social media application that allows users to:  
- Interact with posts  
- Share AI-generated images  
- Access real-time weather updates  

## Key Features  

### 🔹 Dynamic UI & Background  
- **Carousel Integration**: Creates a visually engaging interface.  
- **Responsive Design**: Built using **Tailwind CSS** for a seamless experience.  

### 🔹 Third-Party API Integrations  
- **Weather API**: Displays real-time weather updates on user profiles.  
- **AI Image Generation (DeepAI)**: Allows users to create unique images for posts.  

### 🔹 AI Image Generator Implementation  
- Initially used **Stability AI**, switched to **DeepAI** for affordability.  
- Users can generate AI images based on themes for posts.  
- Premium AI-generated images enhance the user experience.  

### 🔹 Social Media Functionality  
- **Post Management**: Create, edit, update, and delete posts.  
- **Media Upload**: Upload profile pictures and images with descriptions.  
- **User Engagement**: Like and comment on posts.  
- **Activity Tracking**: View interactions on personal posts.  

## Tech Stack  

### 📌 Frontend  
- **EJS** (Server-side rendering)  
- **Tailwind CSS** (Styling and responsiveness)  

### 📌 Backend  
- **Node.js & Express.js** (Server and API management)  

### 📌 Database  
- **MongoDB with Mongoose ORM**  

### 📌 Authentication & Session Management  
- **Passport.js** (Secure login)  
- **Express Session** (Session handling)  

## Live Demo  
🚀 **Deployed on Heroku**  
🔗 **[Visuality Social Media](#)** *(Add your link here)*  

## Future Enhancements  
- ✨ **Advanced AI Image Generation**: Allow users to input detailed text descriptions for more customized images.  
- 🎨 **UI/UX Improvements**: Enhance design and accessibility for a better user experience.  
- 💬 **Expanded Features**: Introduce user-to-user messaging and more interactive elements.  

## Conclusion  
**Social Media Visuality** combines traditional social media features with AI-driven content creation and real-time updates, offering a unique and engaging experience.  

---

### 👏 Thank you for checking out this project!  
Feel free to contribute or provide feedback! 🚀  

