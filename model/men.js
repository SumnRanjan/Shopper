const { dbConnect } = require("../config/db");
const { Collection } = require("./product");
const {v4:uuid}=require("uuid")

const menCollectionItems = [
  {
    category:"men",
    name: "Men's Gardenia Drip Typography Oversized Hoodies",
    image: "https://images.bewakoof.com/t1080/men-s-gardenia-drip-typography-oversized-hoodies-597143-1724065495-1.jpg",
    new_price: 1500.0,
    old_price: 2800.5,
  },
  {
    category:"men",
    name: "OVER-DYED TWILL SHIRTLYTON - DARK GREEN",
    image: "https://thehouseofrare.com/cdn/shop/files/LYTON-DARK-GREN4580HEROHEROHERO.jpg?v=1693915853&_gl=1*1cpjgw1*_up*MQ..&gclid=Cj0KCQjw_sq2BhCUARIsAIVqmQsnfq4oE5rK9rHQsHVCEhEceznvXWg3hpRQsC-jSHvdKxKXRqAhjwUaAiJjEALw_wcB",
    new_price: 1285.0,
    old_price: 2205.5,
  },
  {
    category:"men",
    name: "PRINTED PLACKET COTTON POLOARK - DARK BEIGE",
    image: "https://thehouseofrare.com/cdn/shop/files/ARK-DARK-BEIGE-_1.jpg?v=1718704509",
    new_price: 2999.0,
    old_price: 5990.5,
  },
  {
    category:"men",
    name: "ABSTRACT PRINT SHIRT PAINTER - GREEN",
    image: "https://thehouseofrare.com/cdn/shop/files/HERO_7c109915-b917-440a-a14a-5fe90a7571ef.jpg?v=1710235193",
    new_price: 4995.0,
    old_price: 7950.5,
  },
  {
    category:"men",
    name: "DRAWSTRING RELAXED FIT TROUSERS MAKS - BLACK",
    image: "https://thehouseofrare.com/cdn/shop/files/MAKSBLACK05847-222.jpg?v=1720175902",
    new_price: 815.0,
    old_price: 1000.5,
  },
  {
    category:"men",
    name: "CARPENTER FIT CARGO JEANS VANNES - LIGHT GREEN",
    image: "https://thehouseofrare.com/cdn/shop/files/VANNESBEIGE1.jpg?v=1714734471",
    new_price: 2999.0,
    old_price: 5000.5,
  },
  {
    category:"men",
    name: "SMART POLO WITH EMBROIDERED LOGO PARETO - GREY",
    image: "https://thehouseofrare.com/cdn/shop/files/PARETO-GREY18188.jpg?v=1721988543",
    new_price: 3815.0,
    old_price: 7599.5,
  },
  {
    category:"men",
    name: "EMBROIDERED LOGO COTTON POLO FACE - RED",
    image: "https://thehouseofrare.com/cdn/shop/files/FACEREDCC04565.jpg?v=1718705074",
    new_price: 3815.0,
    old_price: 5990.5,
  },
  {
    category:"men",
    name: "FLORAL VELVET BANDI GUILD FESTIVE - CAMERO - DARK RED",
    image: "https://thehouseofrare.com/cdn/shop/files/CAMERO-DARK-RED-_11.jpg?v=1690889161",
    new_price: 8520.0,
    old_price: 6254.5,
  },
  {
    category:"men",
    name: "PREMIUM JACQUARD BANDHGALA GUILD FESTIVE - DUFFY - DARK NAVY",
    image: "https://thehouseofrare.com/cdn/shop/files/DUFFY-NAVY0392HERO.jpg?v=1691581181",
    new_price: 5815.0,
    old_price: 8990.5,
  },
  {
    category:"men",
    name: "SMART LINEN JACKET GATTER - PRINTED",
    image: "https://thehouseofrare.com/cdn/shop/files/DALIA-BLACK0874HERO.jpg?v=1697536974",
    new_price: 7115.0,
    old_price: 9952.5,
  },
  {
    category:"men",
    name: "SMART LINEN JACKET GATTER - NAVY",
    image: "https://thehouseofrare.com/cdn/shop/files/GATTERNAVY02622.jpg?v=1721040554",
    new_price: 8215.0,
    old_price: 9999.5,
  },
];

dbConnect()

 
const insertData = async () => {
  try {
    await Collection.insertMany(menCollectionItems)
    console.log('Data inserted successfully')
  } catch (error) {
    console.error('Error inserting data:', error)
  }
}

insertData()