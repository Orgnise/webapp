module.exports = {
  generateSlug,
};
async function generateSlug({ name, didExist = async (val) => {} }) {
  if (!name) throw new Error("Name is required");
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  let newName = await didExist(slug);
  if (newName) {
    let num = 2;
    while (newName) {
      slug = `${slug}-${num}`;
      newName = await didExist(slug);
      num++;
    }
  }

  return slug;
}
