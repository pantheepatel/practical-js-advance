
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
        try {
            const id = uuid.v4();
            localStorage.setItem(id, JSON.stringify(product));
            alert("Product added successfully.");
            form_.reset();
        } catch (error) {
            console.error("Error adding product to localStorage:", error);
            alert("There was an error adding the product. Please try again.");
        }
    }
});
