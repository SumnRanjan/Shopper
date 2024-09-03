const express = require('express')
const app = express()
const path = require('path')
const { dbConnect } = require('./config/db')
const { Collection } = require('./model/product')
const cookieParser = require('cookie-parser');
const Cart = require('./model/cart')

dbConnect()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(cookieParser())

app.get('/', async (req, res) => {
    const kid = await Collection.find({ category: "kid" })
    res.render("index", { kid })
})

app.get('/men', async (req, res) => {
    let men = await Collection.find({ category: "men" })
    res.render("men", { men })
})

app.get('/women', async (req, res) => {
    let women = await Collection.find({ category: "women" })
    res.render("women", { women })
})

app.get('/kids', async (req, res) => {
    const kid = await Collection.find({ category: "kid" })
    res.render("kids", { kid })
})

app.get('/men/:id', async (req, res) => {
    const id = req.params.id;
    const man = await Collection.findOne({ _id: id, category: "men" });
    res.render("showmen", { product: man });

});

app.get('/women/:id', async (req, res) => {
    const id = req.params.id;
    const women = await Collection.findOne({ _id: id, category: "women" });
    res.render("showwomen", { product: women });

})

app.get('/kids/:id', async (req, res) => {
    const id = req.params.id;
    const kids = await Collection.findOne({ _id: id, category: "kid" });
    res.render("showkid", { product: kids });

})

app.get('/cart', async (req, res) => {
    let cart = await Cart.findOne();
    if (!cart) {
        cart = new Cart({ items: [], totalPrice: 0 });
        await cart.save();
    }
    res.render('cart', { cart });
});

app.post('/cart/add', async (req, res) => {
    const { productId } = req.body
    const product = await Collection.findById(productId);

    let cart = await Cart.findOne();
    if (!cart) {
        cart = new Cart({ items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find((item) => item.productId.toString() === productId);

    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.price += product.new_price;
    } else {
        cart.items.push({
            productId,
            name: product.name,
            price: product.new_price,
            quantity: 1,
            image: product.image,
        });
    }

    cart.totalPrice += product.new_price;
    await cart.save();
    res.redirect('/cart');
});

app.post('/cart/update', async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne();

    if (cart) {
        const item = cart.items.find((item) => item.productId.toString() === productId);
        if (item) {
            const diff = (quantity - item.quantity) * (item.price / item.quantity);
            item.quantity = quantity;
            cart.totalPrice += diff;
        }

        await cart.save();
    }
    res.redirect('/cart');
});

app.post('/cart/remove', async (req, res) => {
    const { productId } = req.body;
    const cart = await Cart.findOne();

    if (cart) {
        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.totalPrice -= cart.items[itemIndex].price * cart.items[itemIndex].quantity;
            cart.items.splice(itemIndex, 1);
        }

        await cart.save()
    }
    res.redirect('/cart')

});

app.get('/order', async (req, res) => {
    res.render("order")
});


app.listen(3000, () => { console.log("Server Listening at 3000") })