export const textAndNumbers = /^[a-zA-Z0-9]+$/;

/** Plain ASCII letters, numbers and spaces only - no accents, ñ or symbols (billing/address fields). */
export const addressValidation = /^[A-Za-z0-9 ]+$/;

/** Same charset while typing; allows empty string. */
export const addressInputRegExp = /^[A-Za-z0-9 ]*$/;