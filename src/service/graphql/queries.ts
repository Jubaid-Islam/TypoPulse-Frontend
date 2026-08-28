import { gql } from "@apollo/client";

// get current user
export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      image
    }
  }
`;

// get user game history - all results
export const GET_MY_GAME_HISTORY = gql`
  query GetMyGameHistory {
    myGameHistory {
      id
      correctChars
      wrongAttempts
      rawTimeMs
      penaltyMs
      totalTimeMs
      accuracy
      wpmTimeline
      characterTimeline
      createdAt
    }
  }
`;

// get user best score 
export const GET_MY_BEST_SCORE = gql`
  query GetMyBestScore {
    myBestScore {
      id
      totalTimeMs
      correctChars
      wrongAttempts
      accuracy
      createdAt
    }
  }
`;

// get global leaderboard
export const GET_LEADERBOARD = gql`
  query GetLeaderboard($limit: Int = 10) {
    leaderboard(limit: $limit) {
      rank
      playerName
      bestTimeMs
    }
  }
`;