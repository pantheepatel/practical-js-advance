document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("addProduct").addEventListener("click", function () {
        window.location.href = `/addProduct.html`;
    });
    document.addEventListener("click", function (event) {
        if (event.target.id.includes("edit")) {
            const id = event.target.getAttribute("data-id");
            editProduct(id);
        }
        else if (event.target.id.includes("view")) {
            const id = event.target.getAttribute("data-id");
            editProduct(id, true);
        }
        else if (event.target.id.includes("delete")) {
            const id = event.target.getAttribute("data-id");
            deleteProduct(id);
        }
        else {
            console.log("somewhere in dom ")
        }
    });
    const filterById = function (func, delay) {
        let debounceTimer;
        return function (...args) {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => func.apply(this, args), delay)
        }
    }
    const filterDiv = document.getElementById('filter');
    filterDiv.addEventListener('input', filterById(function () {
        const filteredItems = items.filter((item) => {
            return item.id.includes(filterDiv.value.trim());
        })
        makeCotainers(filteredItems);
    }, 1000))
    const sortDiv = document.getElementById('sort');
    sortDiv.addEventListener('change', function () {
        const sortType = sortDiv.value;
        let sortedItems;
        if (sortType === "id") {
            sortedItems = items.sort((a, b) => a.id.localeCompare(b.id));
        } else if (sortType === "name") {
            sortedItems = items.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortType === "price") {
            sortedItems = items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        }
        makeCotainers(sortedItems);
    })
    // delete
    const deleteProduct = function (key) {
        try {
            const alertRes = confirm("Sure to delete product?");
            if (alertRes) {
                try {
                    localStorage.removeItem(key);
                    location.reload();
                } catch (error) {
                    alert("Error in deleting product.")
                }
            }
        } catch (err) {
            alert("Error in deleting product.")
        }
    }
    // for both edit and view
    const editProduct = function (id, isView = false) {
        console.log('in here edit/view : ', id, isView)
        if (isView) { window.location.href = `/addProduct.html?id=${id}&view=true`; }
        else { window.location.href = `/addProduct.html?id=${id}`; }
    }
    const localStorageLength = localStorage.length;
    const items = [];
    function getAllLocalStorageItems() {
        if (localStorageLength) {
            for (let i = 0; i < localStorageLength; i++) {
                const key = localStorage.key(i);
                const product = JSON.parse(localStorage.getItem(key));
                if (product) {
                    items.push({ id: key, ...product });
                }
            }
            return items;
        } else {
            return 0;
        }
    }

    const makeCotainers = function (func = getAllLocalStorageItems()) {
        try {
            const data = func;
            const dataLength = data.length;
            console.log("Fetched data: ", data);
            const productContainer = document.getElementById("productContainer");
            productContainer.innerHTML = ''
            if (dataLength) {
                data.forEach((item) => {
                    const product = item;
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('col-12', 'col-md-4', 'col-lg-3');
                    productDiv.innerHTML = `
                    <div class="card">
                        <img src="${product.img}" class="card-img-top" alt="${product.name}" onerror="this.onerror=null;this.src='images/no_image.jpg';">
                        <div class="card-body">
                            <p class="card-text copyText">${product.id}</p>
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text card-desc">${product.desc}</p>
                            <p class="card-text"><strong>Price:</strong> ${product.price}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between actionButtons" id="actionButton">
                            <button type="button" class="btn btn-danger" data-id="${product.id}" id="delete-${product.id}">Delete</button>
                            <button type="button" class="btn btn-success" data-id="${product.id}" id="edit-${product.id}">Edit</button>
                            <button type="button" class="btn btn-primary" data-id="${product.id}" id="view-${product.id}">View</button>
                        </div>
                    </div>
                `;
                    productContainer.appendChild(productDiv);
                })
            }
            else {
                productContainer.innerHTML += `<img src="images/noDataFound.avif" alt="no data found" class="noDataImg"/>`
            }
        } catch (err) {
            console.error("Error is from making containers: " + err);
        }
    }
    makeCotainers()
});