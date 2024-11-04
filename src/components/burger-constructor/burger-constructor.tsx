import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useAction } from '../../hooks/useAction';
import {
  getOrderModalData,
  getOrderRequest,
  orderActions
} from '../../services/slices/order';
import {
  constructorActions,
  getConstructorBun,
  getConstructorIngredients
} from '../../services/slices/burgerConstructor';
import { useSelector } from '../../services/store';
import { getUser } from '../../services/slices/user';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const { resetOrderModal, postOrderThunk } = useAction(orderActions);
  const { resetConstructor } = useAction(constructorActions);
  const user = useSelector(getUser);
  const ingredients = useSelector(getConstructorIngredients);
  const bun = useSelector(getConstructorBun);

  const orderData = [bun?._id || '']
    .concat(ingredients.map((i) => i._id))
    .concat([bun?._id || ''])
    .filter((i) => i !== '');

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const orderRequest = useSelector(getOrderRequest);

  const orderModalData = useSelector(getOrderModalData);

  const onOrderClick = () => {
    if (!user) {
      navigate('login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    postOrderThunk(orderData);
    resetConstructor();
  };
  const closeOrderModal = () => {
    resetOrderModal();
    navigate('/');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
