export function login(payload) {
    return {
        type: "LOG_IN",
        payload,
    };
}

export function logout(payload) {
    return {
        type: "LOG_OUT",
        payload,
    };
}
