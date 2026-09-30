const slugify = (text) => {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const createUniqueSlug = async (text, existsCallback) => {
  const baseSlug = slugify(text);

  let slug = baseSlug;
  let counter = 1;

  while (await existsCallback(slug)) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};

export default slugify;