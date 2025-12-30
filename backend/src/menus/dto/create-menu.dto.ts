// backend/src/menus/dto/create-menu.dto.ts
export class CreateMenuDto {
  name: string;
  price: number;
  image: string;
  isAvailable: boolean;
}