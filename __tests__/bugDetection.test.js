const request = require("supertest");
const app = require("../app");
const db = require("../db");
const createToken = require("../helpers/createToken");

let userToken, adminToken;

beforeAll(async () => {
  // Create tokens for regular and admin user
  userToken = createToken({ username: "regularUser", admin: false });
  adminToken = createToken({ username: "adminUser", admin: true });

  // Insert test users into the database
  await db.query(`
    INSERT INTO users (username, password, first_name, last_name, email, phone, admin) 
    VALUES ('regularUser', 'hashedPwd', 'Regular', 'User', 'reguser@example.com', '1234567890', false),
           ('adminUser', 'hashedPwd', 'Admin', 'User', 'adminuser@example.com', '0987654321', true)
  `);
});

afterEach(async () => {
  await db.query("DELETE FROM users WHERE username IN ('regularUser', 'adminUser')");
});

afterAll(async () => {
  await db.end();
});

describe("User and Authentication Tests", () => {
  
  describe("POST /auth/register", () => {
    it("should allow a new user to register", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ 
          username: "newUser", 
          password: "password123", 
          first_name: "New", 
          last_name: "User", 
          email: "newuser@example.com", 
          phone: "1111111111" 
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("token");
    });

    it("should not allow registration with an existing username", async () => {
      await request(app)
        .post("/auth/register")
        .send({ 
          username: "regularUser", 
          password: "password", 
          first_name: "Regular", 
          last_name: "User", 
          email: "reguser@example.com", 
          phone: "1234567890" 
        });

      const response = await request(app)
        .post("/auth/register")
        .send({ 
          username: "regularUser", 
          password: "newpassword123", 
          first_name: "Regular", 
          last_name: "User2", 
          email: "reguser2@example.com", 
          phone: "1234567891" 
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("already exists a user with username 'regularUser'");
    });
  });

  describe("POST /auth/login", () => {
    it("should allow a user with correct credentials to log in", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          username: "regularUser",
          password: "hashedPwd"
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should reject incorrect login credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          username: "nonexistentuser",
          password: "wrongpassword"
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Cannot authenticate");
    });
  });

  describe("PATCH /users/:username", () => {
    it("should allow an admin to update a user's data", async () => {
      const response = await request(app)
        .patch("/users/regularUser")
        .send({ 
          _token: adminToken, 
          first_name: "Updated" 
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.user.first_name).toBe("Updated");
    });

    it("should not allow non-admin users to update another user's data", async () => {
      const response = await request(app)
        .patch("/users/adminUser")
        .send({ 
          _token: userToken, 
          first_name: "NewFirstName" 
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should not allow updating with non-existent fields", async () => {
      const response = await request(app)
        .patch("/users/regularUser")
        .send({ 
          _token: adminToken, 
          nonExistentField: "Invalid" 
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("Cannot update field: nonExistentField");
    });
  });

  describe("DELETE /users/:username", () => {
    it("should allow an admin to delete a user", async () => {
      const response = await request(app)
        .delete("/users/regularUser")
        .send({ _token: adminToken });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("deleted");
    });

    it("should not allow a non-admin to delete a user", async () => {
      const response = await request(app)
        .delete("/users/adminUser")
        .send({ _token: userToken });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
  });

});












// const request = require("supertest");
// const app = require("../app");
// const db = require("../db");
// const  createToken  = require("../helpers/createToken");
// const jwt = require('jsonwebtoken');

// let userToken, adminToken;

// // Runs before all tests
// beforeAll(async () => {
//   userToken = createToken({ username: "regularUser", admin: false });
//   adminToken = createToken({ username: "adminUser", admin: true });

//   await db.query(`
//     INSERT INTO users 
//     (username, password, first_name, last_name, email, phone, admin) 
//     VALUES 
//     ('regularUser', 'hashedPwd', 'Regular', 'User', 'reguser@example.com', '1234567890', false)
//   `);
//   await db.query(`
//     INSERT INTO users 
//     (username, password, first_name, last_name, email, phone, admin) 
//     VALUES 
//     ('adminUser', 'hashedPwd', 'Admin', 'User', 'adminuser@example.com', '0987654321', true)
//   `);
// });
// // Runs before each test
// beforeEach(async () => {
// });

// // Runs after each test
// afterEach(async () => {
//   await db.query("DELETE FROM users WHERE username = 'regularUser'");
//   await db.query("DELETE FROM users WHERE username = 'adminUser'");
// });

// // Runs after all tests
// afterAll(async () => {
//   await db.end();
// });

// // Test cases
// describe("Bug Detection Tests", () => {
  
//   describe("Token Generation", () => {
//     it("should generate a token with correct username and admin status", async () => {
//       const token = createToken("testuser", true);
//       const decoded = jwt.verify(token, process.env.SECRET_KEY);
//       expect(decoded.username).toBe("testuser");
//       expect(decoded.admin).toBe(true);
//     });
  
//     it("should handle invalid inputs gracefully", async () => {
//       expect(() => createToken()).toThrow();
//     });
//   });
  

//   describe("POST /auth/register", () => {
//     it("should not allow a user to register with an existing username", async () => {
//       // First registration attempt
//       await request(app)
//         .post("/auth/register")
//         .send({ 
//           username: "testuser", 
//           password: "password", 
//           first_name: "Test", 
//           last_name: "User", 
//           email: "test@example.com", 
//           phone: "1234567890" 
//         });
  
//       // Second registration attempt with the same username
//       const response = await request(app)
//         .post("/auth/register")
//         .send({ 
//           username: "testuser", 
//           password: "newpassword", 
//           first_name: "Test", 
//           last_name: "User2", 
//           email: "test2@example.com", 
//           phone: "0987654321" 
//         });
  
//       expect(response.statusCode).toBe(400);
//       expect(response.body.message).toContain("already exists a user with username 'testuser'");
//     });
//   });
  
//   describe("POST /auth/login", () => {
//     it("should reject incorrect login credentials", async () => {
//       const response = await request(app)
//         .post("/auth/login")
//         .send({
//           username: "nonexistentuser",
//           password: "wrongpassword"
//         });
  
//       expect(response.statusCode).toBe(401);
//       expect(response.body.message).toBe("Cannot authenticate");
//     });
//   });
  
//   describe("PATCH /users/:username", () => {
//     it("should not allow non-admin users to update another user's data", async () => {
//       const response = await request(app)
//         .patch("/users/otheruser")
//         .send({ 
//           _token: userToken, // Using the userToken generated in beforeAll
//           first_name: "NewFirstName" 
//         });
    
//       expect(response.statusCode).toBe(401);
//       expect(response.body.message).toBe("Unauthorized");
//     });
//   });
  
//   describe("GET /users/:username", () => {
//     it("should return 404 for a non-existent user", async () => {
//       const response = await request(app)
//         .get("/users/nonexistentuser")
//         .send({ _token: adminToken });
  
//       expect(response.statusCode).toBe(404);
//       expect(response.body.message).toBe("No such user");
//     });
//   });

//   describe("DELETE /users/:username", () => {
//     it("should not allow a non-admin to delete a user", async () => {
//       const response = await request(app)
//         .delete("/users/someuser")
//         .send({ _token: userToken });
  
//       expect(response.statusCode).toBe(401);
//       expect(response.body.message).toBe("Unauthorized");
//     });
//   });

//   describe("PATCH /users/:username", () => {
//     it("should not allow updating with non-existent fields", async () => {
//       const response = await request(app)
//         .patch("/users/testuser")
//         .send({ 
//           _token: adminToken, 
//           nonExistentField: "should not exist" 
//         });
  
//       expect(response.statusCode).toBe(400);
//       expect(response.body.message).toContain("Cannot update nonExistentField");
//     });
//   });
  
// });

