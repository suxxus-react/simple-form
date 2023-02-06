import "./App.css";
import { useState, useEffect } from "react";

type Fruit = string;

type Model = {
  fruits: Fruit[];
  selected: string[];
};

type Ui = Model & {
  dispatch: React.Dispatch<React.SetStateAction<Msg>>;
};

type SelectFruit = { type: "SelectFruit"; fruit: Fruit };

type UnselectFruit = { type: "UnselectFruit"; fruit: Fruit };

type NoOp = { type: "NoOp" };

type Msg = SelectFruit | UnselectFruit | NoOp;

function getSelected(fruit: Fruit, selected: Fruit[]) {
  return selected.includes(fruit);
}

function doSelectFruit(
  fruit: Fruit,
  selected: Fruit[],
  maxsize: number,
): Fruit[] {
  return selected.length >= maxsize
    ? [fruit, ...selected].filter((_, i, xs) => i !== xs.length - 1)
    : [fruit, ...selected];
  //
}

function doUnselectFruit(fruit: Fruit, selected: Fruit[]): Fruit[] {
  return selected.filter((f) => f !== fruit);
}

function Form({ fruits, selected, dispatch }: Ui): JSX.Element {
  return (
    <form>
      <ul>
        {fruits.map((fruit) => (
          <li key={fruit}>
            <label htmlFor={fruit}>{fruit}</label>
            <input
              id={fruit}
              type="checkbox"
              checked={getSelected(fruit, selected)}
              onChange={(evt) => {
                evt.preventDefault();
                const msg = evt.target.checked
                  ? "SelectFruit"
                  : "UnselectFruit";
                dispatch({ type: msg, fruit: evt.target.id });
              }}
            />
          </li>
        ))}
      </ul>
    </form>
  );
}

function App() {
  const intialValue: Model = {
    fruits: ["apple", "banana", "apricot", "watermelon", "grapes"],
    selected: [],
  };

  const maxsize = 2;

  const [model, setModel] = useState<Model>(intialValue);
  const [msg, setMsg] = useState<Msg>({ type: "NoOp" });

  useEffect(() => {
    //
    switch (msg.type) {
      case "SelectFruit":
        setModel({
          ...model,
          selected: doSelectFruit(msg.fruit, [...model.selected], maxsize),
        });
        break;
      case "UnselectFruit":
        setModel({
          ...model,
          selected: doUnselectFruit(msg.fruit, [...model.selected]),
        });
        break;
      case "NoOp":
        break;
    }
  }, [msg]);

  return (
    <div className="App">
      <h2>fruits</h2>
      <Form dispatch={setMsg} {...model} />
    </div>
  );
}

/*
selectedFruits = [banana, apple],


[{fruit: string, selected: boolean}]


*/

export default App;
