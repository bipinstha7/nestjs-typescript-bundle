import CreateSubscriberDto from '../dto/createSubscriber.dto';
import ISubscriber from '../dto/subscriber.interface';

export default interface ISubscriberService {
  addSubscriber(subscriber: CreateSubscriberDto): Promise<ISubscriber>;
  getAllSubscribers(params: {}): Promise<{ data: ISubscriber[] }>;
}
