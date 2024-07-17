export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  profileImg: string;
  bookmarks: string;
};

export type UserFromDB = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  avatar_image: string;
};
