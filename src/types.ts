export interface Contestant {
  id: string;
  name: string;
  costume: string;
  imageUrl: string;
}

export interface Vote {
  contestantId: string;
  voterName: string;
  timestamp: number;
  deviceId: string;
  hasChanged?: boolean;
}

export interface VoteCount {
  contestantId: string;
  count: number;
}

