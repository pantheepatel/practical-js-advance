
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("addProduct").addEventListener("click", function () {
        window.location.href = `/addProduct.html`;
    });

    // const editButton = document.getElementById("editProduct");
    // if (editButton) {
    //     editButton.addEventListener("click", function () {
    //         const id = this.getAttribute("id").split("-")[1];
    //         console.log("in edit")
    //         editProduct(id)
    //         // window.location.href = `/addProduct.html?id=${id}`;
    //     });
    // }

    // const viewButton = document.getElementById("viewProduct");
    // if (viewButton) {
    //     viewButton.addEventListener("click", function () {
    //         const id = this.getAttribute("id").split("-")[1];
    //         console.log("in view")
    //         editProduct(id, true)
    //         // window.location.href = `/addProduct.html?id=${id}&view=true`;
    //     });
    // }

    // FIXME: this is being triggered at every clicking in dom, make it specific to that btn or parent class only
    // const actionButton = document.getElementById("actionButton");
    document.addEventListener("click", function (event) {
        // console.log("clicked something ",event.target.id.includes('edit'))
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
        // console.log("came back after 3 sec")
        const filteredItems = items.filter((item) => {
            return item.id.includes(filterDiv.value.trim());
        })
        makeCotainers(filteredItems);
        // FIXME: change this time to 3 sec after all completion
    }, 1000))
    const sortDiv = document.getElementById('sort');
    sortDiv.addEventListener('change', function () {
        // console.log("value is : ", sortDiv.value)
        const sortType = sortDiv.value;
        let sortedItems;
        if (sortType === "id") {
            sortedItems = items.sort((a, b) => a.id.localeCompare(b.id)); // -1,0,1 //FIXME: watch video for this
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
            // console.log(alertRes);
            if (alertRes) {
                try {
                    localStorage.removeItem(key);
                    location.reload();
                    // alert("Deleted Successfully!")
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
            // FIXME: what if user have already stored some data on same url(if that is local url then it would create problem)
            for (let i = 0; i < localStorageLength; i++) {
                const key = localStorage.key(i);
                // console.log(key)
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
                    // console.log(index)
                    // const key = localStorage.key(index);
                    // console.log("item id is : ", item.id)
                    const product = item;
                    // console.log("product with ID:", key, product);

                    const productDiv = document.createElement('div');
                    productDiv.classList.add('col-12', 'col-md-4', 'col-lg-3');

                    let imgTag = "";
                    let local = product.img.includes("fakepath");
                    console.log(`local : ${local}`)
                    if (local) {
                        imgTag += `<img src="images/${product.img}" class="card-img-top" alt="${product.name}">`;
                    } else {
                        imgTag += `<img src="${product.img}" class="card-img-top" alt="${product.name}">`
                    }

                    productDiv.innerHTML = `
                    <div class="card">
                        ${imgTag}
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
