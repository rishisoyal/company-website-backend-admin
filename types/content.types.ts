export type CardData = {
  _id: string;
  block_type: string;
  cards: {
    _id: string;
    title?: string;
    subtitle?: string;
    more_info?: {
      heading: string;
      points: string[];
    };
  }[];
};

export type TextData = {
  _id: string;
  block_type: string;
  title?: string;
  subtitle?: string;
  text?: string;
};

export type MediaData = {
  _id: string;
  block_type: string;
  media_path: string;
};
