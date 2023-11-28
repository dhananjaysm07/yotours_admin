import { useState, useEffect } from 'react';

type AdminCheck = {
  isAdmin: boolean;
  loading: boolean;
};

export default function useAdminCheck(): AdminCheck {
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Assuming you've set up an API endpoint to check if the user is an admin
    fetch('/api/is-admin')
      .then(res => res.json())
      .then(data => {
        setIsAdmin(data.isAdmin);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to check admin status:", error);
        setLoading(false);
      });
  }, []);

  return { isAdmin, loading };
}
