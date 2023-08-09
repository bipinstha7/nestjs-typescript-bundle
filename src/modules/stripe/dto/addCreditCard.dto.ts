import { IsString, IsNotEmpty } from 'class-validator';

export default class AddCreditCardDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}
