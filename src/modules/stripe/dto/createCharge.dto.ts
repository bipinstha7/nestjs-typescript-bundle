import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CreateChargeDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @IsNumber()
  amount: number;
}
