import { get, last } from 'lodash';
import { ILayerListAndLinks } from '../interfaces/buildData.interfaces';
import { IContactsDB } from '../interfaces/contacts.interface';

export const buildReducedListsAndLayerLinks = (
  prevVal: ILayerListAndLinks,
  currentVal: IContactsDB,
) => {
  if (
    currentVal.idContactDevice ===
    get(last(prevVal.reducedLists), 'idContactDevice', '')
  ) {
    const lastLink = {
      ...last(prevVal.links),
      value: last(prevVal.links).value + 1,
    };

    prevVal.links.pop();
    prevVal.links.push(lastLink);

    return {
      reducedLists: [...prevVal.reducedLists],
      links: [...prevVal.links],
    };
  }

  return {
    reducedLists: [
      ...prevVal.reducedLists,
      {
        idDevice: currentVal.idDevice,
        idContactDevice: currentVal.idContactDevice,
      },
    ],
    links: [
      ...prevVal.links,
      {
        value: 1,
        idDevice: currentVal.idDevice,
        idContactDevice: currentVal.idContactDevice,
      },
    ],
  };
};

export const INITIAL_REDUCED_LIST_AND_LINKS = {
  reducedLists: [],
  links: [],
};
