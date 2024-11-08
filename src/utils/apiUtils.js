// src/utils/apiUtils.js

export const loginUser = async (username, password) => {

    const loginAPIURL = "http://192.168.1.56/farmnamin/login.php"; 
  
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  
    const data = {
      username,
      password,
    };
  
    try {
      const response = await fetch(loginAPIURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });
  
      const responseData  = await response.text();
  
      if (responseData.Success) { 
        return responseData.id_user; 
      } else {
        throw new Error(responseData.Message); 
      }
    } catch (error) {
      throw new Error("Error: " + error.message);
    }
};


export const getUserProfile = async (id_user) => {
  try {
    const response = await fetch(`http://192.168.1.56/farmnamin/get_user_profile.php?id_user=${id_user}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile. Network response was not ok');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error); 
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
};

export const getUserVerificationStatus = async (username) => {
  try {
      const response = await fetch('http://192.168.1.56/farmnamin/check_verification.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }), 
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.isVerified; 
  } catch (error) {
      console.error('Failed to fetch verification status:', error);
      return false; 
  }
};