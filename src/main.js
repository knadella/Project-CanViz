import "./styles.css";
import { AppLayout } from "./layout/AppLayout.js";
import { createRouter } from "./router.js";

const appRoot = document.getElementById("app");
if (!appRoot) {
  throw new Error("Missing #app root element");
}

const layout = AppLayout();
appRoot.appendChild(layout.el);

const router = createRouter({
  outlet: layout.outlet,
  setTitle: (title) => {
    document.title = title ? `${title} | Canada in Data` : "Canada in Data";
  },
});

router.start();



