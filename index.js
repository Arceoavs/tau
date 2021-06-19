import pl from "tau-prolog";
const session = pl.create(1000);

// Get Node.js argument: node ./script.js item
const item = process.argv[2];

const goal = `
    item(id(ItemID), name(${item})),
    stock(item(ItemID), shop(ShopID), _, price(Price)),
    shop(id(ShopID), name(Shop), _).
`;

// Consult program, query goal, and show answers
session.consult("index.pl", {
  success: () => {
    session.query(goal, {
      success: () => {
        const showAnswer = (x) => console.log(session.format_answer(x));
        session.answers(showAnswer);
      },
      error: (err) => {
        console.log(`There was an error with the query: ${err.toString()}`);
      },
    });
  },
  error: (err) => {
    console.error(`There was an error with the program: ${err.toString()}`);
  },
});
