export interface IUserInfo {
    pk: number;
    username: string;
    email?: string;
    first_name?: string;
    last_name?: string;
}

export interface IToken {
    key: string;
}
