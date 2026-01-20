const { loadEnv } = require("../config/env");
const { connectDB } = require("../config/db");
const Service = require("../models/Service");

async function run() {
  loadEnv();
  await connectDB(process.env.MONGODB_URI);

  const villas = [
    {
      name: "Villa 1",
      category: "room",
      description: "Perfect for intimate gatherings and small celebrations. Villa 1 features a fully air-conditioned room with comfortable queen beds, a private pool area with videoke, and all the amenities you need for a memorable stay. Ideal for families and small groups looking for a cozy and relaxing experience.",
      inclusions: {
        roomArea: [
          "1 ROOM AIR CONDITIONED",
          "2 QUEEN BED",
          "3 EXTRA MATTRESS",
          "1 BATHROOM",
          "1 TV",
          "1 MINI SPEAKER",
          "1 SOFA BED",
          "1 COFFEE TABLE",
          "1 CABINET",
          "1 CR"
        ],
        poolArea: [
          "1 POOL",
          "1 CR",
          "VIDEOKE",
          "REFRIGERATOR",
          "OVEN",
          "1 TABLE",
          "12 CHAIRS",
          "GRILL",
          "2 ELECTRIC FAN",
          "DISPENSER NO WATER"
        ]
      },
      options: [
        {
          code: "DAY",
          name: "Day (8AM–5PM)",
          durationHours: 9,
          startTimeLabel: "8AM",
          basePrice: 8000,
          includedPax: 25,
          excessPaxFee: 120,
          notes: "Bring your own utensils. Dispenser has no water."
        },
        {
          code: "NIGHT",
          name: "Night (7PM–6AM)",
          durationHours: 11,
          startTimeLabel: "7PM",
          basePrice: 10000,
          includedPax: 25,
          excessPaxFee: 150,
          notes: "Videoke until 10PM only."
        },
        {
          code: "HOURS_22",
          name: "22 Hours",
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
          name: "Per Appliances (if you bring)",
          pricing: [
            { key: "12h", price: 200 },
            { key: "22h", price: 250 }
          ]
        }
      ]
    },
    {
      name: "Villa 2",
      category: "room",
      description: "Our most spacious villa option, perfect for larger groups and events. Villa 2 includes everything from Villa 1 plus additional amenities like gas stove, extra tables and chairs, rattan furniture, and more. With 20 tables, 3 long tables, and extensive seating, it's ideal for celebrations, reunions, and corporate events.",
      inclusions: {
        roomArea: [
          "1 ROOM AIR CONDITIONED",
          "2 QUEEN BED",
          "3 EXTRA MATTRESS",
          "1 BATHROOM",
          "1 TV",
          "1 MINI SPEAKER",
          "1 SOFA BED",
          "1 COFFEE TABLE",
          "1 CABINET",
          "1 HUMIDIFIER"
        ],
        poolArea: [
          "1 POOL",
          "1 CR",
          "VIDEOKE",
          "REFRIGERATOR",
          "OVEN",
          "1 TABLE",
          "12 CHAIRS",
          "GRILL",
          "2 ELECTRIC FAN",
          "DISPENSER NO WATER",
          "GAS STOVE (12HRS ₱350 / 22HRS ₱400)",
          "COFFEE TABLE / 3 CHAIRS",
          "1 RATTAN CHAIR",
          "20 TABLES",
          "3 LONG TABLES",
          "2 ELECTRIC FAN"
        ]
      },
      options: [
        {
          code: "DAY",
          name: "Day (8AM–5PM)",
          durationHours: 9,
          startTimeLabel: "8AM",
          basePrice: 8000,
          includedPax: 25,
          excessPaxFee: 120,
          notes: "Bring your own utensils. Dispenser has no water."
        },
        {
          code: "NIGHT",
          name: "Night (7PM–6AM)",
          durationHours: 11,
          startTimeLabel: "7PM",
          basePrice: 10000,
          includedPax: 25,
          excessPaxFee: 150,
          notes: "Videoke until 10PM only."
        },
        {
          code: "HOURS_22",
          name: "22 Hours",
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
          name: "Per Appliances (if you bring)",
          pricing: [
            { key: "12h", price: 200 },
            { key: "22h", price: 250 }
          ]
        },
        {
          code: "GAS_STOVE",
          name: "Gas Stove",
          pricing: [
            { key: "12h", price: 350 },
            { key: "22h", price: 400 }
          ]
        }
      ]
    },
    {
      name: "Villa 3",
      category: "room",
      description: "A charming villa perfect for those seeking comfort and relaxation. Villa 3 features a cozy air-conditioned room, private pool area with all essential amenities, gas stove option, and a beautiful rattan swing. With 20 tables and 3 long tables available, it's great for medium-sized gatherings and special occasions.",
      inclusions: {
        roomArea: [
          "1 ROOM AIR CONDITIONED",
          "2 QUEEN BED",
          "3 EXTRA MATTRESS",
          "1 BATHROOM",
          "1 TV",
          "1 MINI SPEAKER"
        ],
        poolArea: [
          "1 POOL",
          "1 CR",
          "VIDEOKE",
          "REFRIGERATOR",
          "OVEN",
          "1 TABLE",
          "12 CHAIRS",
          "GRILL",
          "2 ELECTRIC FAN",
          "DISPENSER NO WATER",
          "GAS STOVE (12HRS ₱350 / 22HRS ₱400)",
          "COFFEE TABLE / 3 CHAIRS",
          "1 RATTAN SWING",
          "20 TABLES",
          "3 LONG TABLES",
          "2 ELECTRIC FAN"
        ]
      },
      options: [
        {
          code: "DAY",
          name: "Day (8AM–5PM)",
          durationHours: 9,
          startTimeLabel: "8AM",
          basePrice: 8000,
          includedPax: 25,
          excessPaxFee: 120,
          notes: "Bring your own utensils. Dispenser has no water."
        },
        {
          code: "NIGHT",
          name: "Night (7PM–6AM)",
          durationHours: 11,
          startTimeLabel: "7PM",
          basePrice: 10000,
          includedPax: 25,
          excessPaxFee: 150,
          notes: "Videoke until 10PM only."
        },
        {
          code: "HOURS_22",
          name: "22 Hours",
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
          name: "Per Appliances (if you bring)",
          pricing: [
            { key: "12h", price: 200 },
            { key: "22h", price: 250 }
          ]
        },
        {
          code: "GAS_STOVE",
          name: "Gas Stove",
          pricing: [
            { key: "12h", price: 350 },
            { key: "22h", price: 400 }
          ]
        }
      ]
    }
  ];

  for (const villa of villas) {
    const doc = {
      name: villa.name,
      category: villa.category,
      description: villa.description,
      durationMinutes: 60,
      price: 0,
      isActive: true,
      images: [],
      options: villa.options,
      extras: villa.extras,
      inclusions: villa.inclusions
    };

    await Service.findOneAndUpdate({ name: doc.name, category: doc.category }, doc, {
      new: true,
      upsert: true,
      runValidators: true
    });

    console.log("Seeded villa service:", doc.name);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

