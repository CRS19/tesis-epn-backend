export interface ILayerListAndLinks {
  reducedLists: IReducedListContact[];
  links: ILink[];
}
export interface IReducedListContact {
  idDevice: string;
  idContactDevice: string;
}
export interface ILink {
  value: number;
  idDevice: string;
  idContactDevice: string;
}

export interface ILinkToGraph {
  value: number;
  source: string;
  target: string;
}

export interface INode {
  mail: string;
  name: string;
  id: string;
  colour: string;
}

export interface IGraphData {
  nodes: INode[];
  links: ILinkToGraph[];
}
