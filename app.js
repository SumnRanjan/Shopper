const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const { dbConnect } = require("./config/db");
const { Collection } = require("./model/product");
const cookieParser = require("cookie-parser");
const Cart = require("./model/cart");
const User = require("./model/user");
const bcrypt = require("bcrypt");

dbConnect();

app.use(
  session({
    secret: "anfuje837bfhdsbf237rbfhsb",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use((req, res, next) => {
  res.locals.user = req.session.userId
    ? {
        id: req.session.userId,
        name: req.session.userName,
      }
    : null;
  next();
});

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", async (req, res) => {
  const kid = await Collection.find({ category: "kid" });
  res.render("index", { kid });
});

app.get("/men", async (req, res) => {
  let men = await Collection.find({ category: "men" });
  res.render("men", { men });
});

app.get("/women", async (req, res) => {
  let women = await Collection.find({ category: "women" });
  res.render("women", { women });
});

app.get("/kids", async (req, res) => {
  const kid = await Collection.find({ category: "kid" });
  res.render("kids", { kid });
});

app.get("/men/:id", async (req, res) => {
  const id = req.params.id;
  const man = await Collection.findOne({ _id: id, category: "men" });
  res.render("showmen", { product: man });
});

app.get("/women/:id", async (req, res) => {
  const id = req.params.id;
  const women = await Collection.findOne({ _id: id, category: "women" });
  res.render("showwomen", { product: women });
});

app.get("/kids/:id", async (req, res) => {
  const id = req.params.id;
  const kids = await Collection.findOne({ _id: id, category: "kid" });
  res.render("showkid", { product: kids });
});


app.get("/cart", isAuthenticated, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.session.userId }); 
  if (!cart) {
    cart = new Cart({ userId: req.session.userId, items: [], totalPrice: 0 });
    await cart.save();
  }
  res.render("cart", { cart });
});
app.post("/cart/add", isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.body;
    console.log("Product ID:", productId);

    const product = await Collection.findById(productId);
    if (!product) {
      console.error("Product not found for ID:", productId);
      return res.status(404).send("Product not found");
    }

    console.log("Session Data:", req.session);

    let cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart) {
      console.log("No cart found for user. Creating a new cart.");
      cart = new Cart({ userId: req.session.userId, items: [], totalPrice: 0 });
    } else {
      console.log("Cart found:", cart);
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      console.log("Item exists in cart. Updating quantity.");
      existingItem.quantity += 1;
      existingItem.price = existingItem.quantity * product.new_price; 
    } else {
      console.log("Adding new item to cart.");
      cart.items.push({
        productId,
        name: product.name,
        price: product.new_price, 
        quantity: 1,
        image: product.image,
      });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    console.log("Updated Cart Total Price:", cart.totalPrice);

    await cart.save();
    console.log("Cart saved successfully.");
    res.redirect("/cart");
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).send("An error occurred");
  }
});

app.post("/cart/update", isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ userId: req.session.userId });

  if (cart) {
    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (item) {
      const product = await Collection.findById(productId);
      if (!product) {
        return res.status(404).send("Product not found");
      }

      item.quantity = quantity;
      item.price = quantity * product.new_price; 
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

    await cart.save();
  }

  res.redirect("/cart");
});

app.post("/cart/remove", isAuthenticated, async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ userId: req.session.userId });

  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

    await cart.save();
  }
  res.redirect("/cart");
});

app.get("/order", async (req, res) => {
  res.render("order");
});

app.get("/logIn", async (req, res) => {
  res.render("login", { error: null });
});

app.get("/signup", async (req, res) => {
  res.render("signup", { error: null });
});

app.post('/signup', (req, res) => {
  const error = 'User exists'; 
  res.render('signup', { error: error });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render("login", {
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render("login", {
        error: "Invalid credentials",
      });
    }

    // Create session
    req.session.userId = user._id;
    req.session.userName = user.name;

    res.redirect("/");
  } catch (error) {
    res.status(500).render("login", {
      error: "Login error",
    });
  }
});

// app.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     console.log(req.body);

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).render("signup", {
//         error: "User already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     req.session.userId = user._id;
//     req.session.userName = user.name;

//     res.redirect("/");
//   } catch (error) {
//     res.status(500).render("signup", {
//       error: "Signup error",
//     });
//   }
// });

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("signup", {
        error: "Email is already in use. Please try logging in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Automatically log the user in after signup
    req.session.userId = user._id;
    req.session.userName = user.name;

    res.redirect("/");
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).render("signup", {
      error: "An unexpected error occurred. Please try again later.",
    });
  }
});


app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out");
    }
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server Listening at 3000");
});
