export type BookItemProps = {
  id: string | number;
  attributes: {
    title: string;
    info: string;
    creator: string;
    likes?: [] | null;
    cover?: {
      data: {
        id: string | number;
        attributes: {
          url: string | undefined;
        };
      };
    };
  };
};
