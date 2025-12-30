import { topics } from "../data/topics.js";

export function NavBar() {
  const wrap = document.createElement("div");
  wrap.className = "container navBar";

  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = "#/";
  brand.textContent = "Canada in Data";

  const navContainer = document.createElement("nav");
  navContainer.className = "navContainer";

  const topicsButton = document.createElement("button");
  topicsButton.className = "topicsButton";
  topicsButton.textContent = "Topics";
  topicsButton.setAttribute("aria-expanded", "false");
  topicsButton.setAttribute("aria-haspopup", "true");

  const dropdown = document.createElement("div");
  dropdown.className = "topicsDropdown";
  dropdown.hidden = true;

  function closeDropdown() {
    dropdown.hidden = true;
    topicsButton.setAttribute("aria-expanded", "false");
  }

  for (const topic of topics) {
    const link = document.createElement("a");
    link.href = topic.href;
    link.textContent = topic.title;
    link.className = "dropdownLink";
    link.addEventListener("click", () => {
      closeDropdown();
    });
    dropdown.appendChild(link);
  }

  topicsButton.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.hidden = !dropdown.hidden;
    topicsButton.setAttribute("aria-expanded", String(!dropdown.hidden));
  });

  document.addEventListener("click", () => {
    closeDropdown();
  });

  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  window.addEventListener("hashchange", () => {
    closeDropdown();
  });

  navContainer.appendChild(topicsButton);
  navContainer.appendChild(dropdown);
  wrap.appendChild(brand);
  wrap.appendChild(navContainer);

  return wrap;
}



