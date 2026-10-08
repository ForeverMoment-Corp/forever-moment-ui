/* eslint-disable no-console */
import axios from "axios";
// import store from '../store/index'
// import { authLogout } from '../modules/auth/store/actions'
import { removeLoginSession, getLoginSession } from "./storage";
import {
    decryptData,
    /* encryptData, */ decryptHeader,
    encryptData,
    encryptHeader,
    generateRandomIV,
} from "./webEncryptDecrypt";

// Using import.meta.env for Vite compatibility instead of process.env
const API_URL = import.meta.env.VITE_API_URL || import.meta.env.API_URL || '';

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common.Accept = "application/json";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const xpmHeader = {
    isAuthenticatedCall: 1,
    isEncryptedCall: 0,
    iv: `${import.meta.env.VITE_IV1 || ''}${import.meta.env.VITE_IV2 || ''}${import.meta.env.VITE_IV3 || ''}${import.meta.env.VITE_IV4 || ''}`,
};

const getXPmHeaderConfig = (config = {}) => {
    return {
        ...xpmHeader,
        ...config,
    };
};

const normalizeUrl = (baseURL: string, url: string) => {
    // Remove trailing slash from baseURL and leading slash from url
    const cleanBase = (baseURL || '').replace(/\/+$/, "");
    const cleanUrl = (url || '').replace(/^\/+/, "");
    // Handle cases where cleanBase is empty
    const fullUrl = cleanBase ? `${cleanBase}/${cleanUrl}` : cleanUrl;

    try {
        let urlObj = new URL(fullUrl);
        let encodedURI = urlObj.toString();
        return encodedURI;
    } catch (e) {
        // Fallback for relative URLs if base is not absolute
        return fullUrl;
    }
};

// Add request interceptor
axios.interceptors.request.use(
    async (config) => {
        // Add access token dynamically from storage for every request
        // This ensures the token is up-to-date even after login without page reload
        const token = getLoginSession("access_token");
        if (token) {
            (config.headers as any).accessToken = token;
            // Add Authorization header for JWT standard compliance
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!config.headers?.["x-pm-header"]) {
            const ivBase64 = generateRandomIV();
            const checksum = await encryptData(
                normalizeUrl(config.baseURL || '', config.url || ''),
                ivBase64,
            );
            config.headers["x-pm-header"] = await encryptHeader(
                getXPmHeaderConfig({ iv: ivBase64, checksum }),
            );
        }
        // Only encrypt if there's data to encrypt and it's not FormData
        if (config.data && !(config.data instanceof FormData)) {
            try {
                // config.data = await encryptData(config.data, iv);
                // Add header to indicate encrypted content
            } catch (error) {
                console.error("Request encryption failed:", error);
                // Continue with unencrypted data if encryption fails
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Modify response interceptor to include decryption
axios.interceptors.response.use(
    async (response) => {
        // Decrypt the response data if it exists and is marked as encrypted
        let xpmHeader = response?.config?.headers?.["x-pm-header"];
        if (xpmHeader) {
            const decryptedHeader = await decryptHeader(xpmHeader);
            if (decryptedHeader?.isEncryptedCall) {
                const iv = decryptedHeader?.iv;
                const processedData = response.data?.processedData;
                if (iv && processedData) {
                    try {
                        response.data = await decryptData(processedData, iv);
                    } catch (error) {
                        console.error("Response decryption failed:", error);
                    }
                }
            }
        }
        return response;
    },
    async (error) => {
        let xpmHeader = error.response?.config?.headers?.["x-pm-header"];
        if (xpmHeader) {
            const decryptedHeader = await decryptHeader(xpmHeader);
            if (decryptedHeader?.isEncryptedCall) {
                const iv = decryptedHeader?.iv;
                const processedData = error.response.data?.processedData;
                if (iv && processedData) {
                    try {
                        error.response.data = await decryptData(processedData, iv);
                    } catch (error) {
                        console.error("Response decryption failed:", error);
                    }
                }
            }
        }

        // Normalize backend error structure to the frontend's expected 'message' field
        const status = error.response?.status;
        const data = error.response?.data;
        
        if (data && typeof data === 'object') {
            // 1. Map 'msg' to 'message'
            if (data.msg && !data.message) {
                data.message = data.msg;
            }
            
            // 2. Format 400 validation errors into the message body for UI display
            if (status === 400 && Array.isArray(data.errors) && data.errors.length > 0) {
                const errorList = data.errors.map((e: string) => `• ${e}`).join('\n');
                data.message = `${data.message || 'Validation failed'}\n${errorList}`;
            }
            
            // 3. Apply standard fallbacks based on HTTP status reference
            if (!data.message) {
                if (status === 404) data.message = "Requested resource not found";
                else if (status === 405) data.message = "Action not supported (Method Not Allowed)";
                else if (status === 409) data.message = "Business conflict occurred";
                else if (status === 413) data.message = "Uploaded file is too large";
                else if (status === 415) data.message = "Unsupported content type";
                else if (status >= 500) data.message = "Unexpected server error. Please contact support if the problem persists.";
            }
        }

        const finalMessage = data?.message || "An unexpected error occurred.";

        // Handle global redirects for Auth failures
        if (status === 401) {
            removeLoginSession("access_token");
            location.href = "/unauthorized?redirect=true";
        } else if (
            status === 412 ||
            (status === 403 && finalMessage !== "You do not have permission. Please contact admin!")
        ) {
            removeLoginSession("access_token");
            location.href = "/denied?redirect=true";
        } else if (status === 404 || status === 405 || status === 409 || status === 413 || status === 415 || status >= 500) {
            // Ensure a toast is always shown globally for these server/business errors
            // Note: If components also throw a toast, it may duplicate, but this guarantees 100% coverage
            import("react-hot-toast").then(({ default: toast }) => {
                toast.error(finalMessage, { id: `global-error-${status}` }); // Using ID prevents duplicate toasts on the screen
            });
        }
        
        return Promise.reject(error);
    },
);

const encryptedGet = async (url: string, config: any = {}) => {
    const ivBase64 = generateRandomIV();
    const baseURL = axios.defaults.baseURL || '';
    const checksum = await encryptData(normalizeUrl(baseURL, url), ivBase64);
    const xpmHeader = await encryptHeader(
        getXPmHeaderConfig({ iv: ivBase64, isEncryptedCall: 1, checksum }),
    );
    config.headers = {
        "x-pm-header": xpmHeader,
    };
    return axios.get(url, {
        ...config,
        headers: {
            ...axios.defaults.headers.common,
            ...config.headers,
        },
    });
};

const encryptedPost = async (url: string, data: any, config: any = {}) => {
    const ivBase64 = generateRandomIV();
    const baseURL = axios.defaults.baseURL || '';
    const checksum = await encryptData(normalizeUrl(baseURL, url), ivBase64);
    const xpmHeader = await encryptHeader(
        getXPmHeaderConfig({ iv: ivBase64, isEncryptedCall: 1, checksum }),
    );
    config.headers = {
        "x-pm-header": xpmHeader,
    };
    const encryptedPayload = {
        processingData: await encryptData(data, ivBase64),
    };
    return axios.post(url, encryptedPayload, {
        ...config,
        headers: {
            ...axios.defaults.headers.common,
            ...config.headers,
        },
    });
};
export { encryptedGet, encryptedPost };
export default axios;
