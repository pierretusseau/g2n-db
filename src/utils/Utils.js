export const slugify = (name, separator = "-") => name.replace(/['\s]/g, separator).toLowerCase()
