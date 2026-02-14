import { ProductType } from '@prisma/client';
export declare class CreateProductDto {
    name: string;
    description: string;
    categoryId: string;
    price: number;
    type: ProductType;
}
