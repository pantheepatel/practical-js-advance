const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const isViewMode = (urlParams.get("view") === "true");
const isEditMode = (productId && !isViewMode) ? true : false;
document.getElementById("formTitle").innerText = `Product ${isViewMode ? "View" : (isEditMode ? "Edit" : "Add")} Form`
// disable all fields for view mode
if (isViewMode) {
    console.log("Viewing product");
    document.querySelectorAll("input, textarea, button").forEach(ele => ele.disabled = true);
}
// get product details from localtorage for edit/view
if (isEditMode || isViewMode) {
    console.log("Getting product with ID:", productId);
    const fetchedItem = JSON.parse(localStorage.getItem(productId));
    console.log(fetchedItem)
    if (fetchedItem) {
        // console.log(fetchedItem.name)
        for (let field in fetchedItem) {
            let field_ = `product${field.charAt(0).toLocaleUpperCase() + field.slice(1)}`
            // console.log(field_)
            let inputElement = document.getElementById(field_);
            if (inputElement) {
                // console.log(fetchedItem[field])
                inputElement.value = fetchedItem[field];
            } else {
                console.warn(`Field_ ${field_} does not exist in the form`);
            }
        }
        let imgEle = document.getElementById("viewImg");
        imgEle.src = fetchedItem.img;
        imgEle.alt = fetchedItem.productName;
        console.log("hi")
        console.log(fetchedItem.productName, fetchedItem.img)
    } else {
        alert("Product not found in LocalStorage.")
    }
} else {
    console.log("Add product page")
}

function createValidator() {
    const patternURL = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/;
    return {
        required: function (field) {
            return function (value) {
                return value.trim() !== "" ? "" : `${field} is required.`;
            };
        },
        isNumber: function (field) {
            return function (value) {
                return !isNaN(value) && value.trim() !== "" ? "" : `${field} must be a number.`;
            };
        },
        checkURL: function (field) {
            return function (value) {
                return patternURL.test(value);
            }
        }
    };
}

const validator = createValidator();
const validateName = validator.required("Product Name");
const validatePrice = validator.required("Price");
const validateDesc = validator.required("Desciption");
const validateImg = validator.required("Image");
const validatePriceNum = validator.isNumber("Price");
const validateImgURL = validator.checkURL("URL");
class Product {
    constructor(pname, price, desc, img) {
        this.name = pname;
        this.price = price;
        this.desc = desc;
        this.img = img
    }
}
function validateForm() {
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const desc = document.getElementById("productDesc").value;
    const img = document.getElementById("productImg").value;

    // selecting all error span elements
    const errorSpans = document.querySelectorAll(".requiredError");
    errorSpans.forEach(span => (span.innerText = "")); // to clear all previous errors

    let errors = 0;

    function setError(id, message) {
        if (message) {
            document.getElementById(id).innerText = message;
            errors++;
        }
    }

    setError("nameError", validateName(name));
    setError("priceError", validatePrice(price));
    setError("priceError", validatePriceNum(price));
    setError("descError", validateDesc(desc));
    setError("imgError", validateImg(img));
    setError("imgError", validateImgURL(img));

    if (errors === 0) {
        return new Product(name, price, desc, img);
    }

    return null; // validation fail
}
const form_ = document.getElementById("productAddForm");
form_.addEventListener("submit", function (e) {
    e.preventDefault();
    const product = validateForm();
    // alert(JSON.stringify(product))
    if (validateForm()) {
        // FIXME: add this form data into localstorage, also reset only when product is added into localstorage
        // give toaster for not added to localstorage, added successfully
        if (!isViewMode && !isEditMode) {
            try {
                const id = uuid.v4();
                localStorage.setItem(id, JSON.stringify(product));
                alert("Product added successfully.");
                form_.reset();
            } catch (error) {
                console.error("Error adding product to localStorage:", error);
                alert("There was an error adding the product. Please try again.");
            }
        } else {
            try {
                localStorage.setItem(productId, JSON.stringify(product));
                alert("Product updated successfully.");
                form_.reset();
            } catch (error) {
                console.error("Error while updating product")
                alert("There was an error updating the product. Please try again.");
            }
        }
    }
});
