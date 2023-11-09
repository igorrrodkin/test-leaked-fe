import { EOrderItemType } from '@/store/reducers/order';
import { OrderStatusEnum } from '@/store/reducers/user';

enum AdditionalOrderStatus {
  LIST = 'list',
}
export type TabularOrderStatus = OrderStatusEnum | AdditionalOrderStatus;

export default (orderStatus: OrderStatusEnum, orderItemType: EOrderItemType): TabularOrderStatus => {
  if (orderItemType === EOrderItemType.SEARCH && orderStatus === OrderStatusEnum.COMPLETE) {
    return OrderStatusEnum.LIST;
  }

  return orderStatus;
};
