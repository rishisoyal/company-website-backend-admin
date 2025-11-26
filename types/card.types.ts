export type CardData = {
  _id: string;
  block_type: string;
  cards: {
    _id: string;
    title?: string;
    subtitle?: string;
  }[];
};
