import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(filter: FilterProductsDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        description: string;
        price: number;
        type: import(".prisma/client").$Enums.ProductType;
        imageUrl: string | null;
        createdAt: Date;
        categoryId: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: number;
        type: import(".prisma/client").$Enums.ProductType;
        imageUrl: string | null;
        createdAt: Date;
        categoryId: string;
    }>;
    create(dto: CreateProductDto): import(".prisma/client").Prisma.Prisma__ProductClient<{
        id: string;
        name: string;
        description: string;
        price: number;
        type: import(".prisma/client").$Enums.ProductType;
        imageUrl: string | null;
        createdAt: Date;
        categoryId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        description: string;
        price: number;
        type: import(".prisma/client").$Enums.ProductType;
        imageUrl: string | null;
        createdAt: Date;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
