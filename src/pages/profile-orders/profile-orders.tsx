import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useAction } from '../../hooks/useAction';
import { ordersActions } from '../../services/slices/ordersSlice';
import { getOrders, getOrdersLoading } from '../../services/slices/ordersSlice';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector(getOrders);
  const ordersLoading = useSelector(getOrdersLoading);
  const { getOrdersThunk } = useAction(ordersActions);

  if (orders.length === 0) {
    getOrdersThunk();
  }

  if (ordersLoading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
