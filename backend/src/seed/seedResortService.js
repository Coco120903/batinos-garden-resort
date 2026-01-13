const { loadEnv } = require("../config/env");
const { connectDB } = require("../config/db");
const Service = require("../models/Service");

async function run() {
  loadEnv();
  await connectDB(process.env.MONGODB_URI);

  const doc = {
    name: "Batino’s Garden Farm Resort — Package Booking",
    category: "service",
    description:
      "Welcome to your perfect getaway destination! Whether you're planning an intimate family gathering, celebrating a special birthday, reuniting with loved ones, hosting your dream wedding, organizing team building activities, or marking any memorable occasion—we're here to make it unforgettable.\n\n" +
      "Our resort features everything you need for a complete experience: three beautifully designed swimming pools (adult, teens, and baby pools) with stunning 7-color lighting, videoke entertainment available until 10PM, spacious venue halls for your events, three comfortable cottages for rest and relaxation, fully equipped indoor and outdoor kitchens, clean bathroom and shower facilities, convenient parking for up to 13 vehicles, charming garden statues, a fun playground for the kids, and a half court for sports enthusiasts (bring your own ball). All tables and chairs are provided, so you can focus on creating wonderful memories with your guests.",
    durationMinutes: 60, // base; actual duration comes from selected option
    price: 0,
    isActive: true,
    images: [],
    options: [
      {
        code: "DAY",
        name: "Day (8AM–5PM) — no room",
        durationHours: 9,
        startTimeLabel: "8AM",
        basePrice: 8000,
        includedPax: 25,
        excessPaxFee: 120,
        notes: "Bring your own utensils. Dispenser has no water."
      },
      {
        code: "NIGHT",
        name: "Night (7PM–6AM) — 3 rooms (no AC)",
        durationHours: 11,
        startTimeLabel: "7PM",
        basePrice: 10000,
        includedPax: 25,
        excessPaxFee: 150,
        notes: "Videoke until 10PM only."
      },
      {
        code: "HOURS_22",
        name: "22 Hours — 3 rooms (no AC)",
        durationHours: 22,
        startTimeLabel: "Flexible (confirm schedule)",
        basePrice: 16000,
        includedPax: 25,
        excessPaxFee: 150,
        notes: "Schedule includes day+night blocks; confirm exact start time with admin."
      }
    ],
    extras: [
      {
        code: "APPLIANCE_FEE",
        name: "Appliances fee (if you bring)",
        pricing: [
          { key: "12h", price: 200 },
          { key: "22h", price: 250 }
        ]
      },
      {
        code: "GAS_RANGE",
        name: "Gas range (if you use)",
        pricing: [
          { key: "12h", price: 300 },
          { key: "22h", price: 350 }
        ]
      },
      {
        code: "CORKAGE_CATERING",
        name: "Corkage (catering)",
        pricing: [{ key: "flat", price: 1500 }],
        notes: "Applies if bringing catering."
      }
    ]
  };

  await Service.findOneAndUpdate({ name: doc.name, category: doc.category }, doc, {
    new: true,
    upsert: true,
    runValidators: true
  });

  console.log("Seeded resort service:", doc.name);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

