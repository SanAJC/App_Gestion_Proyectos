// src/main.tsx o index.tsx (archivo principal de entrada)
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./index.css"; // Si tienes estilos globales

// Función para eliminar el loader inicial
const removeInitialLoader = () => {
  const loader = document.querySelector(".initial-loader");
  if (loader) {
    // Primero reducimos la opacidad y luego removemos el elemento
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.remove();
    }, 300);
  }
};

// Crear la raíz de React y renderizar la app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Eliminar el loader después de que los componentes se hayan montado
// Usamos un pequeño delay para asegurarnos que la app esté mínimamente funcional
window.addEventListener("load", () => {
  setTimeout(removeInitialLoader, 300);
});

// Si por alguna razón el evento load no se dispara (ya ocurrió antes de agregar el listener)
if (document.readyState === "complete") {
  setTimeout(removeInitialLoader, 300);
}
