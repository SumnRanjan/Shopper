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
const nodemailer = require("nodemailer");
const Otp = require("./model/otp");
require("dotenv").config();



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
app.set('views', path.join(__dirname, 'views'));
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

app.get('/about', async (req, res) => {
  try {
    const userCart = await Cart.findOne({ userId: req.session.userId }).populate('userId');
    if (!userCart) {
      return res.render('about', { user: null });
    }
    const user = userCart.userId; // Populated user details
    res.render('about', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

// Contact page (GET)
app.get('/contact', (req, res) => {
  // Check if the user is logged in
  if (!req.session.userId) {
    return res.redirect('/login'); // Redirect to login page if not logged in
  }
  res.render("contact");
});

// Handle contact form submission (POST)
app.post('/submit-contact', async (req, res) => {
  // Check if the user is logged in
  if (!req.session.userId) {
    return res.redirect('/login'); // Redirect to login page if not logged in
  }

  const { name, email, message } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com', 
    to: 'recipient-email@example.com', 
    subject: 'New Contact Form Submission', 
    text: `Contact form submission from:
           Name: ${name}
           Email: ${email}
           Message: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Message sent successfully');

    res.redirect('/message-sent');
  } catch (error) {
    console.error('Error sending email:', error);

    res.redirect('/?errorMessage=There was an error sending your message. Please try again later.');
  }
});


app.get('/message-sent', (req, res) => {
  res.render('message-sent');
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

app.get("/order-confirmation", isAuthenticated, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.session.userId });

  // if (!cart || cart.items.length === 0) {
  //   return res.redirect("/order-confirmation"); 
  // }

  res.render("order-confirmation", { cart });
});

app.post("/checkout", isAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart || cart.items.length === 0) {
      return res.redirect("/cart"); 
    }


    const orderDetails = {
      userId: req.session.userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      createdAt: new Date(),
    };
    console.log("Order placed:", orderDetails);

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.redirect("/order-confirmation");
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).send("An error occurred while processing your order.");
  }
});


app.get("/logIn", async (req, res) => {
  res.render("login", { error: null });
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

    req.session.userId = user._id;
    req.session.userName = user.name;

    res.redirect("/");
  } catch (error) {
    res.status(500).render("login", {
      error: "Login error",
    });
  }
});

app.get("/signup", async (req, res) => {   
  res.render("signup", { error: null }); 
});

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
    req.session.userId = user._id;     
    req.session.userName = user.name;      
    res.redirect("/login");  // Redirect to the login page after successful signup
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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

app.get("/forgot-password", (req, res) => {
  res.render("forgot-password", { message: null, error: null });
});

// Handle Forgot Password
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("forgot-password", {
        message: null,
        error: "User with this email does not exist",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      userId: user._id,
      otp,
      expiresAt: Date.now() +1 * 60 * 1000, 
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting the password is: ${otp}`,
    });

    req.session.email = email; // Store email in session for next steps
    res.redirect("/verify-otp");
  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.render("forgot-password", {
      message: null,
      error: "An error occurred. Please try again later.",
    });
  }
});

app.get("/verify-otp", (req, res) => {
  res.render("verify-otp", { error: null });
});

app.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;

  try {
    const email = req.session.email;
    if (!email) {
      return res.redirect("/forgot-password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("verify-otp", {
        error: "Invalid session. Please try again.",
      });
    }

    const otpRecord = await Otp.findOne({ userId: user._id, otp });
    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      return res.render("verify-otp", {
        error: "Invalid or expired OTP.",
      });
    }

    req.session.verifiedUserId = user._id; // Mark user as verified in session
    await Otp.deleteMany({ userId: user._id });

    res.redirect("/reset-password");
  } catch (error) {
    console.error("Error in verify-otp:", error);
    res.render("verify-otp", {
      error: "An error occurred. Please try again later.",
    });
  }
});

// Reset Password Page
app.get("/reset-password", (req, res) => {
  if (!req.session.verifiedUserId) {
    return res.redirect("/forgot-password");
  }

  res.render("reset-password", { error: null, message: null });
});

// Handle Reset Password
app.post("/reset-password", async (req, res) => {
  const { newPassword } = req.body;

  try {
    const userId = req.session.verifiedUserId;
    if (!userId) {
      return res.redirect("/forgot-password");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.render("reset-password", {
        error: "Invalid session. Please try again.",
        message: null,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    req.session.destroy(); 
    
    return res.redirect("/login");

  } catch (error) {
    console.error("Error in reset-password:", error);
    res.render("reset-password", {
      message: null,
      error: "An error occurred. Please try again later.",
    });
  }
});


app.listen(3000, () => {
  console.log("Server Listening at 3000");
});
