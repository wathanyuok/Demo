# Server

## Step 1 create package

```bash
npm init -y
```

## Step 2 install package....

```bash
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod prisma
```

```bash
npx prisma init
```

## Step 3 Git

create repo in github.com

```bash
git init
git add .
git commit -m "message"
```

next Step
copy code from repo
only first time

```bash
git remote add origin 
git branch -M main
git push -u origin main
```

when update code

```bash
git add .
git commit -m "message"
git push
```

## Step 4 update package.json

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  }
}
```

and code
index.js

```js
const express = require("express");
const app = express();

// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
```

## Step 5 use middlewares

```js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

// Middlewares
app.use(cors()); // Allows cross domain
app.use(morgan("dev")); // Show log terminal
app.use(express.json()); // For read json

// Routing

// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
```

## Step 6 Routing & Controller [Register]

/controllers/auth-controller.js

```js
exports.register = (req, res, next) => {
  try {
    // code
    res.json({ message: "hello register " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error!!" });
  }
};
```

/routes/auth-route.js

```js
const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");

// @ENDPOINT http://localhost:8000/api/register
router.post("/register", authControllers.register);

// export
module.exports = router;
```

## Step 7 Create handle Error

/middlewares/error.js

```js
const handleErrors = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Something wrong!!" });
};
module.exports = handleErrors;
```

and use in index.js

```js
const handleErrors = require("./middlewares/error");

// Handle errors
app.use(handleErrors);
```

and change in try_catch

```js
exports.login = (req, res, next) => {
  //code
  try {
    console.log(aaa);
    res.json({ message: "Hello Login " });
  } catch (error) {
    next(error);
  }
};
```

when update code in Github

```bash
git add .
git commit -m "message"
git push
```

## Step 8 Validate with zod

/middlewares/validators.js

```js
const { z } = require("zod");
// npm i zod
// TEST validator
exports.registerSchema = z
  .object({
    email: z.string().email("Email ไม่ถูกต้อง"),
    firstname: z.string().min(3, "Firstname ต้องมากกว่า 3 อักขระ"),
    lastname: z.string().min(3, "Lastname ต้องมากกว่า 3 อักขระ"),
    password: z.string().min(6, "Password ต้องมากกว่า 6 อักขระ"),
    confirmPassword: z.string().min(6, "Confirm Password ต้องมากกว่า 6 อักขระ"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password ไม่ตรงกัน",
    path: ["confirmPassword"],
  });

exports.loginSchema = z.object({
  email: z.string().email("Email ไม่ถูกต้อง"),
  password: z.string().min(6, "Password ต้องมากกว่า 6 อักขระ"),
});

exports.validateWithZod = (schema) => (req, res, next) => {
  try {
    console.log("Hello middleware");
    schema.parse(req.body);
    next();
  } catch (error) {
    const errMsg = error.errors.map((item) => item.message);
    const errTxt = errMsg.join(",");
    const mergeError = new Error(errTxt);
    next(mergeError);
  }
};
```

and then update code
/routes/auth-route.js

```js
const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const {
  validateWithZod,
  registerSchema,
  loginSchema,
} = require("../middlewares/validators");

// @ENDPOINT http://localhost:8000/api/register
router.post(
  "/register",
  validateWithZod(registerSchema),
  authControllers.register
);
router.post("/login", validateWithZod(loginSchema), authControllers.login);

// export
module.exports = router;
```

## Step 9 Prisma

```bash
npx prisma db push
# or
npx prisma migrate dev --name init
```

### Config prisma

/configs/prisma.js

```js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
```

update code
Register
/controllers/auth-controller.js

```js
const prisma = require("../configs/prisma");
const createError = require("../utils/createError");
const bcrypt = require("bcryptjs");

exports.register = async (req, res, next) => {
  try {
    // Step 1 req.body
    const { email, firstname, lastname, password, confirmPassword } = req.body;
    // Step 2 validate
    // Step 3 Check already
    const checkEmail = await prisma.profile.findFirst({
      where: {
        email: email,
      },
    });
    if (checkEmail) {
      return createError(400, "Email is already exits!!!");
    }
    // Step 4 Encrypt bcrypt
    // const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, 10);
    // console.log(hashedPassword);
    // Step 5 Insert to DB
    const profile = await prisma.profile.create({
      data: {
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: hashedPassword,
      },
    });
    // Step 6 Response
    res.json({ message: "Register Success" });
  } catch (error) {
    console.log("Step 2 Catch");
    next(error);
  }
};
```

## Step 10 Login

/controllers/auth-controller.js

```js
exports.login = async (req, res, next) => {
  //code
  try {
    // Step 1 req.body
    const { email, password } = req.body;
    // Step 2 Check email and password
    const profile = await prisma.profile.findFirst({
      where: {
        email: email,
      },
    });
    if (!profile) {
      return createError(400, "Email, Password is invalid!!");
    }
    const isMatch = bcrypt.compareSync(password, profile.password);

    if (!isMatch) {
      return createError(400, "Email, Password is invalid!!");
    }

    // Step 3 Generate token
    const payload = {
      id: profile.id,
      email: profile.email,
      firstname: profile.firstname,
      lastname: profile.lastname,
      role: profile.role,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "1d",
    });

    // console.log(token);
    // Step 4 Response
    res.json({
      message: "Login Success",
      payload: payload,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};
```

## Step 11 Current-user

/controllers/auth-controller.js

```js
exports.currentUser = async (req, res, next) => {
  try {
    res.json({ message: "Hello, current user" });
  } catch (error) {
    next(error);
  }
};
```

update code in
/routes/user-route.js

```js
const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const {
  validateWithZod,
  registerSchema,
  loginSchema,
} = require("../middlewares/validators");

// @ENDPOINT http://localhost:8000/api/register
router.post(
  "/register",
  validateWithZod(registerSchema),
  authControllers.register
);
router.post("/login", validateWithZod(loginSchema), authControllers.login);

router.get("/current-user", authControllers.currentUser);
// export
module.exports = router;
```

## Step 12 User Controller & Routes

/controllers/user-controller.js

```js
// 1. List all users
// 2. Update Role
// 3. Delete User

exports.listUsers = async (req, res, next) => {
  // code
  try {
    res.json({ message: "Hello, List users" });
  } catch (error) {
    next(error);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    res.json({ message: "Hello, Update Role" });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    res.json({ message: "Hello, Delete User" });
  } catch (error) {
    next(error);
  }
};
```

/routes/user-route.js

```js
const express = require("express");
const router = express.Router();
// Import controller
const userController = require("../controllers/user-controller");

// @ENDPOINT http://localhost:8000/api/users
router.get("/users", userController.listUsers);
router.patch("/user/update-role", userController.updateRole);
router.delete("/user/:id", userController.deleteUser);

module.exports = router;
```

update index.js

```js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const handleErrors = require("./middlewares/error");
// Routing
const authRouter = require("./routes/auth-route");
const userRouter = require("./routes/user-route");
const app = express();

// Middlewares
app.use(cors()); // Allows cross domain
app.use(morgan("dev")); // Show log terminal
app.use(express.json()); // For read json

// Routing
app.use("/api", authRouter);
app.use("/api", userRouter);

// Handle errors
app.use(handleErrors);

// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
```

### when update code

```bash
git add .
git commit -m "message"
git push
```