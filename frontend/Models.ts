export interface CommentInterface {
  id: string;
  text: string;
  user: string;
  userId: string;
  userPhoto?: string;
}

export interface RatedByInterface {
  rating: number;
  userId: string;
}

export interface RatingInterface {
  rate: number;
  count: number;
}

export interface ProductInterface {
  category: string;
  comments: CommentInterface[];
  description: string;
  id: string;
  image: string;
  price: number;
  ratedBy: RatedByInterface[];
  rating: RatingInterface;
  title: string;
  discount: number;
}

export interface ProductCardInterface {
  id: string;
  image: string;
  price: number;
  rating: number;
  ratingCount: number;
  title: string;
  discount: number;
}

export interface DisplayProductInterface {
  category: string;
  comments: CommentInterface[];
  description: string;
  id: string;
  image: string;
  price: number;
  ratedBy: RatedByInterface[];
  rating: RatingInterface;
  title: string;
  displayElement: boolean;
  discount: number;
}

export interface ShoppingCartProductInterface {
  id: string;
  image: string;
  price: number;
  rating: number;
  ratingCount: number;
  title: string;
  discount: number;
  quantity: number;
}

export interface AlgoliaResultInterface {
  id: string;
  title: string;
  image: string;
  price: number;
}

export interface BrandInterface {
  name: string;
  selected: boolean;
  occurance: number;
}
