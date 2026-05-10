export function MenuItemSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Burger Empire Menu",
    url: "https://burger-empire.build.withdarsh.com/menu/burgers",
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "Burgers",
        hasMenuItem: [
          {
            "@type": "MenuItem",
            name: "Aloo Tikki Twist Burger",
            description:
              "Abc City's most popular veg burger. Crispy aloo tikki patty with fresh toppings.",
            offers: {
              "@type": "Offer",
              price: "69",
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url: "https://burger-empire.build.withdarsh.com/menu/burgers",
            },
            suitableForDiet: "https://schema.org/VegetarianDiet",
          },
          {
            "@type": "MenuItem",
            name: "Crispy Veg Burger",
            description:
              "Crispy vegetarian burger with signature Burger Empire sauce.",
            offers: {
              "@type": "Offer",
              price: "139",
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url: "https://burger-empire.build.withdarsh.com/menu/burgers",
            },
            suitableForDiet: "https://schema.org/VegetarianDiet",
          },
          {
            "@type": "MenuItem",
            name: "Veg King Burger",
            description:
              "Our premium veg burger — loaded, satisfying, Abc City's favourite big bite.",
            offers: {
              "@type": "Offer",
              price: "159",
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url: "https://burger-empire.build.withdarsh.com/menu/burgers",
            },
            suitableForDiet: "https://schema.org/VegetarianDiet",
          },
          {
            "@type": "MenuItem",
            name: "Paneer Wrap",
            description:
              "Soft wrap with spiced paneer filling and fresh veggies.",
            offers: {
              "@type": "Offer",
              price: "169",
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url: "https://burger-empire.build.withdarsh.com/menu/burgers",
            },
            suitableForDiet: "https://schema.org/VegetarianDiet",
          },
          {
            "@type": "MenuItem",
            name: "Peri Peri Fries",
            description:
              "Crispy fries tossed in peri peri spice. Abc City's favourite side.",
            offers: {
              "@type": "Offer",
              price: "109",
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url: "https://burger-empire.build.withdarsh.com/menu/burgers",
            },
            suitableForDiet: "https://schema.org/VegetarianDiet",
          },
          {
            "@type": "MenuItem",
            name: "White Cheese Pasta",
            description:
              "Creamy white sauce pasta. Comfort food at QSR prices.",
            offers: {
              "@type": "Offer",
              price: "209",
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url: "https://burger-empire.build.withdarsh.com/menu/burgers",
            },
            suitableForDiet: "https://schema.org/VegetarianDiet",
          },
        ],
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
