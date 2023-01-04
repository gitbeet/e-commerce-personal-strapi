import { gql } from "@apollo/client";

export const PRODUCT = gql`
  query GetProduct($id: ID!) {
    products(filters: { id: { eq: $id } }) {
      data {
        attributes {
          title
          description
          price
          rating
          image
          ratingCount
          discount
          category {
            data {
              attributes {
                name
              }
            }
          }
          comments {
            data {
              id
              attributes {
                text
                createdAt
                user {
                  data {
                    id
                    attributes {
                      username
                      email
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const COMMENTS = gql`
  query GetComments($id: ID!) {
    comments(filters: { product: { id: { eq: $id } } }) {
      data {
        id
        attributes {
          text
          user {
            data {
              id
              attributes {
                username
                user_ratings(filters: { product: { id: { eq: $id } } }) {
                  data {
                    attributes {
                      rating
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($text: String!, $user: ID!, $product: ID!) {
    createComment(data: { text: $text, user: $user, product: $product }) {
      data {
        attributes {
          text
          createdAt
        }
      }
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($text: String!, $id: ID!) {
    updateComment(data: { text: $text }, id: $id) {
      data {
        id
        attributes {
          text
          createdAt
        }
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      data {
        id
        attributes {
          text
        }
      }
    }
  }
`;

export const GET_CART = gql`
  query GetInitialShoppingCart($user: ID!) {
    carts(filters: { users_permissions_user: { id: { eq: $user } } }) {
      data {
        id
        attributes {
          items
        }
      }
    }
  }
`;

export const CREATE_CART = gql`
  mutation CreateCart($user: ID!) {
    createCart(data: { items: "[]", users_permissions_user: $user }) {
      data {
        attributes {
          items
          users_permissions_user {
            data {
              attributes {
                username
              }
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_CART = gql`
  mutation UpdateCart($items: JSON!, $id: ID!) {
    updateCart(data: { items: $items }, id: $id) {
      data {
        id
        attributes {
          items
        }
      }
    }
  }
`;

export const GET_USER_RATING = gql`
  query GetUserRating($userId: ID!, $productId: ID!) {
    userRatings(
      filters: {
        users_permissions_user: { id: { eq: $userId } }
        product: { id: { eq: $productId } }
      }
    ) {
      data {
        attributes {
          rating
        }
      }
    }
  }
`;

export const GET_RATING = gql`
  query GetRating($id: ID!) {
    products(filters: { id: { eq: $id } }) {
      data {
        attributes {
          rating
          ratingCount
        }
      }
    }
  }
`;

export const UPDATE_RATING = gql`
  mutation UpdateRating($id: ID!, $ratingCount: Int!, $rating: Float!) {
    updateProduct(
      data: { ratingCount: $ratingCount, rating: $rating }
      id: $id
    ) {
      data {
        attributes {
          rating
          ratingCount
        }
      }
    }
  }
`;

export const CREATE_USER_RATING = gql`
  mutation CreateUserRating($userId: ID!, $rating: Int!, $productId: ID!) {
    createUserRating(
      data: {
        rating: $rating
        users_permissions_user: $userId
        product: $productId
      }
    ) {
      data {
        attributes {
          rating
          product {
            data {
              id
              attributes {
                title
              }
            }
          }
          users_permissions_user {
            data {
              id
              attributes {
                username
              }
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_ITEMS = gql`
  query SearchProducts($input: String!) {
    products(
      filters: {
        or: [
          { category: { name: { containsi: $input } } }
          { title: { containsi: $input } }
        ]
      }
    ) {
      data {
        id
        attributes {
          title
          price
          image
        }
      }
    }
  }
`;
