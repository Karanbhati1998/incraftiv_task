console.log("InCraftiv");
const navUl = document.querySelector(".navbar-nav");
const mobileNavUl = document.querySelector(".mobile-nav");

async function fetchSubCategory(cat, parentDiv) {
  try {
    const res = await fetch(
      `https://ecomm.dotvik.com/v2kart/service/categories/${cat}/tree`
    );
    const { data } = await res.json();

    if (data.subCategory && data.subCategory.length > 0) {
      const gridDiv = document.createElement("div");
      gridDiv.classList.add("sub-cat");
      parentDiv.append(gridDiv);

      data.subCategory.forEach(async (e) => {
        const subCatDiv = document.createElement("div");
        subCatDiv.classList.add("sub-cat-item");
        gridDiv.append(subCatDiv);

        const h6 = document.createElement("h6");
        h6.textContent = e.categoryName;
        subCatDiv.append(h6);

        if (e.subCategory && e.subCategory.length > 0) {
          await fetchSubCategory(e.urlKey, subCatDiv);
        } else if (e.urlKey) {
          const ul = document.createElement("ul");
          subCatDiv.append(ul);
          const res = await fetch(
            `https://ecomm.dotvik.com/v2kart/service/categories/${e.urlKey}/tree`
          );
          const { data } = await res.json();
          if (data.subCategory && data.subCategory.length > 0) {
            data.subCategory.forEach((sub) => {
              const li = document.createElement("li");
              li.classList.add("dropdown-list-item");
              li.textContent = sub.categoryName;
              ul.append(li);
            });
          }
        }
      });
    }
  } catch (error) {
    console.error("Error fetching subcategory data:", error);
  }
}

async function fetchData() {
  try {
    const res = await fetch(
      "https://ecomm.dotvik.com/v2kart/service/categories/mainCategories"
    );
    const { data } = await res.json();
    data.forEach(async (e) => {
      const li = document.createElement("li");
      li.classList.add("nav-item");
      const span = document.createElement("span");
      span.classList.add("nav-link");
      span.textContent = e.categoryName;
      li.append(span);
      navUl.append(li);
      const mobileli = document.createElement("li");
      mobileli.classList.add("mobile-li");
      const mobilecat = document.createElement("div");
      const arrow = document.createElement("div");
      arrow.classList.add("text-danger");
      mobilecat.classList.add("mobileNavCat");
      const mobileimg = document.createElement("div");
      mobileimg.classList.add("nav-img");
      const img = document.createElement("img");
      img.classList.add("navImg");
      arrow.textContent = "➡";
      mobilecat.textContent = e.categoryName;
      img.setAttribute("src", e?.images[0]?.imageUrl);

      mobileli.append(mobileimg);
      mobileimg.append(img);
      mobileli.append(mobilecat);
      mobileli.append(arrow);
      mobileNavUl.append(mobileli);
      const div = document.createElement("div");
      div.classList.add("category-dropDown");
      const contDiv = document.createElement("div");
      contDiv.classList.add("container");
      div.append(contDiv);
      li.append(div);
      await fetchSubCategory(e.urlKey, contDiv);
    });
  } catch (error) {
    console.error("Error fetching main category data:", error);
  }
}
fetchData();
