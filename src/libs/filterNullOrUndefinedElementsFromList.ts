export const filterNullOrUndefinedElementsFromList = <T>(list: Array<T | null | undefined>): Array<T> => {
  const listWithoutEmptyElements: T[] = [];
  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    if (element !== null && element !== undefined) {
      listWithoutEmptyElements.push(element);
    }
  }

  return listWithoutEmptyElements;
};
