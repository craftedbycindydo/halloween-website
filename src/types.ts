export interface Contestant {
  id: string;
  name: string;
  costume: string;
  imageUrl?: string;
}

export interface Vote {
  contestantId?: string;
  contestant_id?: string;
  voterName?: string;
  voter_name?: string;
  timestamp: number;
  deviceId?: string;
  device_id?: string;
  hasChanged?: boolean;
  has_changed?: boolean;
}

export interface VoteCount {
  contestantId: string;
  count: number;
}

