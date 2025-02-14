async function getData() {
   const loader = document.getElementById("loader");
   loader.style.display = "block";

   const url =
      "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json";
   try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
   } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
   } finally {
      loader.style.display = "none";
   }
}

function createButton(content, onClick, isActive = false) {
   const button = document.createElement("button");
   button.textContent = content;
   button.addEventListener("click", onClick);
   if (isActive) button.classList.add("active");
   return button;
}

function renderPagination(pagination, onClickPrev, onClickPage, onClickNext) {
   const { totalItems, itemsPerPage, currentPage } = pagination;

   const paginationWrapper = document.getElementById("pagination");
   const totalPages = Math.ceil(totalItems / itemsPerPage);
   const fragment = document.createDocumentFragment();

   fragment.appendChild(createButton("Prev", onClickPrev));

   for (let i = 0; i < totalPages; i++) {
      const pageButton = createButton(
         i + 1,
         () => onClickPage(i),
         i === currentPage
      );
      fragment.appendChild(pageButton);
   }

   fragment.appendChild(createButton("Next", onClickNext));
   paginationWrapper.replaceChildren(fragment);
}

function renderTableRows(data) {
   const tableBody = document.getElementById("tbody");
   const fragment = document.createDocumentFragment();

   data.forEach((row) => {
      const tr = document.createElement("tr");
      ["s.no", "percentage.funded", "amt.pledged"].forEach((key) => {
         const td = document.createElement("td");
         td.textContent = row[key];
         tr.appendChild(td);
      });
      fragment.appendChild(tr);
   });

   tableBody.replaceChildren(fragment);
}

function render(data) {
   const pagination = {
      currentPage: 0,
      itemsPerPage: 5,
      totalItems: data.length,
   };

   const { currentPage, itemsPerPage, totalItems } = pagination;

   function getPageData() {
      const start = currentPage * itemsPerPage;
      return data.slice(start, start + itemsPerPage);
   }

   function renderContent() {
      renderTableRows(getPageData());
      renderPagination(pagination, onClickPrev, onClickPage, onClickNext);
   }

   function onClickPage(page) {
      if (page === currentPage) return;
      pagination.currentPage = page;
      renderContent();
   }

   function onClickNext() {
      if (currentPage >= Math.floor(totalItems / itemsPerPage)) return;
      pagination.currentPage++;
      renderContent();
   }

   function onClickPrev() {
      if (pagination.currentPage <= 0) return;
      pagination.currentPage--;
      renderContent();
   }

   renderContent();
   document.getElementById("tableWrapper").style.display = "flex";
}

async function main() {
   document.getElementById("tableWrapper").style.display = "none";
   const data = await getData();
   render(data);
}

main();
