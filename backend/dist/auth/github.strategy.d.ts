declare const GithubStrategy_base: new (...args: any[]) => any;
export declare class GithubStrategy extends GithubStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
