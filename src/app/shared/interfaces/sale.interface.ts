export interface ISaleInfo {
    id: number;
    number: number;
    shop: number;
    merchandise: number;
    created: string;
    updated: string;
    shopName?: string;
    merchandiseName?: string;
}

export interface ISalePagination {
    count: number;
    next: string;
    previous: string;
    results: ISaleInfo[];
}
