import { VoteService } from "./vote.service";
export declare class VoteController {
    private readonly voteService;
    constructor(voteService: VoteService);
    getVoteInfo(id: string): Promise<any>;
}
