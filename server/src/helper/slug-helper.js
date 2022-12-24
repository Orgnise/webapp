module.exports = {
  generateSlug,
};
async function generateSlug({ title, didExist = async (val) => {} }) {
  if (!title) {
    // Generate random string
    title =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
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
