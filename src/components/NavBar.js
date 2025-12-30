const navLinks = [
  { label: "Home", href: "#/" },
  { label: "Topics", href: "#/topics" },
  { label: "Consumer Price Index", href: "#/topics/consumer-price-index" },
];

export function NavBar() {
  const wrap = document.createElement("div");
  wrap.className = "container navBar";

  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = "#/";
  brand.textContent = "Canada in Data";

  const links = document.createElement("nav");
  links.className = "navLinks";

  for (const link of navLinks) {
    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.label;
    links.appendChild(a);
  }

  wrap.appendChild(brand);
  wrap.appendChild(links);

  return wrap;
}



