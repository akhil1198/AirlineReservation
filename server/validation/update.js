const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateUpdateInput(data) {
    let errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    // data.phone = !isEmpty(data.phone) ? data.phone : null;
    data.isDeleted = !isEmpty(data.isDeleted) ? data.isDeleted.toString() : "";
    // Name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }
    // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    // if (Validator.isEmpty(data.phone)) {
    //     errors.phone = "Phone field is required";
    // } else if (!Validator.isLength(data.phone, { min: 0, max: 10 })) {
    //     errors.phone = "Phone must be 10 digits";
    // }
    if (Validator.isBoolean(data.isDeleted)) {
        errors.isDeleted = "Deleted field should be boolean";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};