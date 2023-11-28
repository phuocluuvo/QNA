declare const PublicGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class PublicGuard extends PublicGuard_base {
    handleRequest(err: any, user: any): any;
}
export {};
