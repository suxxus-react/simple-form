import "./App.css";
import { useReducer } from "react";

type Fruit = string;

type Dispatch = (msg: Msg) => void;

type Model = {
  fruits: Fruit[];
  selected: string[];
};

type Ui = Model & {
  dispatch: Dispatch;
};

type UiCheck = {
  fruit: Fruit;
  dispatch: Dispatch;
  selected: Fruit[];
};

type SelectFruit = { type: "SelectFruit"; fruit: Fruit };

type UnselectFruit = { type: "UnselectFruit"; fruit: Fruit };

type NoOp = { type: "NoOp" };

type Msg = SelectFruit | UnselectFruit | NoOp;

// ---------------
function isChecked(fruit: Fruit, selected: Fruit[]) {
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
}

function doUnselectFruit(fruit: Fruit, selected: Fruit[]): Fruit[] {
  return selected.filter((f) => f !== fruit);
}

function Checkbox({ fruit, selected, dispatch }: UiCheck) {
  return (
    <input
      id={fruit}
      type="checkbox"
      checked={isChecked(fruit, selected)}
      onChange={(evt) => {
        const msg = evt.target.checked ? "SelectFruit" : "UnselectFruit";
        dispatch({ type: msg, fruit: evt.target.id });
      }}
    />
  );
}

function Form({ fruits, selected, dispatch }: Ui): JSX.Element {
  return (
    <form>
      <ul>
        {fruits.map((fruit) => (
          <li key={fruit}>
            <label htmlFor={fruit}>{fruit}</label>
            <Checkbox {...{ fruit, selected, dispatch }} />
          </li>
        ))}
      </ul>
    </form>
  );
}

function fruitReducer(model: Model, msg: Msg): Model {
  let result;
  const maxsize = 2;

  switch (msg.type) {
    case "SelectFruit":
      result = {
        ...model,
        selected: doSelectFruit(msg.fruit, [...model.selected], maxsize),
      };
      break;
    case "UnselectFruit":
      result = {
        ...model,
        selected: doUnselectFruit(msg.fruit, [...model.selected]),
      };
      break;
    case "NoOp":
      result = { ...model };
      break;
  }

  return result;
}

function App() {
  const intialValue: Model = {
    fruits: ["apple", "banana", "apricot", "watermelon", "grapes"],
    selected: [],
  };

  const [model, dispatch] = useReducer(fruitReducer, intialValue);

  return (
    <div className="App">
      <h2>fruits</h2>
      <Form dispatch={dispatch} {...model} />
    </div>
  );
}

export default App;
