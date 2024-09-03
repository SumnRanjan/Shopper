const { dbConnect } = require("../config/db");
const { Collection } = require("./product");
const {v4:uuid}=require("uuid")


const kidsCollectionItems = [
    {
        category:"kid",
        name: "Pack of 4 Printed Kids T-Shirt Combo",
        image: "https://www.beawara.com/cdn/shop/products/KRnHs-PCombo57_650x.jpg?v=1680786027",
        new_price: 1299.0,
        old_price: 1900.5,
    },
    {
        category:"kid",
        name: "Mom+Dad= Me Kids T-Shirt",
        image: "https://www.beawara.com/cdn/shop/products/1_a55bb052-0407-484b-b9b5-9d4e154c0065_650x.jpg?v=1709666986",
        new_price: 1999.0,
        old_price: 2999.5,
    },
    {
        category:"kid",
        name: "Mummy Ki Jaan Kids T-Shirt",
        image: "https://www.beawara.com/cdn/shop/products/1_98295cad-b336-429e-942f-c21828a06639_650x.jpg?v=1709667021",
        new_price: 899.0,
        old_price: 1299.5,
    },
    {
        category:"kid",
        name: "ISRO: Official Logo",
        image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1705731406_1164372.jpg?format=webp&w=480&dpr=1.0",
        new_price: 1599.0,
        old_price: 2800.5,
    },
    {
        category:"kid",
        name: "Hello Kitty: Kittyverse",
        image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1722840858_2333539.jpg?format=webp&w=480&dpr=1.0",
        new_price: 1999.0,
        old_price: 2450.5,
    },
    {
        category:"kid",
        name: "Hello Kitty: Meow",
        image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1723264375_6075317.jpg?format=webp&w=480&dpr=1.0",
        new_price: 1992.0,
        old_price: 2899.5,
    },
    {
        category:"kid",
        name: "Hello Kitty: Kittyverse",
        image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1723209479_9022071.jpg?format=webp&w=480&dpr=1.0",
        new_price: 1500.0,
        old_price: 2890.5,
    },
    {
        category:"kid",
        name: "Superman: The Hero With A Job",
        image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1721047267_9947027.jpg?format=webp&w=480&dpr=1.0",
        new_price: 1500.0,
        old_price: 2800.5,
    },
    {
        category:"kid",
        name: "Harry Potter: Deathly Hallows",
        image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1724691359_6921278.jpg?format=webp&w=480&dpr=1.0",
        new_price: 1500.0,
        old_price: 2800.5,
    },
    {
        category:"kid",
        name: "Minions: Find Your Minion",
        image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1721131707_6108307.jpg?format=webp&w=480&dpr=1.0",
        new_price: 1500.0,
        old_price: 2800.5,
    },
    {
        category:"kid",
        name: "Marvel: Avengers Initiative",
        image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1718262390_7707118.jpg?format=webp&w=480&dpr=1.0",
        new_price: 1500.0,
        old_price: 2800.5,
    },
    {
        category:"kid",
        name: "Avengers: 63",
        image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1721730269_3939408.jpg?format=webp&w=480&dpr=1.0",
        new_price: 1500.0,
        old_price: 2800.5,
    },
];

dbConnect()

const insertData = async () => {
    try {
        await Collection.insertMany(kidsCollectionItems)
        console.log('Data inserted successfully')
    } catch (error) {
        console.error('Error inserting data:', error)
    } 
}

insertData()
