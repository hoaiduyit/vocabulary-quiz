export enum UserRole {
    GUEST = 'guest',
    REGISTERED = 'registered'
}

export enum CommonStatus {
    ACTIVE = 'active',
    DEACTIVE = 'deactive'
}

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
