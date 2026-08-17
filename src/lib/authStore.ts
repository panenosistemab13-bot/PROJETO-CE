export interface User {
  id: string;
  fixedName: string;
  login: string;
  password: string;
  role: string;
  profilePic?: string;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'master',
    fixedName: 'Jefferson',
    login: 'jeff',
    password: '#trescafe2027',
    role: 'Mestre',
  },
  {
    id: 'user1',
    fixedName: 'Cristiane Fialho',
    login: 'crisfialho',
    password: '123',
    role: 'Administrador CCO',
  }
];

export const getAuthUsers = (): User[] => {
  const usersStr = localStorage.getItem('cco_auth_users');
  if (usersStr) {
    return JSON.parse(usersStr);
  }
  localStorage.setItem('cco_auth_users', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
};

export const saveAuthUsers = (users: User[]) => {
  localStorage.setItem('cco_auth_users', JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('cco_user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const updateCurrentUserSession = (user: User) => {
  localStorage.setItem('cco_user', JSON.stringify(user));
};
