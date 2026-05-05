# League Module - Frontend Implementation Plan
 
This document outlines the API integration for the League module. It covers league creation, joining, management, and the leaderboard.
 
## Base URL
`/league`
 
## Data Types
 
```typescript
export type LeagueStatus = 'DRAFTING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
 
export interface IScoringSettings {
  winPoints: number;
  finishBonus: number;
  winningChampionshipBout: number;
  championVsChampionWin: number;
  winningAgainstRankedOpponent: number;
  winningFiveRoundFight: number;
}
 
export interface ILeague {
  id: string;
  name: string;
  code: string;
  managerId: string;
  memberLimit: number;
  rosterSize: number;
  status: LeagueStatus;
  draftTime: string;
  isSystemGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  manager?: any; // User details
  teams?: ITeam[]; // Leaderboard
  scoringSettings?: IScoringSettings;
}
 
export interface ITeam {
  id: string;
  name: string;
  leagueId: string;
  ownerId: string;
  totalPoints: number;
  rank?: number;
  iconGlyph?: string;
  owner?: any; // User details
}
 
export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}
 
export interface ILeagueResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ILeague;
}
 
export interface ILeagueListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: IMeta;
    data: ILeague[];
  };
}
export interface IAddFighterPayload {
  fighterId: string;
}
 
export interface IRemoveFighterPayload {
  fighterId: string;
}
```
 
 
## Endpoints
 
### 1. Create League
Creates a new fantasy league with scoring settings.
 
- **URL:** `/league`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "name": "Ultimate Fantasy MMA",
  "leagueType": "PUBLIC",
  "memberLimit": 10,
  "rosterSize": 5,
  "draftTime": "2024-05-10T18:00:00Z",
  "secondsPerPick": 60,
  "scoringSettings": {
    "winPoints": 10,
    "finishBonus": 5
  }
}
```
 
- **Success Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "League created successfully",
  "data": { "id": "...", "name": "...", "code": "ABC123", ... }
}
```
 
---
 
### 2. Join League by Code
Join an existing league using its unique code.
 
- **URL:** `/league/join`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "code": "ABC123",
  "passcode": "optional_passcode",
  "teamName": "My Awesome Team"
}
```
 
---
 
### 3. Quick Join
Join a system-generated league immediately. Creates a new league if no active system leagues have space.
 
- **URL:** `/league/join-quick`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "teamName": "Fast Team"
}
```
 
---
 
### 4. Get My Leagues
Fetches all leagues the authenticated user is a member of.
 
- **URL:** `/league/my/leagues`
- **Method:** `GET`
- **Auth Required:** Yes
 
---
 
### 5. Get League Leaderboard
Fetches detailed information about a league, including the leaderboard (teams sorted by points).
 
- **URL:** `/league/:id`
- **Method:** `GET`
- **Auth Required:** No
 
- **Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "League retrieved successfully",
  "data": {
    "id": "...",
    "name": "...",
    "teams": [
      { "name": "Leader Team", "totalPoints": 150 },
      { "name": "Challenger Team", "totalPoints": 140 }
    ]
  }
}
```
 
---
 
### 6. Update League Settings
Update league name, draft time, or pick duration. Only the league manager can perform this action.
 
- **URL:** `/league/:id`
- **Method:** `PATCH`
- **Auth Required:** Yes (Manager Only)
- **Request Body:**
```json
{
  "name": "New Name",
  "draftTime": "2024-05-15T18:00:00Z",
  "secondsPerPick": 90
}
```
 
---
 
### 7. Delete League
Soft-deletes the league. Only the manager or an Admin can perform this action.
 
- **URL:** `/league/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes (Manager or Admin)
 
---
 
### 8. Get Available Fighters in League
Fetches fighters who are not yet assigned to any team in the specified league.
 
- **URL:** `/league/:id/available-fighters`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Parameters:**
  - `searchTerm` (string): Search in name/nickname.
  - `divisionId` (string): Filter by division.
  - `page`, `limit`, `sortBy`, `sortOrder`.
 
---
 
### 9. Add Fighter to Team
Adds a new fighter to your team if they are available in the league and your roster is not full.
 
- **URL:** `/league/:id/add-fighter`
- **Method:** `POST`
- **Auth Required:** Yes (Team Owner Only)
- **Request Body:**
```json
{
  "fighterId": "available_fighter_id"
}
```
 
---
 
### 10. Remove Fighter from Team
Removes a fighter from your team. This allows you to free up a spot to add someone else later.
 
- **URL:** `/league/:id/remove-fighter`
- **Method:** `POST`
- **Auth Required:** Yes (Team Owner Only)
- **Request Body:**
```json
{
  "fighterId": "current_fighter_id"
}
```
 