// src/App.tsx
import { Provider } from "react-redux";
import { store } from "./store/store";
import Router from "./routes/Router";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

export default App;
