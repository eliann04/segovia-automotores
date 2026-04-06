// Este archivo contiene el inventario de vehÃ­culos.
// El cliente puede modificar este archivo para agregar, quitar o actualizar los autos.
// AsegÃºrate de que las imÃ¡genes estÃ©n guardadas en la carpeta 'img'.

const CAR_INVENTORY = [
    {
        id: "MB-C300",
        make: "Mercedes-Benz",
        model: "C300",
        year: 2017,
        price: 35000,
        kilometers: "65.000 km",
        image: "img/catalog1.png",
        motor: "2.0L Turbo",
        transmision: "AutomÃ¡tica",
        combustible: "Nafta",
        puertas: 4,
        bodytype: "SedÃ¡n",
        featured: true,
        description: "Excelente estado, Ãºnico dueÃ±o. Mantenimientos al dÃ­a en concesionario oficial.",
        images: ["img/catalog1.png", "img/catalog1.png", "img/catalog1.png", "img/catalog1.png", "img/catalog1.png", "img/catalog1.png", "img/catalog1.png", "img/catalog1.png", "img/catalog1.png"]
    },
    {
        id: "POR-MAC",
        make: "Porsche",
        model: "Macan S",
        year: 2020,
        price: 75000,
        kilometers: "30.000 km",
        image: "img/catalog1.png",
        featured: true
    },
    {
        id: "AUD-RSQ8",
        make: "Audi",
        model: "RS Q8",
        year: 2022,
        price: 130000,
        kilometers: "15.000 km",
        image: "img/catalog1.png",
        featured: true
    },
    {
        id: "BMW-M4C",
        make: "BMW",
        model: "M4 Competition",
        year: 2021,
        price: 95000,
        kilometers: "22.000 km",
        image: "img/catalog1.png",
        featured: true
    },
    {
        id: "RR-VEL",
        make: "Range Rover",
        model: "Velar",
        year: 2019,
        price: 68000,
        kilometers: "45.000 km",
        image: "img/catalog1.png",
        featured: false
    },
    {
        id: "LEX-RX",
        make: "Lexus",
        model: "RX 350",
        year: 2023,
        price: 85000,
        kilometers: "5.000 km",
        image: "img/catalog1.png",
        featured: false
    },
    {
        id: "LEX-RRRRRRX",
        make: "Lexus",
        model: "RX 350",
        year: 2023,
        price: 85000,
        kilometers: "5.000 km",
        image: "img/catalog1.png",
        featured: false
    }
];

const BRANDS_0KM = [
    {
        name: "Toyota",
        logo: "img/toyota.png",
        accentColor: "#eb0a1e"
    },
    {
        name: "Volkswagen",
        logo: "img/volkswagen.png",
        accentColor: "#00b0f0"
    },
    {
        name: "Fiat",
        logo: "img/fiat.png",
        accentColor: "#941711"
    },
    {
        name: "Renault",
        logo: "img/renault.png",
        accentColor: "#ffcc33"
    },
    {
        name: "Peugeot",
        logo: "img/logo-Peugeot.png",
        accentColor: "#262626"
    },
    {
        name: "Ford",
        logo: "img/ford.png",
        accentColor: "#003478"
    },
    {
        name: "Chevrolet",
        logo: "img/chevrolet.png",
        accentColor: "#ceac5d"
    },
    {
        name: "CitroÃ«n",
        logo: "img/citroen.png",
        accentColor: "#626367"
    },
    {
        name: "Jeep",
        logo: "img/jeep.png",
        accentColor: "#1e3120"
    }
];

const MODELS_0KM = [
    {
        id: "0km-peu-208",
        brand: "Peugeot",
        model: "208 Active",
        year: 2024,
        image: "img/catalog1.png"
    },
    {
        id: "0km-peu-2008",
        brand: "Peugeot",
        model: "2008 Feline",
        year: 2024,
        image: "img/catalog1.png"
    },
    {
        id: "0km-vw-polo",
        brand: "Volkswagen",
        model: "Polo Track",
        year: 2024,
        image: "img/catalog1.png"
    },
    {
        id: "0km-vw-taos",
        brand: "Volkswagen",
        model: "Taos Highline",
        year: 2024,
        image: "img/catalog1.png"
    },
    {
        id: "0km-ren-stepway",
        brand: "Renault",
        model: "Stepway Intens",
        year: 2024,
        image: "img/catalog1.png"
    }
];

