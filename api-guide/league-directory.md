# League Module - Frontend Implementation Plan
 
This document outlines the API integration for the League module. It covers league creation, joining, management, the leaderboard, and roster adjustments.
 
## Base URL
`/league`
 
---
 
## Data Types
 
### 1. Enums
- `LeagueStatus`: `'DRAFTING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'`
- `LeagueType`: `'PUBLIC' | 'PRIVATE'` (Derived from presence of passcode)
 
### 2. Core Interfaces
```typescript
export interface ILeague {
  id: string;
  name: string;
  code: string;               // Unique invite code (e.g., "ABCD-1234")
  passcode: string | null;     // Optional password for private leagues
  managerId: string;           // User ID of the league creator
  memberLimit: number;         // Max teams allowed (default: 8)
  rosterSize: number;          // Fighters per team (default: 5)
  status: LeagueStatus;        // Current state of the league
  draftTime: string | null;    // ISO Date when drafting starts
  isSystemGenerated: boolean;  // True for official/global leagues
  deletedAt: string | null;    // Soft delete timestamp
  createdAt: string;
  updatedAt: string;
 
  // Relations
  manager?: IUser;
  scoringSettings?: IScoringSettings;
  teams?: ITeam[];            // List of teams (for leaderboard)
  _count?: {
    members: number;
    teams: number;
  };
}
 
export interface IScoringSettings {
  id: string;
  leagueId: string;
  systemScoringSettingId: string | null;
  winPoints: number;
  finishBonus: number;
  winningChampionshipBout: number;
  championVsChampionWin: number;
  winningAgainstRankedOpponent: number;
  winningFiveRoundFight: number;
  createdAt: string;
  updatedAt: string;
}
 
export interface ITeam {
  id: string;
  name: string;
  leagueId: string;
  ownerId: string;
  totalPoints: number;
  rank: number | null;
  iconGlyph: string | null;
  owner?: IUser;
  teamFighters?: ITeamFighter[];
}
 
export interface IUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}
```
 
---
 
## Endpoints & Response Examples
 
### 1. Get My Leagues
Fetches leagues where you are either the manager or a participant.
- **URL:** `/league/my/leagues`
- **Method:** `GET`
- **Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Leagues retrieved successfully",
  "data": [
    {
      "id": "cmosx9we8000...",
      "name": "Japan Pro League",
      "code": "UFC-JAPAN",
      "passcode": "1234",
      "status": "DRAFTING",
      "memberLimit": 8,
      "rosterSize": 5,
      "draftTime": "2026-05-09T00:00:00.000Z",
      "isSystemGenerated": false,
      "createdAt": "2026-05-06T00:00:00.000Z",
      "_count": { "teams": 3 }
    }
  ]
}
```
 
### 2. Get Available Leagues (Search)
- **URL:** `/league/available`
- **Method:** `GET`
- **Query Params:** `searchTerm`, `leagueType`, `page`, `limit`
- **Note**: Passcode is masked in the response (`isPrivate: true` instead).
 
### 3. Create League
- **URL:** `/league`
- **Method:** `POST`
- **Body:**
```json
{
  "name": "Elite Fighters",
  "passcode": "optional123",
  "memberLimit": 12,
  "rosterSize": 6,
  "draftTime": "2026-06-01T12:00:00Z",
  "scoringSettings": {
    "winPoints": 10,
    "finishBonus": 5
  }
}
```
 
### 4. Get League Details
- **URL:** `/league/:id`
- **Method:** `GET`
 
### 5. Join League
- **URL:** `/league/join`
- **Method:** `POST`
- **Body:** `{ "code": "UFC-JAPAN", "passcode": "1234", "teamName": "Tokyo Warriors" }`
 
---
 
## Fighter/Roster Management (Post-Draft)
 
### Add Fighter
- **URL:** `/league/:id/add-fighter`
- **Method:** `POST`
- **Body:** `{ "fighterId": "fighter_uuid" }`
 
### Remove Fighter
- **URL:** `/league/:id/remove-fighter`
- **Method:** `POST`
- **Body:** `{ "fighterId": "fighter_uuid" }`
 
---
 
## Status Workflow
1.  **DRAFTING**: Default status. Users can join until `memberLimit` is reached or `draftTime` begins.
2.  **ACTIVE**: Set automatically when the draft completes. Points start accumulating.
3.  **COMPLETED**: Set after the final event of the season (manual or automated).
4.  **ARCHIVED**: League is hidden from active lists but kept for history.