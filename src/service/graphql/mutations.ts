import { gql } from "@apollo/client";

// register user
export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        name
        email
      }
    }
  }
`;

// login user
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        name
        email
      }
    }
  }
`;

// logout user
export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

// submit game result
export const SUBMIT_GAME_RESULT = gql`
  mutation SubmitGameResult($input: SubmitGameResultInput!) {
    submitGameResult(input: $input) {
      id
      totalTimeMs
      correctChars
      wrongAttempts
      penaltyMs
      accuracy
      wpmTimeline
      characterTimeline
      createdAt
    }
  }
`;