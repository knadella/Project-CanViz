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
  
  // Mobile backdrop for dropdown
  const backdrop = document.createElement("div");
  backdrop.className = "dropdownBackdrop";
  backdrop.hidden = true;

  function closeDropdown() {
    dropdown.hidden = true;
    backdrop.hidden = true;
    topicsButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  
  function openDropdown() {
    dropdown.hidden = false;
    backdrop.hidden = false;
    topicsButton.setAttribute("aria-expanded", "true");
    // Prevent body scroll on mobile when dropdown is open
    if (window.innerWidth <= 640) {
      document.body.style.overflow = "hidden";
    }
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
    if (dropdown.hidden) {
      openDropdown();
    } else {
      closeDropdown();
    }
  });
  
  backdrop.addEventListener("click", () => {
    closeDropdown();
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
  
  // Close dropdown on window resize (e.g., rotating device)
  window.addEventListener("resize", () => {
    if (!dropdown.hidden && window.innerWidth > 640) {
      document.body.style.overflow = "";
    }
  });

  navContainer.appendChild(topicsButton);
  navContainer.appendChild(backdrop);
  navContainer.appendChild(dropdown);
  wrap.appendChild(brand);
  wrap.appendChild(navContainer);

  return wrap;
}



