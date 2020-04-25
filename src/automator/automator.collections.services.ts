import {
  CollectionDefinition,
  ItemGroupDefinition,
  EventDefinition
} from "postman-collection";
import { filterDoubleElementsFromList } from "../libs/filterDoubleElementsFromList";
import { filterNullOrUndefinedElementsFromList } from "../libs/filterNullOrUndefinedElementsFromList";

const getOddIndexes = (matching: string[]): string[] => {
  // @ts-ignore
  const onlyOddElements = [];
  // @ts-ignore
  if (matching.length < 2) return onlyOddElements;
  // eslint-disable-next-line
  for (let index = 1; index < matching.length; index = index + 2) {
    onlyOddElements.push(matching[index]);
  }
  return onlyOddElements;
};
const getGetVariableCall = (events: EventDefinition[]): string[] => {
  return [].concat(
    // @ts-ignore
    ...events.map(event => {
      // @ts-ignore script is typed as possibly string
      const script = event.script.exec.join("");
      const getEnvironementString = /.*pm.environment.get\("(.*)"\).*/i;
      const matchingString = script.split(getEnvironementString);
      return getOddIndexes(matchingString);
    })
  );
};
const getGetVariableUse = (body: string): string[] => {
  const getEnvironementString = /.*{{(.*)}}.*/i;
  const matchingString = body.split(getEnvironementString);
  return getOddIndexes(matchingString);
};

const computeChildrenUsedVariables = (
  element: ItemGroupDefinition
): string[] => {
  const usedInEvent = element.event
    ? filterNullOrUndefinedElementsFromList(getGetVariableCall(element.event))
    : [];
  // @ts-ignore ItemGroupDefinition type does not include request key
  const usedInBody = element.request.body
    // @ts-ignore
      ? getGetVariableUse(element.request.body.raw)
    : [];
  // @ts-ignore ItemGroupDefinition type does not include request key
  const usedInHeader = getGetVariableUse(
    // @ts-ignore
    element.request.header.map(key => key.value).join("")
  );
  // @ts-ignore ItemGroupDefinition type does not include request key
  const usedInURL = getGetVariableUse(element.request.url.raw);
  return [...usedInEvent, ...usedInBody, ...usedInHeader, ...usedInURL];
};

const addChildrenVariablesToParent = (
  parentUsedVariables: string[],
  childrenUsedVariables: string[]
) => {
  const newParentUsedVariables = parentUsedVariables;
  newParentUsedVariables.push(...childrenUsedVariables);
  return filterDoubleElementsFromList(
    newParentUsedVariables,
    // @ts-ignore
    (stringA, stringB) => stringA === stringB
  );
};
export const getCollectionDetails = (collection: CollectionDefinition) => {
  // @ts-ignore
  const parentsRoutesNames = [];
  // @ts-ignore
  const childrenRoutesNames = [];
  const usedVariables = {};

  const initializeRoutesNames = () => {
    // @ts-ignore
    collection.item.forEach(ele => {
      // @ts-ignore
      getRoutesName(ele, collection.name);
    });
  };
  const getRoutesName = (element: ItemGroupDefinition, parentName: string) => {
    if (!element.item || element.item.length == 0) {
      childrenRoutesNames.push(element.name);
      // @ts-ignore
      usedVariables[element.name] = computeChildrenUsedVariables(element);
      // @ts-ignore
      usedVariables[parentName] = addChildrenVariablesToParent(
        // @ts-ignore
        usedVariables[parentName],
        computeChildrenUsedVariables(element)
      );
      return;
    }
    parentsRoutesNames.push(element.name);
    // @ts-ignore
    usedVariables[element.name] = [];
    element.item.forEach(ele => {
      // @ts-ignore
      getRoutesName(ele, element.name);
    });
  };
  initializeRoutesNames();
  // @ts-ignore
  return { parentsRoutesNames, childrenRoutesNames, usedVariables };
};
