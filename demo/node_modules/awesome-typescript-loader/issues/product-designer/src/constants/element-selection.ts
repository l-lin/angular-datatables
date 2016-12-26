export enum ElementSelection {
  Mandatory = 0,
  OptionalAll = 1,
  OptionalIndividual = 2,
}

export const elementSelectionValues = [
  ElementSelection.Mandatory,
  ElementSelection.OptionalAll,
  ElementSelection.OptionalIndividual,
];

export const elementSelectionLabels = {
  [ElementSelection.Mandatory]: 'Mandatory',
  [ElementSelection.OptionalAll]: 'Optional All',
  [ElementSelection.OptionalIndividual]: 'Optional Individual',
};
