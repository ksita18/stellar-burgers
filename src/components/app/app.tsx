import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, OrderInfo, Modal } from '@components';
import { Routes, Route, useLocation, useMatch } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useAction } from '../../hooks/useAction';
import { ingredientsActions } from '../../services/slices/ingredients';
import { userActions } from '../../services/slices/user';
import { useEffect } from 'react';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const { getIngredientsThunk } = useAction(ingredientsActions);
  const { checkUserAuth, authChecked } = useAction(userActions);
  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;

  useEffect(() => {
    getIngredientsThunk();
  }, []);

  useEffect(() => {
    checkUserAuth()
      .unwrap()
      .catch((e) => {
        console.log(e);
      })
      .finally(() => authChecked());
  }, [authChecked]);

  const modalClose = () => {
    history.back();
  };

  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />

          <Route path='/feed'>
            <Route index element={<Feed />} />
            <Route
              path=':number'
              element={
                <div className={styles.detailPageWrap}>
                  <p
                    className={`text text_type_digits-default ${styles.detailHeader}`}
                  >
                    #{orderNumber && orderNumber.padStart(6, '0')}
                  </p>
                  <OrderInfo />
                </div>
              }
            />
          </Route>

          <Route
            path='/login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />

          <Route
            path='/register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />

          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />

          <Route path='/profile'>
            <Route index element={<Profile />} />
            <Route path='orders'>
              <Route index element={<ProfileOrders />} />
              <Route
                path=':number'
                element={
                  <div className={styles.detailPageWrap}>
                    <p
                      className={`text text_type_digits-default ${styles.detailHeader}`}
                    >
                      #{orderNumber && orderNumber.padStart(6, '0')}
                    </p>
                    <ProtectedRoute>
                      <OrderInfo />
                    </ProtectedRoute>
                  </div>
                }
              />
            </Route>
          </Route>

          <Route
            path='/ingredients/:id'
            element={
              <div className={styles.detailPageWrap}>
                <p
                  className={`text text_type_digits-default ${styles.detailHeader}`}
                >
                  Детали ингридиента
                </p>
                <IngredientDetails />
              </div>
            }
          />

          <Route path='*' element={<NotFound404 />} />
        </Routes>

        {background && (
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal
                  onClose={modalClose}
                  title={`#{orderNumber && orderNumber.padStart(6, '0')}`}
                >
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal onClose={modalClose} title={'Детали ингредиента '}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal
                    onClose={modalClose}
                    title={`#{orderNumber && orderNumber.padStart(6, '0')}`}
                  >
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </div>
    </>
  );
};

export default App;
