const { dbConnect } = require("../config/db");
const { Collection } = require("./product");
const {v4:uuid}=require("uuid")

const womenCollectionItems = [
    {
        category:"women",
        name: "Rareism Women Fertash Dark Multi Nylon Viscose Fabric Cut Away Sleeve Collared Neck A-Line Midi Abstract Print Dress",
        image: "https://thehouseofrare.com/cdn/shop/files/FERTASHMULTI-33211_296b6256-a245-40f1-b957-ee6786e842e1.jpg?v=1724225309",
        new_price: 2999.0,
        old_price: 4999.5,
    },
    {
        category:"women",
        name: "CUFFED SLEEVES PLAIN MINI DRESS NAMI-WHITE",
        image: "https://thehouseofrare.com/cdn/shop/files/NAMI-WHITE--42583.jpg?v=1722852945",
        new_price: 1599.0,
        old_price: 2899.5,
    },
    {
        category:"women",
        name: "CUFFED SLEEVE PLAIN TOP TEEN-BROWN",
        image: "https://thehouseofrare.com/cdn/shop/files/TEENBROWN-32917.jpg?v=1722852414",
        new_price: 1599.0,
        old_price: 3800.5,
    },
    {
        category:"women",
        name: "BELL SLEEVES GEOMETRIC PRINT TOP REGGIO-LIGHT MULTI",
        image: "https://thehouseofrare.com/cdn/shop/files/REGGIOMULTI-32928.jpg?v=1722852816",
        new_price: 1999.0,
        old_price: 4999.5,
    },
    {
        category:"women",
        name: "MOM FIT DENIM LORETO - BLUE",
        image: "https://thehouseofrare.com/cdn/shop/files/LORETO-BLUE-PRIMARY04665.jpg?v=1722851192",
        new_price: 2299.0,
        old_price: 4999.5,
    },
    {
        category:"women",
        name: "WIDE LEG DENIM MINIKO - DARK BLUE",
        image: "https://thehouseofrare.com/cdn/shop/files/MINIKO-BLUE-DARK04330.jpg?v=1722851229",
        new_price: 1999.0,
        old_price: 2300.5,
    },
    {
        category:"women",
        name: "MID RISE SHORTS CIRI - BEIGE",
        image: "https://thehouseofrare.com/cdn/shop/files/IMG_0087_979e3392-9da6-4fb0-976b-3aee51a56b50.jpg?v=1722847407",
        new_price: 4203.0,
        old_price: 7800.5,
    },
    {
        category:"women",
        name: "FLORAL PRINTED TIERED MAXI SKIRT SOLAN -MULTI",
        image: "https://thehouseofrare.com/cdn/shop/files/SOLAN-MULTI-1.jpg?v=1722852768",
        new_price: 2299.0,
        old_price: 4800.5,
    },
    {
        category:"women",
        name: "CASUAL MINI FITTED SKIRT WARHER - BLACK",
        image: "https://thehouseofrare.com/cdn/shop/files/WARHARBLACK83.jpg?v=1722849171",
        new_price: 1892.0,
        old_price: 2999.5,
    },
    {
        category:"women",
        name: "FLORAL VELVET SKIRT WITH SIDE POCKETS VELSKO - BLACK",
        image: "https://thehouseofrare.com/cdn/shop/files/VELSKO-BLACK-SKIRT3648.jpg?v=1722850351",
        new_price: 1999.0,
        old_price: 4888.5,
    },
    {
        category:"women",
        name: "TEXTURED COTTON BRUNCH SKIRT ALINA - WHITE",
        image: "https://thehouseofrare.com/cdn/shop/files/ALINA-WHITE00300.jpg?v=1722850776",
        new_price: 2999.0,
        old_price: 7999.5,
    },
    {
        category:"women",
        name: "SCHIFFLI RUFFLED SKIRT CLARISSA - RUST",
        image: "https://thehouseofrare.com/cdn/shop/files/HERO_c9833761-2906-4565-a4dc-a3ccc8eca572.jpg?v=1722847922",
        new_price: 2999.0,
        old_price: 3999.5,
    },
];

dbConnect()


const insertData = async () => {
    try {
        await Collection.insertMany(womenCollectionItems)
        console.log('Data inserted successfully')
    } catch (error) {
        console.error('Error inserting data:', error)
    }
}

insertData()
