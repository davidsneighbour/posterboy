export function transformConfig(configArray) {
  return configArray.map(item => ({
    value: item.slug,
    label: item.name
  }));
}
export function getObjectBySlug(configArray, slug) {
  return configArray.find(item => item.slug === slug);
}
