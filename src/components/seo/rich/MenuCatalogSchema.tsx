import { cloudinaryUrl } from "@/lib/cloudinary-url";

export function MenuCatalogSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": "https://burger-empire.build.withdarsh.com/#business",
    name: "Burger Empire",
    hasMenu: {
      "@type": "Menu",
      "@id": "https://burger-empire.build.withdarsh.com/menu/burgers#menu",
      name: "Burger Empire Menu",
      description:
        "Full menu of veg burgers, wraps, fries, pasta, shakes and beverages. Prices start at ₹69.",
      url: "https://burger-empire.build.withdarsh.com/menu/burgers",
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: "Burgers",
          description: "Veg burgers from ₹69. Made fresh per order.",
          hasMenuItem: [
            {
              "@type": "MenuItem",
              name: "Aloo Tikki Twist Burger",
              description:
                "Crispy aloo tikki patty with fresh lettuce, tomato and Burger Empire's signature sauce. Abc City's most reordered burger.",
              image: cloudinaryUrl("burgerempire/menu/aloo-tikki-twist-burger"),
              suitableForDiet: [
                "https://schema.org/VegetarianDiet",
                "https://schema.org/HinduDiet",
              ],
              offers: {
                "@type": "Offer",
                price: "69",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                priceValidUntil: "2026-12-31",
              },
              nutrition: {
                "@type": "NutritionInformation",
                calories: "320 calories",
              },
            },
            {
              "@type": "MenuItem",
              name: "Crispy Veg Burger",
              description:
                "Light crispy breaded patty with fresh toppings and special sauce.",
              image: cloudinaryUrl("burgerempire/menu/crispy-veg-burger"),
              suitableForDiet: ["https://schema.org/VegetarianDiet"],
              offers: {
                "@type": "Offer",
                price: "139",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
            },
            {
              "@type": "MenuItem",
              name: "Veg King Burger",
              description: "Premium double-patty veg burger. The big one.",
              image: cloudinaryUrl("burgerempire/menu/veg-king-burger"),
              suitableForDiet: ["https://schema.org/VegetarianDiet"],
              offers: {
                "@type": "Offer",
                price: "159",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
            },
            {
              "@type": "MenuItem",
              name: "Classic Veg Burger",
              description: "The original. Simple, satisfying, made right.",
              image: cloudinaryUrl("burgerempire/menu/crispy-veg-burger"),
              suitableForDiet: ["https://schema.org/VegetarianDiet"],
              offers: {
                "@type": "Offer",
                price: "99",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
            },
          ],
        },
        {
          "@type": "MenuSection",
          name: "Wraps",
          description: "Fresh wraps with spiced paneer, veggies and chutney.",
          hasMenuItem: [
            {
              "@type": "MenuItem",
              name: "Paneer Wrap",
              description:
                "Soft wrap filled with spiced paneer, fresh veggies and mint chutney.",
              image: cloudinaryUrl("burgerempire/menu/paneer-wrap"),
              suitableForDiet: ["https://schema.org/VegetarianDiet"],
              offers: {
                "@type": "Offer",
                price: "169",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
            },
          ],
        },
        {
          "@type": "MenuSection",
          name: "Fries & Sides",
          description: "Crispy fries and loaded sides. Perfect add-ons.",
          hasMenuItem: [
            {
              "@type": "MenuItem",
              name: "Peri Peri Fries",
              description:
                "Crispy golden fries tossed in peri peri spice blend.",
              image: cloudinaryUrl("burgerempire/menu/peri-peri-fries"),
              suitableForDiet: ["https://schema.org/VegetarianDiet"],
              offers: {
                "@type": "Offer",
                price: "109",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
            },
            {
              "@type": "MenuItem",
              name: "Loaded Fries",
              description: "Fries loaded with cheese sauce and toppings.",
              image: cloudinaryUrl("burgerempire/menu/loaded-fries"),
              suitableForDiet: ["https://schema.org/VegetarianDiet"],
              offers: {
                "@type": "Offer",
                price: "149",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
            },
          ],
        },
        {
          "@type": "MenuSection",
          name: "Pasta",
          description: "Creamy pasta dishes at QSR prices.",
          hasMenuItem: [
            {
              "@type": "MenuItem",
              name: "White Cheese Pasta",
              description:
                "Creamy white sauce pasta with herbs. Comfort food at QSR price.",
              image: cloudinaryUrl("burgerempire/menu/desi-masala-crunch"),
              suitableForDiet: ["https://schema.org/VegetarianDiet"],
              offers: {
                "@type": "Offer",
                price: "209",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
            },
          ],
        },
        {
          "@type": "MenuSection",
          name: "Shakes & Beverages",
          description: "Cold coffee, shakes and refreshing drinks.",
          hasMenuItem: [
            {
              "@type": "MenuItem",
              name: "Cold Coffee",
              description:
                "Thick, creamy cold coffee. Abc City's favourite Burger Empire drink.",
              image: cloudinaryUrl("burgerempire/menu/chocolava"),
              suitableForDiet: ["https://schema.org/VegetarianDiet"],
              offers: {
                "@type": "Offer",
                price: "99",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
            },
          ],
        },
        {
          "@type": "MenuSection",
          name: "Combo Deals",
          description: "Value meal combos for groups and students.",
          hasMenuItem: [
            {
              "@type": "MenuItem",
              name: "4 Burger Combo",
              description:
                "Four burgers at one price — best value deal for groups.",
              suitableForDiet: ["https://schema.org/VegetarianDiet"],
              offers: {
                "@type": "Offer",
                price: "346",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
            },
            {
              "@type": "MenuItem",
              name: "Aloo Delight Combo",
              description:
                "Aloo Tikki Burger + fries + drink. The classic student combo.",
              suitableForDiet: ["https://schema.org/VegetarianDiet"],
              offers: {
                "@type": "Offer",
                price: "149",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
            },
          ],
        },
      ],
    },
    potentialAction: [
      {
        "@type": "OrderAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://www.zomato.com/abc-city/restaurants/burger-empire",
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
            "http://schema.org/IOSPlatform",
            "http://schema.org/AndroidPlatform",
          ],
        },
        deliveryMethod: [
          "http://purl.org/goodrelations/v1#DeliveryModePickUp",
          "http://purl.org/goodrelations/v1#DeliveryModeDirectDownload",
        ],
        priceSpecification: {
          "@type": "DeliveryChargeSpecification",
          price: "0",
          priceCurrency: "INR",
          appliesToDeliveryMethod:
            "http://purl.org/goodrelations/v1#DeliveryModeDirectDownload",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
