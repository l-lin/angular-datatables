export enum ChildSelection {
  Free = 0,
  ExactlyOneAll = 1,
  ExactlyOneIndividual = 2,
  MaxOneAll = 3,
  MaxOneIndividual = 4,
}

export const childSelectionValues = [
  ChildSelection.Free,
  ChildSelection.ExactlyOneAll,
  ChildSelection.ExactlyOneIndividual,
  ChildSelection.MaxOneAll,
  ChildSelection.MaxOneIndividual,
];

export const childSelectionLabels = {
  [ChildSelection.Free]: 'Free',
  [ChildSelection.ExactlyOneAll]: 'Exactly One All',
  [ChildSelection.ExactlyOneIndividual]: 'Exactly One Individual',
  [ChildSelection.MaxOneAll]: 'Max One All',
  [ChildSelection.MaxOneIndividual]: 'Max One Individual',
};
