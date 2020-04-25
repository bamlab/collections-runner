const isElementInArray = <T>(list: Array<T>, element: T, equalityCriteria: (elementToCompare: T, fixElement: T) => boolean): boolean => {
  const foundElement = list.find(el => equalityCriteria(el, element));
  return !!foundElement;
};

export const filterDoubleElementsFromList = <T>(list: Array<T>, equalityCriteria: (elementToCompare: T, fixElement: T) => boolean): Array<T> => {
  const listWithoutDoubleElements: T[] = [];
  list.forEach(element => {
    if (!isElementInArray(listWithoutDoubleElements, element, equalityCriteria)) {
      listWithoutDoubleElements.push(element);
    }
  });
  return listWithoutDoubleElements;
};
