import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";
import { routes } from "./routes";
import { store } from "./redux/app/store";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </Provider>
  );
}

export default App;
