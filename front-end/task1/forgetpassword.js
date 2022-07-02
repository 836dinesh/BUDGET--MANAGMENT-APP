function showPassword(e){
    e.preventDefault();
    const email=document.getElementById('email').value
    const emailObj={
        email
    }
    axios.post('http://localhost:2500/password/forgetpassword', emailObj)
    .then((res)=>{
        if(res.status === 200){
            document.body.innerHTML += '<div style="color:green;">Mail Successfuly sent <div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
    })
   .catch(err => {
    document.body.innerHTML += `<div style="color:red;">${err} <div>`;
})
}