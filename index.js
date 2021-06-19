import pl from "tau-prolog";
import express from "express";
const session = pl.create(1000);
const app = express();

const port = 3000;
app.listen(port, () => {
  console.log(`Tau app listening at http://localhost:${port}`);
});

app.get("/", async (req, res) => {
  const { plQuery } = req.query;
  const goal = buildGoal(plQuery);

  const answer = await executePrologProgram("index.pl", goal);
  res.send(answer);
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
          success: () =>
            session.answer((x) => resolve(session.format_answer(x))),
          error: (err) => reject(session.format_error(err)),
        });
      },
      error: (err) => reject(session.format_error(err)),
    });
  });
}
