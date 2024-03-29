export const firstCall = [
  {
    _id: '62ae3702391f822d8831cef4',
    idDevice: '1',
    idContactDevice: '2',
  },
  {
    _id: '62ae374a391f822d8831cef5',
    idDevice: '1',
    idContactDevice: '2',
  },
  {
    _id: '62ae3751391f822d8831cef6',
    idDevice: '1',
    idContactDevice: '2',
  },
  {
    _id: '62ae789f391f822d8831cf07',
    idContact: '1',
    idContactDevice: '2',
    idDevice: '1',
  },
  {
    _id: '62ae3764391f822d8831cef7',
    idDevice: '1',
    idContactDevice: '4',
  },
];

export const secondCall = [
  [
    { _id: '62ae379d391f822d8831cef8', idDevice: '2', idContactDevice: '1' },
    { _id: '62ae37c2391f822d8831cef9', idDevice: '2', idContactDevice: '1' },
    { _id: '62ae37ca391f822d8831cefa', idDevice: '2', idContactDevice: '1' },
    { _id: '62ae37db391f822d8831cefb', idDevice: '2', idContactDevice: '6' },
    { _id: '62ae37f4391f822d8831cefc', idDevice: '2', idContactDevice: '6' },
  ],
  [{ _id: '62ae381f391f822d8831cefd', idDevice: '4', idContactDevice: '1' }],
];

export const userResponseFirstCall = {
  mail: 'lucho@gmail.com',
  name: 'Luis Test',
  id: '1',
  colour: '#ffa100',
};

export const userRequestSecondCall = [
  {
    mail: 'dolores@gmail.com',
    name: 'Maria Dolores',
    id: '2',
    colour: '#ff00b2',
  },
  {
    mail: 'torres@gmail.com',
    name: 'Marta Torres',
    id: '4',
    colour: '#ff8b00',
  },
  {
    mail: 'lopez@gmail.com',
    name: 'Viviana Lopez ',
    id: '6',
    colour: '#ff00b1',
  },
];

// this is an error solved to the future
export const expectedValue = {
  nodes: [
    {
      mail: 'lucho@gmail.com',
      name: 'Luis Test',
      id: '1',
      colour: '#ffa100',
    },
    {
      mail: 'dolores@gmail.com',
      name: 'Maria Dolores',
      id: '2',
      colour: '#ff00b2',
    },
    {
      mail: 'torres@gmail.com',
      name: 'Marta Torres',
      id: '4',
      colour: '#ff8b00',
    },
    {
      mail: 'lopez@gmail.com',
      name: 'Viviana Lopez ',
      id: '6',
      colour: '#ff00b1',
    },
    undefined,
  ],
  links: [
    { value: 4, source: '2', target: '2' },
    { value: 1, source: '4', target: '4' },
    { value: 4, source: '1', target: '2' },
    { value: 1, source: '1', target: '4' },
    { value: 4, source: '1', target: '2' },
    { value: 1, source: '1', target: '4' },
  ],
};

export const twoExpected = {
  nodes: [
    {
      mail: 'lucho@gmail.com',
      name: 'Luis Test',
      id: '1',
      colour: '#ffa100',
    },
    {
      mail: 'dolores@gmail.com',
      name: 'Maria Dolores',
      id: '2',
      colour: '#ff00b2',
    },
    {
      mail: 'torres@gmail.com',
      name: 'Marta Torres',
      id: '4',
      colour: '#ff8b00',
    },
    {
      mail: 'lopez@gmail.com',
      name: 'Viviana Lopez ',
      id: '6',
      colour: '#ff00b1',
    },
    undefined,
  ],
  links: [
    { value: 4, source: '2', target: '2' },
    { value: 1, source: '4', target: '4' },
    { value: 2, source: '4', target: '3' },
    { value: 4, source: '1', target: '2' },
    { value: 1, source: '1', target: '4' },
    { value: 4, source: '1', target: '2' },
    { value: 1, source: '1', target: '4' },
    { value: 4, source: '1', target: '2' },
    { value: 1, source: '1', target: '4' },
  ],
};

export const getContactsMockRepsonse = [
  {
    _id: '62ae3702391f822d8831cef4',
    idDevice: '1',
    idContactDevice: '2',
    timestampInit: 1655937327000,
    timestampEnd: 1655937507000,
  },
  {
    _id: '62ae374a391f822d8831cef5',
    idDevice: '1',
    idContactDevice: '2',
    timestampInit: 1655912127000,
    timestampEnd: 1655912142000,
  },
];

export const getContactsDataTableResponse = {
  contacts: [
    {
      date: '2022/06/22',
      duration: '3 minutos',
      idDevice: '2',
      name: 'CRS test',
    },
    {
      date: '2022/06/22',
      duration: '15 segundos',
      idDevice: '2',
      name: 'CRS test',
    },
  ],
  documentsCount: 2,
};
