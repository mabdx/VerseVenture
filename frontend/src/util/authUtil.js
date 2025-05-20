
export const checkUserAuthentication = async () => {
  try {
    const response = await fetch('http://localhost:3001/Routes/GetUserID');
    if (!response.ok) {
      throw new Error('Failed to fetch user ID');
    }
    const data = await response.json();
    return data; // Assuming -1 is returned when the user is not logged in
  } catch (error) {
    console.error('Error checking user authentication:', error);
    return false;
  }
};
