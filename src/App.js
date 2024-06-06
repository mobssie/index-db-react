import React, { useEffect } from 'react';
import { useMutation, useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useUserStore from './common-code-store';
import { initDatabase } from './indexedDB';
import { useIndexedDB } from 'react-indexed-db-hook';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  const { add, getAll } = useIndexedDB('users');
  const { users, addUser, setUsers } = useUserStore();

  const mutation = useMutation(
    (newUser) => add(newUser),
    {
      onSuccess: (data, variables) => {
        console.log('User added with id:', data);
        addUser({ ...variables, id: data });
      },
      onError: (error) => {
        console.error('Error adding user:', error);
      }
    }
  );

  const { data: usersData, refetch: fetchUsers } = useQuery(
    'users',
    getAll,
    {
      onSuccess: (data) => {
        setUsers(data);
      },
      onError: (error) => {
        console.error('Error fetching users:', error);
      }
    }
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    const newUser = { name: 'John Doe', email: 'john.doe@example.com' };
    mutation.mutate(newUser);
  };

  return (
    <div>
      <h1>IndexedDB with React</h1>
      <button onClick={handleAddUser}>Add User</button>
      <ul>
        {usersData?.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

const AppWrapper = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

export default AppWrapper;