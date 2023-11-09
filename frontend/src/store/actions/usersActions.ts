import { createActionCreators } from 'immer-reducer';

import { AsyncAction } from '@/store/actions/common';
import { userActions } from '@/store/actions/userActions';

import { IChangeUserInOrganisationBody, IUserSettings, PopupTypes } from '@/store/reducers/user';
import { IOrganisationUser, UsersReducer } from '@/store/reducers/users';

export const usersActions = createActionCreators(UsersReducer);

export type UsersActions = ReturnType<typeof usersActions.setUsers>;

export const getSysAdminUsersAction = (): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    const users = await mainApiProtected.getSysAdminUser();

    dispatch(usersActions.setUsers(users));
  } catch (error: any) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getUsersAction = (orgId: number): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    const users = await mainApiProtected.getUsersForPreferences(orgId);

    dispatch(usersActions.setUsers(users));
  } catch (error: any) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const setUsersAction = (userId: number, body: IUserSettings): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.setUserSettings(userId, body);

    dispatch(userActions.setPopup({
      type: PopupTypes.SUCCESS,
      mainText: 'Changes saved',
      additionalText: 'Details have been updated',
    }));
  } catch (error: any) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const deleteUserByOrganisation = (user: IOrganisationUser, close: () => void): AsyncAction => async (
  dispatch,
  _,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.deleteUserByOrganisation(user.id, user.organisation);
    await dispatch(getUsersAction(user.organisation));

    close();

    dispatch(userActions.setPopup({
      type: PopupTypes.SUCCESS,
      mainText: 'Success Delete User',
      additionalText: `User "${user.firstName} ${user.lastName}" was deleted`,
    }));
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.isAxiosError ? error.message : 'Something went wrong';

    dispatch(userActions.setPopup({
      mainText: 'Error',
      additionalText: errorMessage,
      type: PopupTypes.ERROR,
    }));
  }
};

export const changeUserStatusInOrganisation = (
  body: IChangeUserInOrganisationBody,
): AsyncAction => async (
  dispatch,
  getState,
  { mainApiProtected },
) => {
  try {
    await mainApiProtected.changeUserStatusInOrganisation(body);
  } catch (error: any) {
    console.error(error);
    return Promise.reject(error);
  }
};
