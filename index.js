import pl from "tau-prolog";
import express from "express";
const session = pl.create(1000);
const app = express();

const port = 3000;
app.listen(port, () =>
  console.log(`Tau app listening at http://localhost:${port}`)
);

app.get("/", async (req, res) => {
  const { plQuery } = req.query;
  const goal = buildGoal(plQuery);

  try {
    const answer = await executePrologProgram("index.pl", goal);
    res.send(answer);
  } catch (error) {
    console.error(error);
    res.send("An error occured!");
  }
});

function buildGoal(item) {
  return `
    item(id(ItemID), name(${item})),
    stock(item(ItemID), shop(ShopID), _, price(Price)),
    shop(id(ShopID), name(Shop), _).
`;
}

function executePrologProgram(prologFile, goal) {
  return new Promise((resolve, reject) => {
    session.consult(prologFile, {
      success: () => {
        session.query(goal, {
          success: () => session.answer((x) => resolve(x)),
          error: (err) => reject(err),
        });
      },
      error: (err) => reject(err),
    });
  });
}
