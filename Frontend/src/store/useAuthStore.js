import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5002/api" : "/";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUP: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,
    onlineUsers: [],
    socket:null,

    checkAuth: async () => {
        set({isCheckingAuth: true});
        try {
            const response = await axiosInstance.get("/auth/check");
            set({authUser: response.data});
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error)
            set({authUser: null})
        } finally {
            set({ isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        try {
            set({isSigningUP: true});
            const response = await axiosInstance.post('/auth/signup', data);
            set({authUser: response.data});
            toast.success('Account created successfully!');
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUP: false});
        }
    },


    login: async (data) => {
        set({isLoggingIn: true});
        try {
            const response = await axiosInstance.post('/auth/login', data);
            set({authUser: response.data});
            toast.success('Logged in successfully!');

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({isLoggingIn: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({authUser: null});
            toast.success('Logged out successfully!');
            get().disconnectSocket();
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile: true});
        try {
            const response = await axiosInstance.put('/auth/update-profile', data);
            set({authUser: response.data});
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response.data.message);
        } finally {
            set({isUpdatingProfile: false});
        }
    },

    connectSocket: () => {
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query:{
                userId: authUser._id,
            },
        })
        socket.connect()

        set( {socket:socket} );

        socket.on("getOnlineUsers", (userIds) => {
            set ({ onlineUsers: userIds });
        })
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    }

}));
