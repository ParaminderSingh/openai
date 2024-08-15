import React from "react";
import ReactDOM from "react-dom/client";
import "./tailwind.css";
import "./globalStyles.css";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./UserContext";
import App from "./App";
import "./i18n"; // sideEffects: true

async function prepareApp() {
  // if (
  //   import.meta.env.MODE === "development" ||
  //   import.meta.env.MODE === "test"
  // ) {
  //   const { worker } = await import("./mocks/browser");
  //   return worker.start();
  // }

  // return Promise.resolve();

  const { worker } = await import("./mocks/browser");
  return worker.start();
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

prepareApp().then(() => {
  root.render(
    <React.StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </React.StrictMode>
  );
});
