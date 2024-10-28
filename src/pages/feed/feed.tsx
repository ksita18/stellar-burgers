import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { getFeedOrders, feedActions } from '../../services/slices/feed';
import { useSelector } from '../../services/store';
import { useEffect } from 'react';
import { useAction } from '../../hooks/useAction';


export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getFeedOrders);

  const { getFeedThunk } = useAction(feedActions);

  useEffect(() => {
    getFeedThunk();
  }, []);

  const handleGetFeeds = () => {
    location.assign('/feed');
    getFeedThunk();
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
