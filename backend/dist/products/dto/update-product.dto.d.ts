import { ProductType } from '@prisma/client';
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    categoryId?: string;
    price?: number;
    type?: ProductType;
}
