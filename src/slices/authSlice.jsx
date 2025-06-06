import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";



// Making change as per Raghav Agrawal: -



// Function to check if the token is expired
const isTokenExpired = (token) => {
    if (!token) return true; // If there's no token, consider it expired
    try {
        const decoded = jwtDecode(token); // Decode the token
        return decoded.exp < Date.now() / 1000; // Compare expiry time
    } catch (error) {
        return true; // If decoding fails, treat token as expired
    }
};


const storedToken = localStorage.getItem("token");
const validToken = storedToken && !isTokenExpired(storedToken) ? storedToken : null;

if (!validToken) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("total");
    localStorage.removeItem("totalItems");
    
}

const initialState = {
    signupData: null,
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
    loading:false
}

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setSignupData: (state,value) =>{
            state.signupData = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
          },
        setToken(state, value) {
        state.token = value.payload;
        },
    }
})

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;