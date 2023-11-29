Bankly Application
Introduction
Bankly is a web application designed for financial management. It offers a range of features including user authentication, profile management, and administrative functions.

Getting Started
Prerequisites
Node.js
npm (Node Package Manager)
PostgreSQL
Installation
Clone the repository:


git clone https://github.com/your-username/bankly.git
Navigate to the project directory:


cd bankly
Install npm packages:


npm install
Create a PostgreSQL database and run the provided seed files to set up the schema and initial data.

Running the Application
To start the server, run:

npm start
To run the server in development mode (with auto-restart on file changes), use:

npm run dev
Testing
To run the test suite, execute:


npm test
Test Structure
Tests are organized into two main categories:

Unit Tests: Focus on individual functions and methods.
Integration Tests: Cover the interaction between different parts of the application, such as routes and models.
Each test file corresponds to a specific component or module of the application, ensuring comprehensive coverage.

Bug Documentation
During development and testing, several bugs were identified and resolved. Below is a documentation of these bugs, the tests that catch them, and the code fixes applied.

Bug #1: Incorrect User Authentication Handling
Description: The application incorrectly handles authentication for non-existent users or wrong password inputs.
Test: it('should not authenticate with incorrect credentials', ...)
Fix: Modified User.authenticate method to handle these cases.
Bug #2: Unauthorized User Update
Description: Regular users could update other users' data.
Test: it('should not allow a regular user to update another user’s data', ...)
Fix: Added checks in PATCH /users/:username route.
Bug #3: Insecure Token Generation
Description: Token generation did not correctly handle null or undefined inputs.
Test: it('should not generate token for null or undefined inputs', ...)
Fix: Updated createToken function to validate inputs.
Bug #4: Non-Existent User Deletion
Description: Application allowed deletion of non-existent users.
Test: it('should return 404 when trying to delete a non-existent user', ...)
Fix: Added validation in User.delete method.
Bug #5: Incomplete User Registration Data
Description: Users could be registered with incomplete data.
Test: it('should not allow registration with incomplete data', ...)
Fix: Implemented input validation in POST /auth/register.
Bug #6: SQL Injection in Partial Update
Description: Potential SQL injection vulnerability in sqlForPartialUpdate.
Test: it('should prevent SQL injection in partial updates', ...)
Fix: Used parameterized queries in sqlForPartialUpdate.

