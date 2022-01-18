export const getUserId = ()=>{
    let id =  localStorage.getItem("userId");
    if(!id) return "";
    return id;
}

export const saveUserId = (userId) => {
    localStorage.setItem("userId", userId);
};

export const removeUserId = () => {
    localStorage.removeItem("userId");
};
