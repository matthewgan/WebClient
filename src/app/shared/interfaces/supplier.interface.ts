export interface ISupplier {
    id: number;
    companyName: string;
    contactName: string;
    contactPhone: number;
    address?: string;
    city?: string;
    province?: string;
    country?: string;
    area?: string;
    created: string;
    updated: string;
}

export interface ISupplierPagination {
    count: number;
    next: string;
    previous: string;
    results: ISupplier[];
}
