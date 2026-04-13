export function getInitials(name, email) {
  const source = name || email || "";
  return source.slice(0, 1).toUpperCase();
}

export function slugify(value) {
  return value.toLowerCase().replace(/\s+/g, "-");
}
